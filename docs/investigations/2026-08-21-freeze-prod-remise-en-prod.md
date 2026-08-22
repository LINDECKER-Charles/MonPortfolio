# Diagnostic final — freezes du front en production lors des remises en prod

## 1. Réponse directe : effet de bord test→prod via config partagée ?

**Partiellement oui — mais pas par le canal soupçonné, et ce n'est pas la cause du freeze lui-même.**

Le constat le plus grave (vérifié en live le 2026-08-21) : **le domaine prod sert aujourd'hui l'arbre déployé par la pipeline TEST du 08/08** (`main-W3ZAQXAT.js` avec `Last-Modified: 2026-08-08 14:01:54` et ETag identiques sur `charles-lindecker.com` et `test.charles-lindecker.com`, alors que le deploy prod réussi du 13/08 aurait posé des mtimes du 13/08). Le partage test↔prod est donc réel, mais il est **au niveau runtime** (unit systemd / port / vhost croisé, ou copie manuelle `cp -a` postérieure au 13/08 — sous-mécanisme à trancher sur le VPS, cf. §5), pas au niveau d'une config applicative partagée.

Verdict par élément partagé :

| Élément partagé | Cause du freeze ? | Verdict |
|---|---|---|
| **Runtime prod ↔ arbre test** (unit/port/vhost ou cp manuel) | **Oui, indirectement** | CONFIRMÉ (F1) : chaque push `dev` fait `rm -rf` + restart sur ce que la prod sert réellement ; le push `main` réécrit un dossier que personne ne sert |
| Serveur d'images (`rsync --delete` depuis dev) | Non | Écarté : aucun code n'attend `load`/`decode` ; visuel cassé possible, jamais un gel JS |
| Instance Apache unique + reload par la pipeline dev | Non | Écarté : `configtest` + reload graceful, workers mod_proxy distincts par backend ($TEST_SSR_PORT/$PROD_SSR_PORT) |
| Artefact GitHub `angular-dist` de même nom | Non | Écarté : scopé par run (`download-artifact@v7` sans `run-id`) |
| Groupe concurrency `deploy-apache` | Non | Écarté : sérialisation seulement (`cancel-in-progress: false`) |
| Logs Apache communs (`mates_*.log`) | Non | Pas causal — mais rend le diagnostic inattribuable (à corriger) |
| `mod_proxy` sans `retry=` (503 pendant 60 s) | Non | **RÉFUTÉ** : `ProxyPass` simple sans balancer reçoit `PROXY_WORKER_IGNORE_ERRORS` (proxy_util.c:2170-2172, stable depuis ~2.4.25) → l'état d'erreur 60 s est impossible ; `retry=0` serait un no-op |

Le freeze lui-même a **trois causes racines propres au dépôt**, qui existeraient même sans le câblage croisé — le câblage croisé explique surtout pourquoi il se déclenche « à la remise en prod » : l'historique montre le pattern push `dev` quelques minutes avant le merge `main` (23/06 19:53→19:57 ; 11/06 13:31→13:41), donc la casse infligée par la pipeline test précède de peu la mise en prod observée.

---

## 2. Causes racines (probabilité × impact)

### RC1 — Le vhost prod sert l'arbre/le process de test *(prob. haute × impact critique)*

- **Mécanisme** : `appleboy/scp-action` = tar → les mtimes VPS = instant du step « Download artifact » du run qui a posé les fichiers. Tous les assets servis par la prod portent la fenêtre Download du run test 31260862433 (08/08 14:01:52→55), pas celle du run prod 31695244868 (13/08 11:25:12). Les headers CORS diffèrent entre les deux domaines → deux vhosts distincts répondent, mais aboutissent au même contenu.
- **Preuves** : ETag `W/"be46-19fe1ae2450"` identique prod/test (0x19fe1ae2450 = 2026-08-08T14:01:54Z), SHA256 des corps identiques, DNS direct <IP VPS> (pas de CDN), `gh run view` des deux runs.
- **Forme du freeze** : chaque push `dev` inflige à la prod la fenêtre de casse RC2 (~15 s mesurés le 08/08 : clean 14:01:58 → fin scp 14:02:13) + la casse RC3 sur les onglets ouverts. Un push `main` seul n'a aucun effet visible.
- **Réserve** : le sous-scénario « `cp -a` manuel test→prod après le 13/08 » (précédent du 07/06 en mémoire) produirait les mêmes observations HTTP sans câblage croisé ; les commandes du §5 discriminent.

### RC2 — Déploiement wipe-and-replace non atomique *(prob. haute × impact fort, fenêtre ~10-15 s par deploy)*

Fusion des findings pipeline:F2, apache:APACHE-2, ssr-runtime:R2 — même mécanisme, trois angles.

- **Mécanisme** : 3 sessions SSH séparées (`find … rm -rf` → scp/tar → `systemctl restart`, timings réels 13/08 : 11:25:16 → 11:25:25 → 11:25:27). Pendant la fenêtre, l'ancien process Node répond avec son **cache de modules ESM** : le HTML prérendu des routes chaudes (`text: () => import('./assets-chunks/…_html.mjs')`) est servi de mémoire et référence `main-OLD.js` supprimé → `express.static` miss → fallthrough → route `**` (`RenderMode.Server`, status 404) → **404 en `text/html` de 89 602 o** (reproduit en live) → le navigateur refuse le module (statut non-2xx + strict MIME checking des modules ES) → **page prérendue affichée mais jamais hydratée** : bouton d'entrée mort, routerLink inertes, pas d'audio/GSAP = « freeze » exact. Routes froides jamais importées par ce process → `ERR_MODULE_NOT_FOUND` → `.catch(next)` → **500 Express brut avec stack et chemins absolus** (pas de handler d'erreur, `NODE_ENV` probablement non-production). Au restart : connexions in-flight coupées (AH01102 → 502, ou fermeture sans réponse si keep-alive, mod_proxy_http.c:1111-1141) + ~1-2 s de 503, sans `ErrorDocument`.
- **Preuves** : reproduction locale complète (suppression des fichiers sous un process vivant : `/` → 200 stale 166 657 o, `/linktree` → 500 ERR_MODULE_NOT_FOUND, récupération sans restart après recopie) ; sonde live `/chunk-ZZZZZZZZ.js` → `404 text/html 89602` ; timings `gh run view`.
- **Aggravants** : un visiteur ayant chargé pendant la fenêtre reste figé **après** la fin du deploy (jusqu'à F5) ; `cancel-in-progress: true` couvre aussi le job deploy → une annulation entre clean et scp laisserait la prod cassée ; échecs SSH transitoires avérés sans rollback (runs 27574426979, 28052891892, 24415091988).

### RC3 — Onglets ouverts avant le deploy : chunk lazy supprimé → NavigationError non géré → overlay noir permanent *(prob. haute × impact fort, fenêtre illimitée)*

Fusion de pipeline:F3, ssr-runtime:R1, client-runtime:C1, shared-config:F1 — même mécanisme.

- **Mécanisme** : toutes les routes en `loadComponent` sans preloading (`app.config.ts:21`), `outputHashing: all`, et le deploy supprime définitivement les anciens `chunk-*.js`. Un onglet chargé avant le deploy qui navigue vers une route dont le chunk n'est **pas dans son cache HTTP** fait `import('/chunk-OLD.js')` → 404 `text/html` (page NotFound SSR) → `TypeError: Failed to fetch dynamically imported module` → le Router émet `NavigationError`, `restoreHistory`, jamais de `NavigationEnd`. Or `page-transition.ts:68` n'écoute que `NavigationStart|NavigationEnd` : l'overlay (fixed inset:0, z-index 300, radial noir 0.92→0.98) monté à `autoAlpha:1` au `NavigationStart` **n'est jamais rabattu** → **écran quasi noir avec la rune dorée, permanent jusqu'à F5**. Re-cliquer ne fait rien : Chromium mémorise l'échec dans sa module map (0 requête réseau au 2e clic — reproduit en simulation Playwright sur le build réel).
- **Preuves** : code repo (page-transition.ts:68/81, app.config.ts:21, grep négatif sur tout handler d'erreur de navigation), router 20.3.18 (`NavigationError` → reject, ~l.5026-5055), simulation Playwright, sonde live 404 text/html.
- **Portée** : indépendant de l'atomicité — même un deploy parfait le produit tant que les anciens chunks disparaissent. C'est le mécanisme qui touche **le dev lui-même** quand il teste sa prod dans un onglet déjà ouvert, des minutes ou des heures après le deploy — cohérence maximale avec « par moment le front freeze ». L'intermittence vient du cache HTTP (maxAge 1y) : seuls échouent les chunks jamais fetchés par ce navigateur dont le hash a changé.

### Écarté explicitement

- **apache:APACHE-1 (retry=60)** : réfuté sur code source Apache 2.4.63 — `ap_proxy_define_worker_ex` pose `PROXY_WORKER_IGNORE_ERRORS` pour tout worker hors balancer (proxy_util.c:2170-2172), la mise en erreur AH00959 est gardée par ce flag (l.4033). Aucun 503-60 s possible ; `grep AH00959 mates_error.log` doit revenir vide.

---

## 3. Chaîne d'événements la plus probable lors d'une « remise en prod »

Scénario type (pattern historique : push `dev` puis merge `main` à quelques minutes). Timings réels des runs 31260862433 (test) et 31695244868 (prod). Sous l'hypothèse F1-câblage (le process derrière le vhost prod lit l'arbre test) :

| T | Événement | Effet visible sur charles-lindecker.com |
|---|---|---|
| T−3 min | Push `dev` → job `ci` | — |
| **T+0 s** | deploy-test, step Clean : `find /var/www/portfolio-test -mindepth1 -maxdepth1 … rm -rf` (~1 s) | Le disque que la prod sert réellement est vidé |
| **T+1→9 s** | scp : upload tar + `tar -zxf` in-place | Routes chaudes : HTML stale (cache ESM) → scripts en 404 text/html → **page visible, jamais hydratée**. Routes froides : **500 brut** ERR_MODULE_NOT_FOUND. Chaque asset manquant coûte un rendu SSR 404 de 89 Ko |
| **T+9→11 s** | `systemctl restart angular-portfolio-test` | Connexions in-flight coupées (502 / fermeture sans réponse), ~1-2 s de refus de connexion, aucun ErrorDocument |
| **T+11 s** | Nouveau process, nouvel arbre | Nouveaux visiteurs : OK. **Mais** tout visiteur ayant chargé dans la fenêtre reste figé jusqu'à F5 |
| T+11 s → ∞ | Onglets ouverts avant T (dont celui du dev) | Premier clic vers une route au chunk changé et non caché → **overlay noir + rune permanent** (RC3), re-clic inerte (0 requête) |
| **T+~5 min** | Push `main` → deploy-prod : clean/scp/restart sur `/var/www/portfolio` + `angular-portfolio.service` | **Aucun effet visible** (personne ne sert cet arbre) — ou restart d'un process qui sert l'arbre test, rejouant une micro-coupure |
| T+~10 min | apply-apache (groupe sérialisé) : configtest + reload graceful | Aucun effet |

Le dev observe donc : « je remets en prod → le front freeze » — alors que la casse a été infligée par la pipeline **test** quelques minutes avant, et que son propre onglet subit RC3 au moment où il vérifie. Sous l'hypothèse alternative « cp -a manuel », les lignes T+0→T+11 s'appliquent au deploy `main` lui-même (RC2/RC3 identiques) et les pushes `dev` sont inoffensifs pour la prod ; le §5 tranche.

---

## 4. Plan de correctifs priorisé

### Quick wins (déployables aujourd'hui, indépendants du diagnostic VPS)

**QW1 — Traçabilité de version + assertion post-deploy** (détecte RC1 immédiatement et pour toujours)

Dans le job `ci` des deux workflows, après le build, avant l'upload d'artefact :

```yaml
- name: Stamp build info
  run: |
    printf '{"runId":"%s","sha":"%s","env":"%s"}\n' \
      "$GITHUB_RUN_ID" "$GITHUB_SHA" "${TARGET_ENV}" \
      > front-portfolio/dist/front-portfolio/browser/build-info.json
```

Dans `deploy-prod` (`ci-cd-prod.yml`) et `deploy-test` (`ci-cd-test.yml`), en dernier step :

```yaml
- name: Verify served version matches this run
  run: |
    for i in $(seq 1 20); do
      body=$(curl -fsS "https://${DOMAIN}/build-info.json") && break || sleep 3
    done
    echo "$body" | grep -q "\"runId\":\"$GITHUB_RUN_ID\"" \
      || { echo "::error::La prod ne sert pas ce run: $body"; exit 1; }
```

**QW2 — `page-transition.ts` : rabattre l'overlay sur échec de navigation** (supprime l'écran noir de RC3)

```ts
filter((e) =>
  e instanceof NavigationStart || e instanceof NavigationEnd ||
  e instanceof NavigationError || e instanceof NavigationCancel ||
  e instanceof NavigationSkipped)
```

Factoriser le fade-out de `onNavigationEnd` en `hideOverlay()` ; l'appeler pour Error/Cancel/Skipped ; armer `gsap.delayedCall(8, hideOverlay)` au `NavigationStart` et le tuer au `NavigationEnd` (garde-fou).

**QW3 — `app.config.ts` : récupération sur chunk-load error** (transforme le freeze RC3 en rechargement transparent)

```ts
provideRouter(routes, withNavigationErrorHandler((e) => {
  const msg = String((e.error as Error | undefined)?.message ?? '');
  const isChunkError = e.error instanceof TypeError &&
    /dynamically imported module|Importing a module script failed/i.test(msg);
  if (!isChunkError || typeof location === 'undefined') return;
  try {
    if (sessionStorage.getItem('chunk-reload') === e.url) return; // anti-boucle
    sessionStorage.setItem('chunk-reload', e.url);
  } catch { /* storage indisponible : recharger quand même */ }
  location.assign(e.url); // e.url, pas e.target.url (target peut être undefined ici)
}))
```

La regex couvre Chromium/Firefox/Safari ; compatible CSP `script-src 'self'` (provider compilé). Nettoyer la clé sur `NavigationEnd`.

**QW4 — `server.ts` : health, garde d'extension, handler d'erreur**

```ts
app.get('/health', (_req, res) => { res.json({ ok: true }); });

// après express.static, AVANT angularApp.handle :
// ne jamais rendre du HTML SSR pour une requête de fichier
app.use((req, res, next) => {
  if (/\.[a-z0-9]+$/i.test(req.path)) { res.status(404).type('text/plain').send('Not Found'); return; }
  next();
});

// tout en bas :
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ssr]', err);
  res.status(500).type('html').send('<!doctype html><meta charset="utf-8"><title>Erreur</title><p>Erreur temporaire, rechargez la page.</p>');
});
```

La garde d'extension supprime aussi l'amplification CPU (rendu SSR 89 Ko par asset 404 scanné par les bots) et le blocage MIME devient un 404 propre. Aucune route applicative ne contient de point — sûr.

**QW5 — Concurrency : ne jamais annuler un deploy en cours** (`ci-cd-prod.yml`, idem test)

Supprimer la concurrency workflow-level ; la poser par job :

```yaml
jobs:
  ci:
    concurrency: { group: ci-prod-${{ github.ref }}, cancel-in-progress: true }
  deploy-prod:
    concurrency: { group: deploy-prod-angular, cancel-in-progress: false }
```

**QW6 — Apache : filet 502/503** (`config/portfolio-le-ssl.conf.template`, avant le `ProxyPass /`)

```apache
Alias /maintenance.html /var/www/maintenance.html
ProxyPass /maintenance.html !
ErrorDocument 502 /maintenance.html
ErrorDocument 503 /maintenance.html
```

**QW7 — Unit systemd prod (sur le VPS)** : `Environment=NODE_ENV=production` (les 500 actuels exposent stack + chemins absolus via finalhandler).

### Structurels

**S1 — Déploiement atomique par releases + symlink, en UN step SSH** (élimine RC2, réduit RC3) — remplace les steps clean/scp/restart de `ci-cd-prod.yml:115-144` et `ci-cd-test.yml:168-197` :

```yaml
- name: Upload release
  uses: appleboy/scp-action@v0.1.7
  with:
    source: "front-portfolio/dist/*"
    target: "${{ vars.VPS_DIR }}/releases/${{ github.run_id }}"
    strip_components: 1

- name: Activate release (atomique + health-check + rollback)
  uses: appleboy/ssh-action@v1
  with:
    script: |
      set -euo pipefail
      cd "${VPS_DIR}"
      new="releases/${GITHUB_RUN_ID}"
      prev="$(readlink current 2>/dev/null || true)"
      # conserver les assets hashés de la release précédente pour les onglets ouverts (RC3)
      if [ -n "$prev" ] && [ -d "$prev/dist/front-portfolio/browser" ]; then
        cp -an "$prev"/dist/front-portfolio/browser/chunk-*.js \
               "$prev"/dist/front-portfolio/browser/main-*.js \
               "$prev"/dist/front-portfolio/browser/styles-*.css \
               "$new/dist/front-portfolio/browser/" 2>/dev/null || true
      fi
      ln -sfn "$new" current.tmp && mv -Tf current.tmp current
      sudo systemctl restart "${FRONT_PROCESS}"
      ok=""
      for i in $(seq 1 20); do
        curl -fsS "http://127.0.0.1:${SSR_PORT}/health" >/dev/null && ok=1 && break; sleep 0.5
      done
      if [ -z "$ok" ]; then
        [ -n "$prev" ] && ln -sfn "$prev" current && sudo systemctl restart "${FRONT_PROCESS}"
        exit 1
      fi
      ls -dt releases/* | tail -n +4 | xargs -r rm -rf
```

Unit systemd correspondante : `ExecStart=/usr/bin/node ${VPS_DIR}/current/dist/front-portfolio/server/server.mjs`, `WorkingDirectory=${VPS_DIR}/current`, `Environment=PORT=$PROD_SSR_PORT` (prod) / `$TEST_SSR_PORT` (test), `Environment=NODE_ENV=production`. `uploads/` et `logs-app/` sortent de l'arbre releases (chemins absolus ou symlinks partagés). Le `cp -an` des assets hashés N-1 couvre la majorité des onglets ouverts sans multiplier les racines statiques.

**S2 — Corriger le câblage prod sur le VPS** (RC1) — après le diagnostic §5 : unit prod pointant sur `/var/www/portfolio`, `PORT=$PROD_SSR_PORT`, vhost prod → $PROD_SSR_PORT, puis `systemctl daemon-reload && systemctl restart angular-portfolio.service`. QW1 verrouille contre toute récidive.

**S3 — Optionnel : preloading différé post-hydratation** (réduit la surface RC3 sans dégrader le LCP — contrainte mémoire `lcp-animations-entrance`) : stratégie `withPreloading` custom déclenchée en `requestIdleCallback` après `NavigationEnd` initial, plutôt que `PreloadAllModules` eager.

**S4 — Hygiène observabilité** : séparer les logs Apache prod/test (`ErrorLog`/`CustomLog` distincts par vhost dans les templates) pour rendre les incidents attribuables.

---

## 5. Ce qui n'est pas vérifiable depuis le dépôt, et comment trancher sur le VPS

Non versionnés / non observables à distance : les **units systemd** (ExecStart, WorkingDirectory, `Environment=PORT`), la **valeur réelle des secrets** `APACHE_PROD_SSR_PORT`/`APACHE_TEST_SSR_PORT` au moment du dernier apply-apache, l'**état du filesystem** (`/var/www/portfolio` vs `portfolio-test`, symlinks, copies manuelles), `NODE_ENV` en prod, et les logs Actions expirés (410).

Séquence de diagnostic (5 min, lecture seule) :

```bash
# 1. Qui écoute sur quoi, et quel server.mjs
sudo ss -ltnp | grep -E ':$TEST_SSR_PORT|:$PROD_SSR_PORT'
for pid in $(pgrep -f server.mjs); do echo "== $pid"; readlink /proc/$pid/cwd; tr '\0' ' ' < /proc/$pid/cmdline; echo; done

# 2. Câblage déclaré
systemctl cat angular-portfolio.service angular-portfolio-test.service
grep -n ProxyPass /etc/apache2/sites-enabled/*.conf

# 3. État des arbres (le discriminant clé)
ls -la /var/www/ | grep -E 'portfolio'
stat -c '%y %n' /var/www/portfolio/dist/front-portfolio/browser/main-*.js \
                /var/www/portfolio-test/dist/front-portfolio/browser/main-*.js

# 4. Ce que sert chaque port en direct
curl -sI http://127.0.0.1:$PROD_SSR_PORT/main-W3ZAQXAT.js | grep -Ei 'etag|last-modified'
curl -sI http://127.0.0.1:$TEST_SSR_PORT/main-W3ZAQXAT.js | grep -Ei 'etag|last-modified'

# 5. Corrélation aux deploys (APACHE-1 réfuté doit se confirmer : zéro AH00959)
grep -E 'AH01102|AH01114|AH00959' /var/log/apache2/mates_error.log | tail -50
```

Table de décision sur le point 3 :

| Observation | Conclusion | Action |
|---|---|---|
| `/var/www/portfolio` : mtimes **13/08** ; `portfolio-test` : **08/08** | Le runtime prod lit l'arbre test → **câblage croisé** (unit ExecStart/WorkingDirectory, `PORT` partagé, ou vhost prod → $TEST_SSR_PORT — les points 1-2-4 désignent lequel) | S2 : corriger unit/vhost, restart, puis QW1 |
| `/var/www/portfolio` : mtimes **08/08** (identiques à test) | **Copie manuelle** `cp -a` test→prod postérieure au 13/08 (récidive de l'incident 07/06) ; câblage sain ; les pushes `dev` ne cassent pas la prod | Redéployer `main` (relance ci-cd-prod), puis QW1 pour rendre toute récidive visible |
| Ports $TEST_SSR_PORT/$PROD_SSR_PORT servis par le **même PID** ou même cwd | `PORT` partagé / unit dupliquée | S2 |

Dans **tous** les cas, RC2 et RC3 restent vrais et justifient S1 + QW2/QW3/QW4 indépendamment du résultat.
