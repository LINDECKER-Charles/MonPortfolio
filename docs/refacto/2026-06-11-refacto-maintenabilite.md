# Refacto maintenabilité — 2026-06-11

Audit DRY / SOLID / KISS du front Angular (`front-portfolio/src`) + scripts, et plan d'exécution.
Analyse menée par 3 passes indépendantes (DRY, SOLID, KISS/structure), arbitrées ensuite.

---

## 1. Inventaire — fichiers trop longs (> 250 lignes, hors specs et générés)

| Fichier | LOC | Verdict |
|---|---:|---|
| `src/app/components/page/projects/projects.state.ts` | 690 | **À découper** — mélange types + data inline + filtres (SRP) |
| `src/app/app.routes.ts` | 465 | **À factoriser** — ~70 % de métadonnées SEO répétées par route (DRY) |
| `src/app/components/assets/constellation/constellation.ts` | 451 | **À découper** — 4 responsabilités : état UI, pan/zoom, physique ressorts, pointer events (SRP) |
| `src/app/components/misc/opening-resume/opening/opening-animation.service.ts` | 345 | Toléré — orchestration GSAP fortement interconnectée ; découpage = perte de cohésion |
| `src/app/components/page/works/works.state.ts` | 290 | **À découper** — types + data + logique de transformation (SRP) |
| `src/app/components/assets/constellation/constellation.html` | 239 | Toléré — SVG déclaratif, conditions métier-primitives uniquement |
| `src/app/components/assets/constellation/constellation.layout.ts` | 223 | Toléré — fonctions géométriques pures et orthogonales |
| `home-resume-snippets.ts` | 218 | Toléré — state + animation cohésifs ; à surveiller si croissance |
| `src/app/services/audio-service.ts` | 213 | Toléré — voir arbitrage §3 |
| `front-portfolio/scripts/fill-works-common.mjs` | 537 | Toléré — données linguistiques déclaratives, pas de logique |
| `src/app/components/assets/constellation/constellation.css` | 790 | Toléré — composant autonome, tokens `--cst-*` scopés `:host` (pattern imposé par CLAUDE.md) |
| `src/app/components/page/linktree/linktree.css` | 618 | Toléré — layout spécifique au composant |
| `src/styles/fonts.css` | 443 | Généré (`scripts/self-host-fonts.mjs`) — ne pas éditer |
| `design/*.html` (racine) | ~2 900 | Maquettes versionnées volontairement (`docs(design)`) — voir recommandations §5 |

---

## 2. Violations retenues

### DRY

| # | Violation | Fichiers | Correctif |
|---|---|---|---|
| D1 | Bloc `data` SEO répété 10× (description, og\*, twitter\*, breadcrumb, canonical) | `app.routes.ts:81-471` | Builder `seo/route-meta.ts` : `buildRouteMeta(...)` + `breadcrumb(...)` + schémas. Valeurs émises **strictement identiques** |
| D2 | `tocLinks`/`crossLinks` recalculés à la main dans les 3 pages legal (liens croisés vers « les 2 autres pages ») | `legal/mentions-legales.ts`, `politique-confidentialite.ts`, `politique-cookies.ts` | Helper dans le shared legal : `otherLegalLinks(self)` dérive les liens croisés |
| D3 | Animation hero GSAP dupliquée (`fromTo` autoAlpha/y/blur) | `projects-header.ts:38-49`, `works-header.ts:40-51` | Helper partagé `revealHero(el, duration)` |
| D4 | Formatage de dates : 2 implémentations parallèles (`Intl` vs tableaux `MONTHS_FR/EN` limités à 2 langues) | `projects.utils.ts`, `works.utils.ts` | Util partagé `utils/date-format.ts` basé `Intl` (résolution locale unique) ; APIs publiques conservées |

### SOLID (SRP)

| # | Violation | Fichiers | Correctif |
|---|---|---|---|
| S1 | Types + 620 lignes de data + filtres dans un seul fichier | `projects.state.ts` | Split : `projects.types.ts` / `projects.data.ts` ; `projects.state.ts` = ré-export rétrocompatible |
| S2 | Types + data + `buildTimeline`/`computeStats` mélangés | `works.state.ts` | Split : `works.types.ts` / `works.data.ts` ; logique de transformation conservée dans `works.state.ts` |
| S3 | Composant constellation : état de sélection/filtre **+** pan/zoom viewBox **+** simulation masse-ressort **+** pointer events | `constellation.ts` | Extraction de modules purs sans DI (le composant reste autonome) : `constellation.viewport.ts` (math pan/zoom), `constellation.physics.ts` (étape de simulation pure) |

### KISS / code mort

| # | Constat | Correctif |
|---|---|---|
| K1 | `components/assets/construction-state/` : composant jamais référencé (vérifié par grep : seules ses propres sources le mentionnent) | Suppression du dossier (~460 lignes) |

---

## 3. Violations signalées mais **non retenues** (arbitrages)

| Proposition | Décision | Justification |
|---|---|---|
| Split `AudioService` en 3 services (registry / instances / preferences) + orchestrateur | **Rejeté** | 213 lignes cohésives, API stable, consommateurs simples. Le découpage ajoute 3 injections et des effects de synchronisation pour un gain théorique — sur-ingénierie pour ce périmètre (KISS > SRP ici) |
| Génération des tailles d'images par ratio (`buildProjectImageWithRatio`) | **Rejeté** | Les dimensions font partie des **noms de fichiers** sur le serveur d'images (`<w>x<h>_<name>.webp`). Les recalculer par arrondi risque des 404 silencieux. La verbosité actuelle est le contrat avec les assets générés |
| Composant legal générique via factory `createLegalPageComponent()` | **Rejeté** | `@Component` dans une factory casse la compilation AOT. Les 3 templates ont des contenus réellement différents ; seule la dérivation des liens croisés est dupliquée (→ D2) |
| Fusion `projects-header`/`works-header` en un composant paramétré | **Rejeté** | Templates/CSS divergents (stats, drop-cap, CTA différents). Un composant à config grossit plus vite que 2 composants simples ; seule l'animation est commune (→ D3) |
| Refacto de masse des 59 `*.spec.ts` (helper `setupTestBed`) | **Reporté** | Churn massif pour un boilerplate standard Angular. À introduire au fil de l'eau sur les nouveaux specs |
| Split `Opening`/`OpeningAnimationService` en services state/bypass/interactions | **Rejeté** | Orchestration séquentielle volontairement couplée à l'audio et aux refs DOM ; le découpage disperse une séquence linéaire lisible |
| `SeoRouterService` extrait de `app.ts` | **Reporté** | `app.ts` fait 125 lignes, pipeline RxJS standard ; gain marginal tant qu'il ne grossit pas |

---

## 4. Plan d'exécution

Lots à fichiers disjoints, exécutés en parallèle, puis vérification globale.

- **Lot A — SEO routes (D1)** : créer `src/app/seo/route-meta.ts`, réécrire `app.routes.ts` en déclaratif compact. Contrainte : `data` émis identique valeur par valeur (les routes divergent parfois entre `description` et `ogDescription` → overrides explicites).
- **Lot B — Split states (S1, S2)** : `projects.types.ts` + `projects.data.ts` + ré-export ; `works.types.ts` + `works.data.ts` + ré-export. Casser le cycle potentiel `data → sources → project-image.builder → state` en faisant pointer `project-image.builder.ts` sur `projects.types.ts` (import type).
- **Lot C — Constellation (S3)** : extraire `constellation.viewport.ts` et `constellation.physics.ts` (modules purs, testables) ; le composant garde signals et orchestration. Specs existants au vert.
- **Lot D — DRY pack + code mort (D2, D3, D4, K1)** : helper liens legal, helper `revealHero`, `utils/date-format.ts`, suppression `construction-state/`.
- **Vérification** : `npm run build` + `npm test` (front-portfolio), puis `graphify update .`.

---

## 5. Recommandations hors périmètre (non exécutées)

1. **`design/`** (~2 900 lignes de maquettes HTML statiques) : aucune référence depuis le code. À archiver ou supprimer si les maquettes ne servent plus — décision produit, pas technique.
2. **ESLint absent** : ajouter `angular-eslint` avec `max-lines` (warn, ~300, exceptions pour `*.data.ts` et CSS de composants autonomes) pour empêcher la régression de taille.
3. **i18n de `PROJECTS_DATA`** : les textes projets sont en dur en français alors que CLAUDE.md impose `TranslationService` — dette assumée à traiter dans un chantier dédié (volume important).
4. **`works` robots `noindex`** : penser à repasser en `index, follow` quand la timeline sera remplie (commentaire déjà en place dans les routes).
