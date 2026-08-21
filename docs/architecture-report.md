# Rapport d'architecture — état AVANT

> Passage du 2026-08-21 — synthèse arbitrée de 5 relectures (DRY, SOLID, KISS, infra/CI, tests/outillage).
> Objectif du chantier : **préparer la migration et l'évolution** — centraliser la configuration dans un `.env` racine, dockeriser le dev, fiabiliser le déploiement, puis monter Angular 20 → 22.
> Référence : les arbitrages du refacto 2026-06-11 (`docs/refacto/2026-06-11-refacto-maintenabilite.md`) sont **respectés** — aucun point rejeté n'est rouvert sans argument nouveau.

---

## 1. Cartographie projet & stack

```
MonPortfolio/
├── front-portfolio/        Angular 20.3 standalone zoneless · SSR @angular/ssr + Express (src/server.ts)
│   ├── src/app/            components/{page,misc,assets}, services, directives, seo/, img-sources/, utils/
│   ├── public/             assets non hashés : lang/ (22 locales × 14 ns), logo/, song/, robots.txt, sitemap.xml
│   ├── e2e/                Playwright (smoke + a11y)
│   └── scripts/            outillage node (⚠️ gitignoré, voir I3)
├── images/                 source du serveur d'images (rsync CI → images.charles-lindecker.com)
├── config/                 templates Apache (envsubst au déploiement)
├── .github/workflows/      ci-cd-test.yml, ci-cd-prod.yml, deploy-apache.yml + scripts/test-summary.mjs
├── docs/                   docs versionnées (refacto, legal, audits)
└── design/                 maquettes HTML (archivage acté en juin, non rouvert)
```

Stack : Tailwind 4, GSAP, Karma/Jasmine (71 specs, ~99 % lignes), Playwright, SSG (10 routes prérendues), i18n maison (fetch JSON par namespace, FR transféré par le SSR). Déploiement : scp + `systemctl restart` sur VPS, Apache en reverse-proxy.

**Constat transverse** : l'identité du site (~15 valeurs : domaines, ports, chemins VPS) est dispersée dans **12 fichiers + 7 secrets GitHub**, sans source unique ni validation croisée. C'est le principal obstacle à la migration.

---

## 2. Inventaire des tailles

Rappel des tolérances : CSS de composants autonomes et data déclaratives sont **tolérés** ; `fonts.css` est **généré** (ne pas éditer).

| Fichier | Lignes | Seuil | Verdict |
|---|---:|:---:|---|
| `constellation.css` | 790 | 🔴 | **Tolérer** — autonomie voulue du composant (arbitrage juin), aucun sélecteur mort vérifié |
| `projects.data.ts` | 643 | 🔴 | **Tolérer** — data déclarative |
| `linktree.css` | 625 | 🔴 | **Tolérer** — aucun sélecteur mort vérifié |
| `scripts/fill-works-common.mjs` | 558 | 🔴 | **Supprimer** — migration one-shot déjà appliquée (I3) |
| `fonts.css` | 443 | ⚠️ | **Tolérer** — auto-généré par `self-host-fonts.mjs` |
| `works-timeline.css` / `projects-timeline.css` | 439 / 435 | ⚠️ | **Tolérer** — vérifiés vivants ; 33 lignes triviales communes, fusion non rentable |
| `constellation.spec.ts` | 428 | ⚠️ | **Tolérer** — spec |
| `constellation.ts` | 424 | ⚠️ | **Tolérer** — reliquat = machine à états pointer ; extraction = couplage déplacé (KISS) |
| `audio-service.spec.ts` | 391 | ⚠️ | **Tolérer** — spec |
| `opening-animation.service.ts` | 388 | ⚠️ | **Tolérer** — split rejeté en juin, pas d'argument nouveau |
| `home-resume-header.css` | 368 | ⚠️ | **Tolérer** |
| `nav-barre.css` | 344 | ⚠️ | **Tolérer** |
| `legal-content.css` / `legal-layout.css` | 311 / 310 | ⚠️ | **Tolérer** |
| `photo-carousel.css` | 303 | ⚠️ | **Tolérer** |
| `app.routes.ts` | 298 | — | **Réduire** via manifeste de routes + helper `page()` (D1) |
| `audio-service.ts` | 275 | — | Tolérer (split rejeté) ; le catalogue sort de `App` (D3) |
| `translation.service.ts` | 212 | — | Tolérer ; retirer l'état modal UI (S2) |
| `ci-cd-test.yml` / `ci-cd-prod.yml` | 205 / ~170 | — | **Découper** via `workflow_call` (D11) — ~95 % identiques |

Garde-fou futur : règle ESLint `max-lines: 300` (warn) avec exemption `*.data.ts`, `*.source(s).ts`, `*.spec.ts` (Lot OUTILLAGE).

---

## 3. Violations retenues par principe

Les findings redondants des 5 relectures sont fusionnés ; les identifiants d'origine sont rappelés entre parenthèses.

### 3.1 CONFIG — configuration dispersée / hardcodée

| # | Violation | Fichiers:lignes | Correctif retenu |
|---|---|---|---|
| C1 | ~15 valeurs d'environnement dispersées dans 12 fichiers sans source unique (SITE_URL, IMAGE_SERVER_URL, ports, hosts, domaines Apache, chemins VPS) *(INF-01, S-01, CFG-02)* | `route-meta.ts:5-7`, `image-server.ts:6`, `index.html:14-43`, `robots.txt`, `sitemap.xml`, `angular.json:32-39`, `server.ts:69`, `lighthouserc.cjs:3`, `playwright.config.ts:3`, `config/*.template`, 3 workflows | `.env` racine + `gen-env.mjs` prebuild — architecture cible détaillée §5, Lot CONFIG |
| C2 | `allowedHosts` figés dans `angular.json` (test+prod embarqués dans chaque build) alors que `@angular/ssr` lit `NG_ALLOWED_HOSTS` au runtime ; un host absent = bascule CSR silencieuse (incident en mémoire) *(INF-04)* | `angular.json:32-39` | Ne garder que `localhost`/`127.0.0.1` au build ; `NG_ALLOWED_HOSTS` par environnement via `EnvironmentFile` systemd ; health-check `curl -H "Host: …"` + marqueur `ng-server-context` |
| C3 | Origine du serveur d'images en dur en 4 endroits (TS, preconnect HTML, CSP Apache ×2) alors que `${APACHE_IMAGES_DOMAIN}` existe déjà côté envsubst *(INF-03, CFG-02)* | `image-server.ts:6`, `index.html:43`, `config/portfolio*-le-ssl.conf.template:25` | `IMAGE_SERVER_URL` via ENV ; CSP `img-src … https://${APACHE_IMAGES_DOMAIN}` ; preconnect rendu par le template `index.html` |
| C4 | Metas absolues d'`index.html` mortes (écrasées par MetaService à chaque route, SSG inclus) et **divergentes** : og:image `logo.png` (PNG 263 Ko) vs `LOGO_URL` webp ; twitter:image `/meta/logo1.webp` → **404 en prod** *(INF-02, CFG-02, obs. dry)* | `index.html:14,21,22,32`, `route-meta.ts:6-7` | Supprimer canonical/og:image/og:url/twitter:image d'index.html (diff du HTML prérendu = preuve) ; **décision produit** : créer le visuel social `/meta/logo1.webp` ou changer `SOCIAL_IMAGE_URL` |
| C5 | Liens sociaux (GitHub/LinkedIn/mailto) recopiés dans 6 templates + `linktree.state.ts` + `route-meta.ts` (sameAs) *(CFG-02)* | `footer.html:32-66`, `resum-contact-links.html:3-47`, `resum-header.html:3`, `home-work.html:22`, `linktree.state.ts:55-154`, `route-meta.ts:21-24` | Module `site.config.ts` : `SITE.identity { github, linkedin, email, discord }` consommé par les composants |
| C6 | Tests figés sur les valeurs prod : regex `https://charles-lindecker.com` dans le spec des routes ; `lighthouserc.cjs` fige `localhost:4000` quand Playwright lit `E2E_PORT` (4173) *(T8)* | `app.routes.spec.ts:110-116`, `lighthouserc.cjs:3,22`, `playwright.config.ts:3` | Le spec importe `SITE_URL` ; lighthouserc lit `E2E_PORT` — prérequis pour que la bascule `.env` soit neutre en CI |

### 3.2 DRY — duplication

| # | Violation | Fichiers:lignes | Correctif retenu |
|---|---|---|---|
| D1 | **Catalogue des routes publiques déclaré 5 fois** (routes, server routes, e2e, Lighthouse, sitemap) + titres saisis 4-5× par route + sous-ensembles redéclarés (`EXCLUDED`, `LEGAL_PATHS`). Dérive déjà constatée : sitemap sans les 3 pages légales (`index,follow`) mais avec `/works` (`noindex`) *(DRY-01, K11, INF-12, T9)* | `app.routes.ts:33-283`, `app.routes.server.ts:8-19`, `e2e/routes.ts:12-21`, `lighthouserc.cjs:5-14`, `public/sitemap.xml`, `page-transition.ts:51`, `legal.constants.ts:7-11` | Manifeste unique `seo/site-routes.ts` (path, title, indexable, prerender, sitemap, transition) + export JSON pour CJS ; dérivés : `PRERENDERED_PATHS`, routes e2e/LH, `EXCLUDED` ; helper `page()` dans `route-meta.ts` ; `sitemap.xml` + `robots.txt` **générés** par le prebuild ; spec d'égalité des ensembles |
| D2 | Contrat des métas de route dupliqué par clés string : `buildRouteMeta` → `Data` non typé, App relit 14 clés et appelle 13 `updateX` de MetaService ; arbre de routes parcouru 2× (2 pipelines RxJS) *(DRY-08, S-03 — pas le SeoRouterService reporté : périmètre = contrat de données)* | `route-meta.ts:73-107`, `app.ts:92-137`, `meta-service.ts:12-70` | Interface `RouteMeta` typée ; `MetaService.applyRouteMeta(meta)` piloté par table déclarative `TAG_MAP` ; un seul flux `deepestRouteData$` partagé (`showFooter` + métas) ; valeurs émises identiques |
| D3 | Catalogue des 9 sons inline dans `App` (56 lignes de config dans le composant racine), clés `AudioKey = string` → faute de frappe = `console.warn` runtime dans 16 templates *(CFG-05, S-02)* | `app.ts:29-85`, `audio-service.ts:5`, `play-sound-on-click.directive.ts:14`, `opening.ts:96-109` | `audio/sound-catalog.ts` (`as const satisfies Record<string, RegisteredSound>`) + `type SoundKey = keyof typeof` ; enregistrement via `InjectionToken` dans `app.config.ts` ; `@Input` de la directive typé `SoundKey` → erreur strictTemplates à la compilation ; chemins `./song/` → `/song/` |
| D4 | Namespaces i18n synchronisés **par commentaire** entre `NAMESPACES` et `SERVER_FR_TRANSLATIONS` ; namespace `construction` **mort** depuis juin : 22 JSON fetchés à chaque changement de langue + embarqués dans le `ng-state` SSR de chaque page *(DRY-09, S-04, K2)* | `translation.service.ts:53`, `translation.server.ts:1-36`, `public/lang/construction/` (22 fichiers, 92 Ko) | Exporter `type Namespace` ; `SERVER_FR_TRANSLATIONS satisfies Record<Namespace, …>` → dérive = erreur de compilation ; retirer `construction` partout + supprimer le dossier |
| D5 | Sous-composants resum : 2 modules d'animation **identiques ligne à ligne** (à 2 détails près), 2 autres de même structure ; 3 CSS `.row/.label` dupliquées à 1 ligne près (~80 lignes ×3, media queries incluses) *(DRY-03)* | `resum-active-projects.animations.ts`, `resum-contact-links.animations.ts`, `resum-rune-icons.animations.ts`, `resum-header.animations.ts`, `resum-stack.css`, `resum-stats.css`, `resum-header.css:21-111` | Factory `createLiftHoverAnimations(config)` avec exports nommés préservant les valeurs exactes (specs GSAP inchangés) ; `resum-row.css` partagé via `styleUrls` + classe modificatrice `.label--round` |
| D6 | Verrou de scroll implémenté 3× avec sémantiques divergentes (projects.ts ne restaure pas) ; **5 HostListener Escape sur document** → bug vérifié : Escape dans la lightbox ferme tout le modal projet, contrairement à l'intention codée dans `projects-modal.ts:45-51` *(DRY-04, S-06 — variante KISS retenue, voir §4)* | `image-lightbox.ts:41-55`, `lang-modal.ts:32-47`, `projects.ts:148-166,182-187`, `projects-modal.ts:45-52`, `nav-barre.ts:87-92` | Util `lockBodyScroll(doc): () => void` (sauvegarde/restauration) utilisé par les 3 composants ; **supprimer** `projects.ts` `handleEscape` + gestion overflow (ProjectsModal possède déjà les deux) → corrige la cascade ; spec d'intégration Escape réel sur document |
| D7 | `ResponsiveImageSet` ré-emballé en 4 interfaces locales identiques avec renommage `fallbackSrc → fallback` → 18 remappages manuels *(DRY-06)* | `footer.ts`, `home-projects.ts`, `home-work.ts`, `projects-modal.ts`, `home-resume-banner.ts`, `photo-carousel.ts`, `linktree.state.ts`, `shared.sources.ts:4-7` | `LabeledImageSet extends ResponsiveImageSet { alt }` + helper `labeled()` dans `shared.sources.ts` ; supprimer les 4 interfaces ; templates `.fallback → .fallbackSrc` (strictTemplates verrouille) |
| D8 | 39 blocs CSS triples `X app-responsive-picture, X picture, X img` dans 22 fichiers redéclarant ce que le composant pose déjà ; 13 `object-fit: contain` parents **morts** (écrasés par le style inline du composant) *(DRY-07)* | `responsive-picture.css:1-17` + `.html:27-28`, `footer.css:108-114`, `primitives.css:145-152`, 19 autres | Supprimer les triplets redondants (~150 lignes, zéro rendu) ; retirer les `object-fit` morts (décision au cas par cas avec captures) ; documenter le contrat dans `responsive-picture.ts` |
| D9 | Gardes d'entrance dupliquées : bloc « visible au rendu initial » copié 2×, reduced-motion réimplémenté inline, `page-transition` maintient son propre drapeau `firstNavigation` redondant avec `NavigationContextService` ; instanciation du service par champ « effet de bord » jamais lu dans App *(DRY-10, S-05)* | `reveal-on-scroll.ts:55-66`, `linktree.ts:56-67`, `opening.ts:141`, `page-transition.ts:48-90`, `navigation-context.service.ts`, `app.ts:26-28`, `utils/motion.ts` | `shouldSkipEntrance(el, ctx)` dans `utils/motion.ts` (source unique de la politique LCP en mémoire projet) ; `page-transition` consomme `hasNavigated()` ; `provideEnvironmentInitializer(() => inject(NavigationContextService))` dans `app.config.ts` à la place du champ |
| D10 | `test.ps1` (70 l.) réimplémente en PowerShell les regex de `test-summary.mjs` ; seuils de couverture **affichés mais jamais appliqués** (régression 99 → 60 % = CI verte) *(K7, T6)* | `test.ps1:13-43`, `test.cmd`, `.github/scripts/test-summary.mjs:14-45`, `karma.conf.js:17-21` | `coverageReporter.check` dans karma.conf (statements/functions/lines 95, branches 85) ; script npm `test:ci` unique consommé par CI et wrapper local ; `test.ps1` délègue à `test-summary.mjs` |
| D11 | `ci-cd-test.yml` / `ci-cd-prod.yml` ~95 % identiques (job `ci` ~75 l. + job `deploy` ~50 l. mot pour mot) ; dérive déjà visible (coverage uploadé en test seulement) ; toute correction du déploiement devra être portée 2× *(K8, INF-05)* | `ci-cd-test.yml:24-197`, `ci-cd-prod.yml:22-144`, `deploy-apache.yml` (pattern `workflow_call` déjà adopté) | `.github/workflows/ci.yml` + `deploy-ssr.yml` réutilisables (`workflow_call`, inputs environment/vps-dir/service/ports) ; les 2 wrappers tombent à ~35 lignes |
| D12 | Templates Apache prod/test SSL identiques à 5 hunks près (préfixe de variable) ; bloc CORS/CSP/HSTS recopié dans le vhost :80 qui ne fait que rediriger (30 lignes mortes) ; + logs `mates_*` partagés prod/test, `LoadModule` dans un VirtualHost, headers CORS sans objet, **vhost test crawlable** (pas de X-Robots-Tag) *(INF-09, INF-10)* | `config/portfolio-le-ssl.conf.template`, `config/portfolio-test-le-ssl.conf.template`, `config/portfolio.conf.template:12-41`, `deploy-apache.yml:45-67` | Template SSL unique + table `base → préfixe env` dans le job ; vhost :80 réduit à la redirection ; logs `${APACHE_SITE}_*` ; `X-Robots-Tag noindex` sur test ; CSP images via variable (C3) |

### 3.3 SOLID / KISS — responsabilités et état

| # | Violation | Fichiers:lignes | Correctif retenu |
|---|---|---|---|
| S1 | Page Projects : seul composant hors signals dans une app zoneless — état mutable, getters `filteredProjects`/`availableTags` réalloués à chaque CD, dérivés statiques recalculés, clone inutile de `PROJECTS_DATA` *(S-08)* | `projects.ts:42,56-99,150-166` | `signal`/`computed` + `applyFilters` pure dans `projects.utils.ts` ; `PROJECT_TAGS`/`PROJECT_STACK` au niveau module ; **pas** de nouvelles couches |
| S2 | `TranslationService` porte l'état d'ouverture du modal de langue (bus UI implicite entre NavBarre et App) *(S-09)* | `translation.service.ts:88-89,153-154`, `app.html:36-38`, `nav-barre.html:113` | Signal `langModalOpen` dans App + `output()` de NavBarre ; retirer les 4 lignes du service |
| S3 | Cycle d'import `projects.data → *.source.ts → projects.state → projects.data` neutralisé uniquement par l'élision esbuild : `verbatimModuleSyntax` (recommandé pour Angular 22) le rendrait indéfini *(K4)* | `projects.state.ts:1-5`, 14 `img-sources/projects/*.source(s).ts`, `project-image.builder.ts:2-4` | `import type` dans les 14 sources ; pointer les 7 consommateurs vers `projects.types`/`projects.data` ; supprimer le shim `projects.state.ts` — **prérequis migration v22** |

### 3.4 DEAD — code et assets morts

| # | Violation | Fichiers:lignes | Correctif retenu |
|---|---|---|---|
| X1 | 4 composants + 1 pipe jamais référencés (~1 000 lignes specs incluses) : `scroll-lanterns`, `stop-all-sound` (mute repris par nav-barre), `sound`, `home-skills-passion` (scaffold), `TranslatePipe` *(K1)* | `components/assets/{scroll-lanterns,stop-all-sound,sound}/`, `home-skills-passion/`, `pipes/translate.pipe.ts` | Supprimer + clés i18n orphelines `common.audio.show/hide` (22 locales) + corriger `front-portfolio/CLAUDE.md:88,25` |
| X2 | `home-resume` : `HOME_RESUME_SNIPPETS` jamais rendu (textes FR en dur, divergents du JSON i18n — violation de la règle CLAUDE.md), 19 alias constants, champs `title/content/iconAlt` morts dans les snippets rendus *(K3, S-07)* | `home-resume.state.ts:14-65`, `home-resume.ts:79`, `home-resume-snippets.ts:21-107` | Réduire à `{ id, icon: ResponsiveImageSet }`, pointer `SHARED_IMAGES` directement ; `openId = signal<string\|null>` remplace les 5 `isOpen` mutés ; le JSON i18n reste l'unique source |
| X3 | `public/logo` : 40 fichiers orphelins (1,19 Mo) livrés dans chaque build/artefact/scp *(K6)* | `public/logo/`, `index.html:21`, `shared.sources.ts:93-95` | Supprimer les orphelins (garder les 3 tailles `logo_white` + `40x40` png + `organisme/`) ; lié à C4 pour og:image |
| X4 | `images/` embarque une copie figée de `public/` (~370 fichiers jamais servis : lang, logo, song, robots.txt/sitemap concurrents…) resynchronisée par `rsync --delete` à chaque push *(INF-11)* | `images/{lang,logo,song,loading,opening,robots.txt,sitemap.xml,…}`, `ci-cd-test.yml:125-146` | Ne garder que `project/`, `icon/`, `photos/` (les seuls référencés par `imageServerUrl()`) ; `images/README.md` = contrat ; robots.txt dédié `Disallow: /` si voulu |
| X5 | `/works` : `noindex, nofollow` + descriptions « en préparation » **obsolètes** (timeline remplie, 19 entrées) et **contradictoires** avec le sitemap qui liste la page *(K9)* | `app.routes.ts:154-162`, `sitemap.xml:19`, `README.md:97` | Repasser en `index, follow` + descriptions alignées sur `works.fr.json` — **changement SEO volontaire à valider** |
| X6 | `README.md` racine périmé sur ~10 points (chemins `imgSources`, 6 routes/10, source de vérité, scripts, i18n/images/CI absents) — seule doc versionnée, et fausse *(K10)* | `README.md:20-204` | Réécrire en doc de monorepo courte et exacte ; liens relatifs (pas `F:/Git/...`) |

### 3.5 INFRA / TOOLING — déploiement, serveur, outillage

| # | Violation | Fichiers:lignes | Correctif retenu |
|---|---|---|---|
| I1 | **Déploiement non atomique** : `rm -rf` → scp → restart en 3 sessions SSH, annulable en plein milieu (`cancel-in-progress: true` au niveau workflow), sans health-check HTTP ni rollback ; unit systemd hors repo *(INF-06)* | `ci-cd-prod.yml:17-19,115-144`, `ci-cd-test.yml:19-21,168-197` | Releases + symlink `current` (swap `mv -Tf` atomique), `shared/{.env,uploads,logs-app}`, health-check `curl -H Host` + marqueur SSR, rollback auto, purge à 3 releases ; `config/systemd/*.service.template` versionné ; `cancel-in-progress` limité au job `ci` |
| I2 | `server.ts` : pas de `/health`, pas de SIGTERM gracieux, pas de gestionnaire d'erreur (stack Express exposée si `NODE_ENV` ≠ production — jamais défini) ; cache `maxAge: '1y'` sur **tout** `public/` y compris les JSON i18n non hashés (traductions périmées 1 an hors FR) ; handlers robots/sitemap redondants avec `express.static` ; condition PM2 `pm_id` inutile sous systemd *(INF-07, INF-08, K12)* | `src/server.ts:13-77` | `/health`, error middleware, `server.close()` sur SIGTERM/SIGINT ; politique de cache extraite dans `static-cache.ts` pur testable (immutable si hashé, 300 s + SWR pour `/lang/`) ; supprimer handlers + bloc scaffold + `pm_id` |
| I3 | **`front-portfolio/scripts/` gitignoré** alors que `package.json` et `fonts.css` en dépendent (`optimize:photos` cassé, `audit:i18n` et `fonts.css` non reproductibles sur clone/Docker/CI) ; `.gitignore` racine = template .NET (`[Ll]og/`, `[Rr]elease/` piégeraient le déploiement atomique) ; doc de config (`config/README.md`, `CLAUDE.md`, `FUNCTIONAL_SPEC.md`) hors git *(K5, T4, INF-13)* | `front-portfolio/.gitignore:48`, `.gitignore:1-67`, `package.json:13-14`, `scripts/*.mjs` | Versionner les scripts vivants (`audit-i18n`, `self-host-fonts`, `debug-lcp`) ; supprimer `fill-*.mjs` (one-shot appliqués) et `find-unused-images.mjs` (périmé, 55 faux positifs) ou le réécrire ; réécrire les 2 `.gitignore` ; trancher ce qui est réellement secret (chemins VPS/ports → `.env`) et versionner le reste |
| I4 | Config non secrète en Secrets GH (masquage des logs, debug impossible), pas d'Environments test/prod (pas de protection sur prod) ; **Node non pinné** : local 22, CI 24, `@types/node` 20 — à fixer avant Angular 22 *(INF-14, T10)* | `deploy-apache.yml:49-55`, workflows `env:`, `package.json:59` | GitHub Environments `test`/`prod` + `vars.*` aux noms du `.env.example` ; seuls `VPS_IP`/`VPS_USER`/`SSH_PRIVATE_KEY` restent secrets ; `.nvmrc` = 24, `engines`, `@types/node ^24`, `node-version-file`, `engine-strict=true` |
| T1 | **Lint CI no-op** : `npm run lint --if-present` sans script `lint`, aucun ESLint installé, `lint:css` jamais lancé en CI — faux vert permanent *(T1, K8 partiel)* | `ci-cd-*.yml:43-49`, `package.json:4-17` | `ng add angular-eslint` + `max-lines: 300` (warn, overrides data/sources/specs) + `lint = ng lint && lint:css` → le step existant devient réel |
| T2 | Clé `prettier` dans package.json mais **prettier non installé**, aucun check — la migration v22 (schematics) produira du diff de formatage indiscernable du diff sémantique *(T2)* | `package.json:18-29` | `npm i -D prettier` + `format`/`format:check`, commit `style:` isolé, `eslint-config-prettier`, step CI |
| T3 | Aucun `npm audit` ni Dependabot : **11 vulnérabilités prod (9 high)** corrigeables dans la plage semver actuelle (`@angular/* 20.3.18 → ≥20.3.26`) ; actions GH non surveillées *(T3)* | `package.json:31-48`, `.github/` | `npm update` immédiat + `dependabot.yml` (npm groupé angular/dev + github-actions) + step `npm audit --omit=dev --audit-level=high` |
| T4 | Les e2e **ne prouvent pas le SSR** (l'hydratation masque un fallback CSR — exactement l'incident en mémoire) ; `/` et `/linktree` exclus en CI (dépendance au serveur d'images distant) ; `server.ts` totalement non testé *(T5)* | `e2e/smoke.spec.ts:6-18`, `ci-cd-test.yml:78-85`, `playwright.config.ts:11` | Tests `request` sans JS : `ng-server-context="(ssr\|ssg)"` par route ; stub réseau du serveur d'images (webp 1px) → réintégrer `/` et `/linktree`, supprimer `E2E_EXCLUDE_ROUTES` ; `e2e/server.spec.ts` (robots, sitemap, gzip, cache, 404) |
| T5 | La surface exacte de la migration « serveur d'images → .env » n'a **aucun test** : `image-server.ts`, `project-image.builder.ts` (contrat `<w>x<h>_<name>.webp`, erreur = 404 silencieux), `ResponsivePicture` réduit à `should create` *(T7 — refacto de masse des specs toujours rejeté, version ciblée uniquement)* | `image-server.ts`, `project-image.builder.ts`, `responsive-picture.spec.ts:22-24` | 3 specs ciblées (tri/srcset/media ; préfixe origine ; chemins générés) = contrat de non-régression des URLs avant injection ENV |

---

## 4. Findings signalés mais NON retenus

| Finding | Raison du rejet |
|---|---|
| Fusion `home-work`/`home-projects` en `HomeCtaSection` paramétré (obs. dry) | **Déjà rejeté** en juin pour le cas identique projects-header/works-header (« un composant à config grossit plus vite que 2 composants simples ») ; aucun argument nouveau. L'option CSS partagé (~80 l.) reste disponible mais non prioritaire. |
| `ModalOverlayDirective` + `ScrollLockService` avec pile d'overlays (variante lourde de DRY-04) | **Sur-ingénierie** tant que l'imbrication reste strictement LIFO (lightbox dans modal). La variante KISS retenue (D6 : util `lockBodyScroll` + suppression du handler parent) corrige le bug de cascade Escape pour 1/5 du coût. Le point d'entrée unique devient le lieu naturel du refcount si un jour deux overlays indépendants coexistent. |
| Split `AudioService`, split `OpeningAnimationService`, `SeoRouterService` | **Déjà rejetés/reportés** en juin, aucun argument nouveau. D2 et D3 restent volontairement dans les périmètres actuels (contrat de données, catalogue). |
| Extraction de la gestuelle pointer de `constellation.ts` | Exigerait des callbacks vers 5 signaux du composant : **couplage déplacé, pas réduit** (KISS). |
| Token/helper `injectIsBrowser()` pour les 32 `isPlatformBrowser` (16 fichiers) | Boilerplate **idiomatique Angular SSR** ; gain cosmétique. À revoir opportunément lors de la migration v22, pas avant. |
| `providers: [OpeningAnimationService]` sur `Opening` (état d'instance dans un service root) | Cosmétique — `stopAllTweens` nettoie, aucun bug aujourd'hui. |
| Suppression/archivage de `design/` (7 606 l., 0 référence) | **Décision produit déjà actée** le 2026-06-11 (§5.1) ; non rouverte. Si archivage un jour : tag `design-2026-05` + `git rm`. |
| Refacto de masse des specs (16 `should create`) | **Rejeté** en juin ; 10 des 16 sont de purs conteneurs de composition. Remplacé par T5 (3 specs ciblées sur la surface de migration). |
| Sortie des textes FR en dur restants (`works.data.ts`, `linktree.state.ts`, `PROJECTS_DATA`) | Dette déjà notée en juin (§5.3), **chantier i18n dédié** — hors périmètre de ce passage (X2 traite uniquement les textes *morts*). |
| Génération automatique de `NAMESPACES` depuis les dossiers `public/lang` (option DRY-09) | Le `satisfies Record<Namespace, …>` suffit comme garde-fou ; un générateur ajoute une étape de build pour 14 lignes. |
| Correction des `setTimeout` réels dans 2 specs (obs. tests) | Aucun flaky observé ; `scroll-lanterns.spec.ts` disparaît avec X1. Non prioritaire. |
| ~100 lignes de primitives inlinées dans `constellation.css` | **Autonomie voulue** du composant (README constellation, arbitrage juin). |

---

## 5. Plan d'exécution priorisé

Ordre global (chaque lot = fichiers disjoints des autres ; les rares chevauchements sont notés et séquencés) :

```
Lot 0 HYGIÈNE ──► Lot OUTILLAGE ──► Lot CONFIG ──► Lot INFRA/CI ──► Lot DOCKER DEV
                                        │
                                        └─────────► Lot FRONT (parallélisable avec INFRA/CI)
                                                          │
                                              (ensuite) Migration Angular 22
```

Rationale : l'hygiène débloque la visibilité (scripts, gitignore) ; l'outillage (lint réel, prettier, Node pinné) **avant** les refactos pour que chaque diff soit propre et gardé ; CONFIG avant INFRA (les workflows consomment les mêmes noms de variables) ; Docker après CONFIG (dépend d'`IMAGE_SERVER_URL` configurable) ; Angular 22 en dernier, sur base saine (S3 + I4 sont ses prérequis).

---

### Lot 0 — HYGIÈNE (I3, partie X6) — impact haut / effort S / risque bas

**Fichiers** : `.gitignore` (racine), `front-portfolio/.gitignore`, `front-portfolio/scripts/*.mjs`, `front-portfolio/package.json` (section scripts), `README.md`, `docs/`.

1. Réécrire `.gitignore` racine (Node/Angular : `node_modules/`, `dist/`, `.angular/`, `coverage/`, `.env`, `config/*.conf`, `config/staging/`, `graphify-out/`) — attention à `[Ll]og/`/`[Rr]elease/` qui piégeraient le déploiement atomique.
2. Retirer `scripts` de `front-portfolio/.gitignore` ; relire chaque script (ni secret ni chemin absolu) ; versionner `audit-i18n.mjs`, `self-host-fonts.mjs`, `debug-lcp.mjs` ; supprimer `fill-works-common.mjs`, `fill-projects-cta.mjs`, `find-unused-images.mjs` ; corriger package.json (`optimize:photos` supprimé, `fonts:self-host` ajouté).
3. Versionner la doc de config non secrète (mapping templates→vhosts) dans `docs/deploiement.md` ; réécrire `README.md` (X6).

**Vérification** : `git ls-files front-portfolio/scripts` non vide ; `git ls-files -i -c --exclude-standard` vide ; `npm run audit:i18n` passe sur clone simulé.

---

### Lot OUTILLAGE (T1, T2, T3, D10, partie I4) — impact haut / effort S / risque bas

**Fichiers** : `eslint.config.js` (nouveau), `package.json` + `package-lock.json`, `.nvmrc`, `.npmrc`, `karma.conf.js`, `.github/scripts/test-summary.mjs`, `test.ps1`/`test.cmd`, `.github/dependabot.yml` (nouveau).

1. `npm update` (plages `^` actuelles) → `npm audit --omit=dev` = 0 high ; commit `build:` isolé.
2. `ng add angular-eslint` + `max-lines: 300` warn (overrides `*.data.ts`, `*.source(s).ts`, `*.spec.ts`) ; script `lint = ng lint && npm run lint:css` → le step CI existant devient réel sans toucher aux workflows.
3. Prettier : install + commit `style:` de normalisation **isolé** (whitespace/quotes uniquement, vérifié par `git diff --stat` + `npm test`), puis `format:check` en CI ; `eslint-config-prettier`.
4. `coverageReporter.check` (95/85/95/95) dans karma.conf ; `test:ci` unique ; `test.ps1` délègue à `test-summary.mjs`.
5. Node : `.nvmrc` = 24, `engines >=24 <25`, `@types/node ^24`, `engine-strict=true` ; workflows passeront à `node-version-file` dans le Lot INFRA/CI.
6. `dependabot.yml` (npm groupé + github-actions) ; `angular.json` : `cli.analytics: false`.

**Vérification** : `npx ng lint` local (mesurer le bruit avant push) ; `npm ci && npm test && npm run build` sous Node 24 ; premier run Dependabot.

---

### Lot CONFIG (C1–C6, D1, X5) — impact haut / effort L / risque moyen

**Le cœur du chantier migration. Architecture cible :**

**Contrat** — `.env.example` versionné (toutes les clés, commentées build/runtime/CI) + `.env` racine gitignoré (dev local) :

| Variable | Valeur actuelle | Moment | Consommateurs |
|---|---|---|---|
| `SITE_URL` | `https://charles-lindecker.com` | **build** | canonical/og/JSON-LD (via `route-meta.ts`), robots.txt, sitemap.xml |
| `IMAGE_SERVER_URL` | `https://images.charles-lindecker.com` | **build + envsubst** | `image-server.ts`, preconnect index.html, CSP Apache |
| `PORT` (SSR) | 4000 (defaut) / 4406-4407 (VPS) | **runtime** | `server.ts`, ProxyPass, systemd, lighthouse/playwright (`E2E_PORT`) |
| `NG_ALLOWED_HOSTS` | domaines prod/test | **runtime** | natif `@angular/ssr` (lu à l'exécution) |
| `NODE_ENV` | `production` | **runtime** | error handler Express |
| `GOOGLE_SITE_VERIFICATION` | (index.html:34) | **build** | template index.html |
| `APACHE_*_DOMAIN`, `IMAGES_DOCROOT`, `VPS_DIR`, `SERVICE_NAME`, `SITE_HOST` | secrets GH actuels | **CI (vars)** | deploy workflows + envsubst |
| `DEV_PORT`, `IMAGE_SERVER_PORT` | — | **docker dev** | compose.yml |

**Mécanisme** (arbitrage : script `gen-env.mjs` plutôt que `ng build --define` seul — `define` ne couvre ni index.html ni robots/sitemap ; un seul mécanisme pour tout) :

- **Build-time** : `front-portfolio/scripts/gen-env.mjs` (hook `prebuild`/`prestart`/`pretest`) : `process.loadEnvFile()` du `.env` racine (no-op si absent), priorité à `process.env` (CI), validation fail-fast des clés obligatoires, puis écrit :
  - `src/environments/env.generated.ts` (gitignoré) — façade typée `src/environments/env.ts` avec **fallback = valeurs actuelles** → `ng test`/`ng serve` sans `.env` inchangés ;
  - `public/robots.txt` et `public/sitemap.xml` **générés** depuis le manifeste de routes (voir D1 ci-dessous) ;
  - `src/index.html` rendu depuis `src/index.template.html` (preconnect images, google verification).
- **`route-meta.ts` et `image-server.ts` ré-exportent depuis ENV** (`export const SITE_URL = ENV.siteUrl`) : API publique inchangée, **aucun des ~25 consommateurs à modifier**, valeurs émises identiques.
- **Runtime SSR** : `server.ts` ne lit que `process.env` ; fourni par `EnvironmentFile=$VPS_DIR/shared/.env` (systemd, Lot INFRA) ou `compose.yml` (Lot DOCKER). `angular.json` `allowedHosts` réduit à `localhost`/`127.0.0.1` (C2).
- **CI** : GitHub Environments `test`/`prod`, `vars.*` aux mêmes noms que `.env.example` ; `gen-env.mjs` = point unique de validation (clé manquante = échec de build, jamais de déploiement avec valeur vide).

**Étapes** (fichiers disjoints des autres lots ; `route-meta.ts` retouché ensuite en Lot FRONT sur une autre zone) :

1. **C-a** : `.env.example`, `gen-env.mjs`, `env.ts`/`env.generated.ts`, ré-exports `route-meta.ts`/`image-server.ts`, `index.template.html` (+ suppression des metas mortes C4, diff du HTML prérendu comme preuve), `angular.json` (C2), `site.config.ts` identité sociale (C5) + les 7 templates consommateurs.
2. **C-b** : manifeste `seo/site-routes.ts` + export JSON (D1) ; dérivés `PRERENDERED_PATHS`, `e2e/routes.ts`, `lighthouserc.cjs`, `EXCLUDED` page-transition ; helper `page()` dans `route-meta.ts` ; générateurs robots/sitemap branchés sur gen-env ; passage `/works` en `index,follow` (X5 — **validation utilisateur**) et inclusion des pages légales au sitemap (**décision produit**).
3. **C-c** : tests (C6) — `app.routes.spec.ts` importe `SITE_URL` ; `lighthouserc.cjs` lit `E2E_PORT` ; nouveau spec d'égalité des ensembles manifeste ↔ routes Angular ↔ serverRoutes ; snapshot du sitemap généré.
4. **Décision produit C4** : créer `/meta/logo1.webp` (404 actuel) ou changer `SOCIAL_IMAGE_URL`.

**Vérification** : `npm run build` (SSG 10 routes) avec et sans `.env` ; diff `dist/**/index.html` prérendus avant/après ; `npm test` ; e2e smoke.

---

### Lot INFRA/CI (I1, I2, partie I4, D11, D12, X4, T4) — impact haut / effort M-L / risque moyen

**Fichiers** : `.github/workflows/*`, `config/*.template`, `config/systemd/` (nouveau), `front-portfolio/src/server.ts`, `front-portfolio/src/server/static-cache.ts` (nouveau), `images/`, `e2e/`.

1. **Workflows réutilisables** (D11) : `ci.yml` + `deploy-ssr.yml` (`workflow_call`) ; wrappers ~35 l. ; `node-version-file: .nvmrc` ; step `actionlint` ; GitHub Environments + migration secrets → vars (I4) ; supprimer ou câbler le job `merge-test` (branche miroir inutilisée).
2. **Déploiement atomique** (I1) : releases + symlink + shared + health-check Host/marqueur SSR + rollback + purge ; unit systemd versionnée en template envsubst ; **première bascule sur test (`dev`)**, validation manuelle `curl -I`, puis promotion prod.
3. **server.ts** (I2) : `/health`, error middleware, SIGTERM gracieux, `static-cache.ts` pur (JSON i18n 300 s + SWR, hashés immutable), suppression handlers robots/sitemap + scaffold + `pm_id`.
4. **Apache** (D12) : template SSL unique + table de préfixes, vhost :80 minimal, logs par site, `X-Robots-Tag` sur test, CSP images variabilisée ; diff des `.conf` rendus avant/après dans le job.
5. **images/** (X4) : purge de la copie de `public/`, `images/README.md` contrat.
6. **e2e** (T4) : preuve SSR par `request`, stub du serveur d'images (webp 1 px) → suppression `E2E_EXCLUDE_ROUTES`, `retries: 1`, `e2e/server.spec.ts` (+ `/health`).

**Vérification** : pipeline test complet sur `dev` comparé step par step au run précédent ; `apache2ctl configtest` + rollback existants ; `curl -sI` post-déploiement (X-Robots-Tag test, CSP, Cache-Control `/lang/`, `/health` 200) ; `static-cache.spec.ts`.

---

### Lot FRONT (D2–D9, S1–S3, X1–X3, T5) — impact moyen / effort M / risque bas

Sous-lots **à fichiers disjoints**, exécutables dans cet ordre (du plus mécanique au plus comportemental) :

| Ordre | Contenu | Fichiers touchés | Vérification |
|---|---|---|---|
| F1 | Code mort : X1 (4 composants + pipe + clés i18n), X2 (home-resume state), X3 (logos orphelins), D4 (namespaces + `construction`) | dossiers supprimés, `home-resume*`, `public/logo/`, `translation.service.ts`, `translation.server.ts`, `public/lang/construction/`, `CLAUDE.md` front | build AOT + 71 specs ; `satisfies` = garde-fou compil ; assertion e2e « aucune clé brute dans main » |
| F2 | S3 : cycle d'import (`import type` ×14, suppression du shim `projects.state.ts`) — prérequis v22 | 14 `*.source(s).ts`, 7 consommateurs | `npm run build` (TS) ; `projects.spec.ts` échouerait bruyamment si cycle actif |
| F3 | D3 : catalogue audio typé `SoundKey` + InjectionToken | `audio/sound-catalog.ts` (nouveau), `app.ts`, `app.config.ts`, `audio-service.ts`, directive | audio-service.spec, directive.spec, app.spec adapté ; strictTemplates ; check node existence des mp3 |
| F4 | D2 : contrat `RouteMeta` + `applyRouteMeta` + flux unique dans App | `route-meta.ts`, `meta-service.ts`, `app.ts` | meta-service.spec + nouveau spec table complète ; app.spec ; e2e canonical |
| F5 | D6 : `lockBodyScroll` + suppression handler Escape parent (correction cascade — **changement voulu à valider**) ; S2 : modal langue hors TranslationService | `utils/scroll-lock.ts` (nouveau), `image-lightbox.ts`, `lang-modal.ts`, `projects.ts`, `translation.service.ts`, `app.html`/`app.ts`, `nav-barre` | specs existants + nouveau spec d'intégration keydown Escape réel (seule la lightbox se ferme) |
| F6 | D7 : `LabeledImageSet` (18 remappages) ; D8 : purge des triplets CSS + object-fit morts | `shared.sources.ts`, 7 composants + templates, 22 fichiers CSS | strictTemplates ; captures avant/après (`wmux browser screenshot`) sur /, /projects, /works, /resume, /linktree aux breakpoints |
| F7 | D5 : factory animations resum + `resum-row.css` partagé | `resum/*` | 5 specs animations (exports conservés) ; contrôle visuel /resume 768/480/360/320 |
| F8 | S1 : Projects en signals + `applyFilters` pure | `projects.ts`, `projects.html`, `projects.utils.ts`, `projects.data.ts` | projects.spec + projects.utils.spec étendus ; e2e /projects |
| F9 | D9 : `shouldSkipEntrance` + `provideEnvironmentInitializer` | `utils/motion.ts`, `reveal-on-scroll.ts`, `linktree.ts`, `opening.ts`, `page-transition.ts`, `app.config.ts`, `app.ts` | specs existants + test unitaire 3 cas ; test intégration hasNavigated |
| F10 | T5 : 3 specs ciblées pipeline images (contrat pré-migration ENV) | `responsive-picture.spec.ts`, `image-server.spec.ts` (nouveau), `project-image.builder.spec.ts` (nouveau) | additif pur |
| F11 | Opportuniste (robustesse) : helper `utils/storage.ts` safeGet/safeSet — `translation.service`/`audio-service` lèveraient une SecurityError bloquant l'init si stockage refusé | `utils/storage.ts` (nouveau), `audio-service.ts`, `translation.service.ts`, `opening.ts` | specs services ; test navigateur mode privé |

---

### Lot DOCKER DEV — impact moyen / effort S / risque bas — après Lot CONFIG

**Fichiers** : `compose.yml` (racine, nouveau), `front-portfolio/Dockerfile.dev` (nouveau), `.env.example` (clés `DEV_PORT`, `IMAGE_SERVER_PORT`).

1. Service `front` : image `node:24-alpine` (alignée `.nvmrc`), `ng serve --host 0.0.0.0 --port ${DEV_PORT}`, volume source, `env_file: .env`.
2. Service `images` : `nginx:alpine`, `./images:/usr/share/nginx/html:ro`, port `${IMAGE_SERVER_PORT}` → `IMAGE_SERVER_URL=http://localhost:8081` en dev. C'est **l'argument nouveau** qui justifie l'origine images configurable (le commentaire « domaine unique » d'`image-server.ts` ne tient plus) — et ce qui permettra à terme de réintégrer `/` et `/linktree` dans les e2e CI contre un serveur d'images local.
3. Documentation : `docs/dev-docker.md` (2 commandes).

**Vérification** : `docker compose up` sur clone frais → app sur `localhost:${DEV_PORT}` avec images servies localement, hot-reload fonctionnel, `npm run audit:i18n` exécutable dans le conteneur.

---

### Après ces lots : migration Angular 20 → 22

Prérequis couverts par le plan : Node pinné (I4), cycle d'import cassé (F2/S3), lint réel avec `ng update` intégré (T1), Prettier (diff schematics propre), audit à zéro high (T3), e2e prouvant le SSR (T4), specs contrat images (F10). Option à activer pendant la migration : `verbatimModuleSyntax`.
