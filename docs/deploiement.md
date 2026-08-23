# Déploiement — architecture et exploitation

> Valeurs réelles (IP, clés, emails) : `docs/DEVOPS-SECRETS.local.md` (gitignoré — repo
> public). Secrets GitHub : [`DEVOPS-SECRETS.md`](DEVOPS-SECRETS.md). Dev : [`dev-docker.md`](dev-docker.md).

## Vue d'ensemble

```
push dev  ─▶ _tests ─▶ merge dev→test ─▶ _build (GHCR front:<sha> + :staging) ─▶ _deploy STAGING
push main ─▶ _promote (:staging → :prod, :latest — sans rebuild)            ─▶ _deploy PROD
```

- **`ci.yml`** : orchestrateur (déclencheurs `dev` / `main`, `pull_request` vers `dev` → tests seuls).
- **`_tests.yml`** : audit deps prod, lint (ESLint + Stylelint), Prettier, tests unitaires +
  coverage (seuils `karma.conf.js`), build SSR, e2e + a11y Playwright contre ce build.
- **`_build.yml`** : une image, `docker/front/Dockerfile` (contexte = racine, embarque `images/`),
  taguée `:<sha>` (immuable) + `:staging` ; cache BuildKit GitHub.
- **`_deploy.yml`** : **un** job SSH paramétré, identique staging/prod : pousse le `.env`, `git reset`
  sur la branche suivie, **asserte** la présence du réseau Docker `edge` (fourni par `infra-vps`,
  échec explicite sinon), `compose pull` (retry) + `up -d`, puis **vérifie** : `/health` dans le
  conteneur, TLS + `/health` + marqueur `ng-server-context="ssg"` sur chaque domaine de
  `CADDY_DOMAINS` (self-heal du certificat edge si besoin : redémarrage du Caddy de l'edge,
  résolu par ses labels Compose).
- **`_promote.yml`** : `docker buildx imagetools create` — retag pur, aucun rebuild.

`test` ne déclenche jamais le pipeline ; `main` n'est atteint que par un merge manuel
`test → main` (gate humain). La prod déploie **exactement** l'image validée en staging.

## L'image `front`

| Stage | Contenu |
|---|---|
| `build` | `node:24-alpine`, `npm ci` (postinstall `gen-env.mjs`), `npm run build`, `build-info.json` (runId/sha/ref/date) |
| `runtime` | `node:24-alpine`, user `node`, `dist/front-portfolio/{server,browser}` + `images/`, `HEALTHCHECK /health`, `CMD node dist/front-portfolio/server/server.mjs` |

Le bundle SSR est **autonome** (express / compression / @angular/ssr inlinés par esbuild) :
aucun `node_modules` au runtime. Le serveur :

- sert `images/` sous **`/img`** (`IMAGES_DIR`, cache 1 j + SWR) — `IMAGE_SERVER_URL=/img`
  est compilé dans le bundle (défaut de `gen-env.mjs`) ;
- émet les **headers de sécurité** (CSP stricte, HSTS, anti-framing, referrer) —
  `src/server/security-headers.ts`, ex-vhost Apache ; HSTS / `upgrade-insecure-requests`
  seulement quand `X-Forwarded-Proto: https` (posé par l'edge) ;
- `ROBOTS_NOINDEX=1` → `X-Robots-Tag: noindex, nofollow` (staging).

### Build-once et config compilée

`SITE_URL` et `IMAGE_SERVER_URL` sont **compilés** (canonical, JSON-LD, robots, sitemap,
URLs d'images). L'image embarque donc les valeurs de **production** et staging sert le
même bundle sous `test.charles-lindecker.com` :

| Variable runtime | Staging | Prod | Rôle |
|---|---|---|---|
| `NG_ALLOWED_HOSTS` | `test.charles-lindecker.com` | `charles-lindecker.com,www.…` | garde SSRF d'@angular/ssr (sinon fallback CSR silencieux) |
| `ROBOTS_NOINDEX` | `1` | `0` | staging jamais indexé (ses canonical pointent la prod) |
| `CADDY_DOMAINS` | `test.charles-lindecker.com` | `charles-lindecker.com, www.…` | label → certificat + route edge |

Trade-off assumé : `robots.txt` / `sitemap.xml` / canonical de staging référencent la prod
— sans effet car staging est `noindex`. Le jour où une valeur doit varier par environnement
sans rebuild, elle devra devenir runtime (injection au SSR), pas build-arg.

## Sur le VPS

```
(edge)                          # edge proxy partagé (caddy-docker-proxy + socket proxy RO) :
                                # déployé et possédé par le dépôt d'infrastructure infra-vps (privé)
/opt/monportfolio-staging/      # checkout de `test` + .env (= ENV_STAGING)  → projet monportfolio-staging
/opt/monportfolio-prod/         # checkout de `main` + .env (= ENV_PROD)     → projet monportfolio-prod
```

Aucun port publié par les stacks : l'edge détient 80/443, lit le label `caddy` du conteneur
`front` (réseau externe `edge`), émet les certificats Let's Encrypt et proxifie vers `:4000`.
Les deux environnements (et d'autres projets, ex. LoDB) cohabitent : isolation par
`COMPOSE_PROJECT_NAME`, TLS centralisé.

L'edge et les deux réseaux Docker externes `edge` / `observability` appartiennent au dépôt
d'infrastructure **`infra-vps`** (privé), déployé **avant** tout projet applicatif. Ce repo n'en
converge rien : `_deploy.yml` se contente d'asserter la présence du réseau `edge` et échoue
explicitement s'il manque. Le contact Let's Encrypt de l'edge n'est pas un secret de ce repo.

### Onboarder un projet derrière l'edge (la « méthode »)

Aucune modification côté edge. Dans le `compose` du projet, sur son conteneur public :

```yaml
services:
  front:
    networks: [default, edge]
    labels:
      caddy: mon-domaine.com, www.mon-domaine.com   # domaines du projet
      caddy.reverse_proxy: "{{upstreams 4000}}"      # port interne du conteneur

networks:
  edge:
    external: true
    name: edge
```

+ un `COMPOSE_PROJECT_NAME` unique par projet/environnement (isolation des namespaces
Docker). Caddy détecte le conteneur, émet le certificat et route automatiquement. Pour
exposer en plus des métriques applicatives (réseau `observability` + labels `prometheus.*`),
voir la documentation d'`infra-vps`.

## Migration vers le nouveau serveur (one-shot)

1. **Serveur** : Docker Engine + `docker compose`, `git`, `curl` ; ports 80/443 ouverts.
   **Déployer `infra-vps` d'abord** (edge + réseaux `edge` / `observability`) : la pipeline
   de ce repo refuse de déployer tant que le réseau `edge` n'existe pas.
2. **Clé de déploiement** : `ssh-keygen -t ed25519 -f ~/.ssh/monportfolio_deploy -N ""`,
   clé publique dans `~/.ssh/authorized_keys` de l'utilisateur de déploiement (`root` par
   défaut, ou un membre du groupe `docker` pouvant écrire `/opt`).
3. **Secrets GitHub** : remplir `scripts/secrets.local.env` (IP du VPS), puis
   `bash scripts/setup-secrets.sh` — cf. `DEVOPS-SECRETS.local.md`.
4. **DNS staging** : `test.charles-lindecker.com` → A/AAAA du nouveau VPS.
5. **Premier déploiement staging** : push sur `dev` → `_build` publie l'image ; passer le
   package GHCR `monportfolio/front` en **public** (ou `docker login ghcr.io` persistant sur
   le VPS), relancer le job `deploy-staging` si le pull a échoué. Vérifier :
   `https://test.charles-lindecker.com/health`, `/build-info.json`, `/img/photos/640x960_me-1.webp`,
   en-têtes (`curl -sI`), `X-Robots-Tag: noindex`.
6. **Bascule prod** : merge `test → main` **avant** de toucher au DNS. Le job `deploy-prod`
   déploie le conteneur (invisible publiquement) puis **échoue au contrat public** tant que
   `charles-lindecker.com` pointe l'ancien VPS (l'Apache historique répond 404 sur `/health`) :
   attendu. **Ne pas relancer le job en boucle** avant la bascule (chaque tentative ACME ratée
   compte dans les limites Let's Encrypt). TTL DNS court (300 s) la veille.
7. **DNS prod** : `charles-lindecker.com` + `www` → nouveau VPS. Dès que `dig +short
   charles-lindecker.com` renvoie la nouvelle IP, **re-run** du job `deploy-prod` (Actions →
   run → *Re-run failed jobs*) : le contrôle transport relance l'edge si le certificat
   n'a pas encore été émis (Caddy réessaie seul, mais en backoff croissant), puis le contrat
   public passe. Fenêtre sans certificat valide = entre la propagation DNS et ce re-run.
8. **Retour arrière** : DNS vers l'ancien VPS (Apache + systemd y tournent toujours, intacts
   tant qu'ils ne sont pas décommissionnés).
9. **Décommission de l'ancien VPS** (après 48 h de stabilité) : `images.charles-lindecker.com`
   n'est plus servi (les images sont sous `/img`) — optionnel : rediriger ce sous-domaine
   vers `https://charles-lindecker.com/img` tant que des liens externes existent ; couper
   Apache / `angular-portfolio*.service` ; mettre à jour les mentions légales / politique de
   confidentialité (hébergement : edge Caddy + conteneur Express, journaux du conteneur).
   Les secrets GitHub legacy ont déjà été supprimés (2026-08-22).

## Exploitation

> Toute commande manuelle dans `/opt/monportfolio-<env>` repose sur la ligne
> `COMPOSE_FILE=compose.yaml:compose.deploy.yaml` du `.env` de l'hôte (sinon Compose
> merge `compose.override.yaml` et relancerait le **dev-server**). Garde-fou avant d'agir :
> `docker compose config --services` doit afficher **uniquement** `front`.

| Besoin | Commande (sur le VPS, dans `/opt/monportfolio-<env>`) |
|---|---|
| État / logs | `docker compose ps` · `docker compose logs -f --tail 100 front` |
| Rollback image | `IMAGE_TAG=<sha>` dans `.env` puis `docker compose pull && docker compose up -d` (chaque build est tagué `:<sha>` — retrouver le sha dans `build-info.json` ou GHCR) ; ou re-run d'un ancien job `deploy-*` |
| Edge | `docker logs -f edge-caddy-1` (émission certs) — exploitation complète depuis `infra-vps` |
| Build servi | `curl -s https://<domaine>/build-info.json` (runId = run GitHub du build, sha = commit `dev` déclencheur) |

Un déploiement = recréation du conteneur (`up -d`) : coupure de quelques secondes, l'edge
répond 502 pendant le redémarrage (pas de page de maintenance dédiée — à ajouter via un label
`caddy.handle_errors` si besoin). Les chunks hashés de la release précédente ne sont plus
recopiés : un onglet ouvert pendant le déploiement recharge (garde d'extension → 404
`text/plain`, jamais de HTML sur un `.js`).

## Configuration applicative

Voir `.env.example` (racine) : `SITE_URL` / `IMAGE_SERVER_URL` injectés au build par
`front-portfolio/scripts/gen-env.mjs` ; `PORT` / `HOST` / `NODE_ENV` / `IMAGES_DIR` /
`NG_ALLOWED_HOSTS` / `ROBOTS_NOINDEX` lus au runtime par le serveur SSR (`environment:`
de `compose.yaml`, valeurs du `.env` de l'hôte).
