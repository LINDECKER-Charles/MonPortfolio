# MonPortfolio

Portfolio personnel de Charles Lindecker — application Angular 22 SSR/SSG à thème Bloodborne, en ligne sur [charles-lindecker.com](https://charles-lindecker.com).

## Structure du monorepo

| Dossier | Rôle |
|---|---|
| [`front-portfolio/`](front-portfolio/) | Application Angular (SSR + prerender, serveur Express) |
| [`images/`](images/) | Images statiques servies sous `/img`, embarquées dans l'image Docker du front |
| [`docker/`](docker/) | `front/Dockerfile` (image de production, multi-stage) + nginx images de dev |
| [`.github/workflows/`](.github/workflows/) | Pipeline CI/CD *build-once* : tests → image GHCR → staging (push `dev`) → promotion prod (merge `test → main`) |
| [`docs/`](docs/) | Documentation technique (architecture, investigations, refactos, légal) |
| [`design/`](design/) | Maquettes HTML et wireframes archivés |

## Front — `front-portfolio/`

### Stack

- **Angular 22** — composants standalone exclusivement, change detection zoneless (signals)
- **SSR** — `@angular/ssr` + Express (`src/server.ts`), compression activée
- **Tailwind CSS 4** + design tokens Bloodborne (`src/styles/tokens.css`)
- **GSAP** — séquences d'ouverture, reveals, micro-interactions
- **i18n maison** — `TranslationService`, namespaces JSON chargés à la demande depuis `public/lang/<namespace>/`, baseline FR avec fallback automatique

### Routes publiques

Définies dans [`app.routes.ts`](front-portfolio/src/app/app.routes.ts), métadonnées SEO (title, OG, JSON-LD) portées par chaque route :

| Route | Contenu |
|---|---|
| `/` | Accueil (hero + autel de la cinématique, resume, projets + reliquaire, parcours + chronique) |
| `/projects` | Projets avec filtres, modal de détail, lightbox |
| `/works` | Parcours — timeline des expériences, formations et certifications |
| `/resume` | CV interactif, fiche de personnage |
| `/linktree` | Liens (LinkedIn, GitHub, contact…) |
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |
| `/politique-cookies` | Politique de cookies |
| `/opening-home`, `/opening-resume` | Séquences d'ouverture (`noindex`) — `?replay` force le rejeu, `?skip-opening` la passe |
| `**` | 404 thémée |

Toutes les routes connues sont **prérendues au build** (SSG, cf. [`app.routes.server.ts`](front-portfolio/src/app/app.routes.server.ts)) ; seul le wildcard `**` reste en SSR à la volée pour servir la 404 thémée.

### Commandes

Depuis `front-portfolio/` :

```bash
npm start                              # Dev server (localhost:4200)
npm run build                          # Build production SSR + prerender → dist/
npm test                               # Tests unitaires Karma + Jasmine
npm run e2e                            # Playwright : smoke + a11y (exige un build préalable)
npm run e2e:a11y                       # Scan axe-core seul (WCAG 2.1 AA)
npm run lighthouse                     # Lighthouse CI en local (exige un build préalable)
npm run serve:ssr:front-portfolio      # Sert le build SSR généré
npm run audit:i18n                     # Audit de couverture des locales
npm run fonts:self-host                # Régénère les polices auto-hébergées + fonts.css
npm run lint:css                       # Stylelint sur src/**/*.css
```

## Déploiement

- Application **dockerisée** : une image `front` (Node 24, bundle SSR autonome + `images/` sous `/img`),
  construite une seule fois par la CI et publiée sur GHCR (`ghcr.io/lindecker-charles/monportfolio/front`).
- Push sur `dev` → tests (lint, unitaires, e2e) → merge `dev → test` → build `:staging` → déploiement **staging**
  (`test.charles-lindecker.com`) ; merge manuel `test → main` → retag `:prod` (sans rebuild) → déploiement **prod**.
- Sur le VPS : `docker compose` par environnement (`monportfolio-staging` / `monportfolio-prod`) derrière un
  edge proxy Caddy partagé qui gère TLS et routage par labels — fourni par le dépôt d'infrastructure
  `infra-vps` (privé), déployé avant tout projet applicatif ; ce repo ne porte que ses labels `caddy`.
- Détails : [`docs/deploiement.md`](docs/deploiement.md) (architecture, migration de serveur, exploitation) et
  [`docs/DEVOPS-SECRETS.md`](docs/DEVOPS-SECRETS.md) (secrets GitHub).

## Documentation

- [Rapport d'architecture](docs/architecture-report.md)
- [Investigations](docs/investigations/) — post-mortems et analyses d'incidents
- [Refactos](docs/refacto/) — chantiers de maintenabilité
- [Audit UI/UX](docs/audit-ui-ux.md)
- [Légal](docs/legal/) — sources des pages mentions légales / confidentialité / cookies
