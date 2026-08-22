# MonPortfolio

Portfolio personnel de Charles Lindecker — application Angular 20 SSR/SSG à thème Bloodborne, en ligne sur [charles-lindecker.com](https://charles-lindecker.com).

## Structure du monorepo

| Dossier | Rôle |
|---|---|
| [`front-portfolio/`](front-portfolio/) | Application Angular (SSR + prerender, serveur Express) |
| [`images/`](images/) | Source de vérité du serveur d'images statique (`images.charles-lindecker.com`), rsync vers le VPS par la CI |
| [`config/`](config/) | Templates de vhosts Apache (`*.conf.template`), rendus par `envsubst` au déploiement |
| [`.github/workflows/`](.github/workflows/) | Pipelines CI/CD : test (push `dev`) et prod (push `main`) |
| [`docs/`](docs/) | Documentation technique (architecture, investigations, refactos, légal) |
| [`design/`](design/) | Maquettes HTML et wireframes archivés |

## Front — `front-portfolio/`

### Stack

- **Angular 20** — composants standalone exclusivement, change detection zoneless (signals)
- **SSR** — `@angular/ssr` + Express (`src/server.ts`), compression activée
- **Tailwind CSS 4** + design tokens Bloodborne (`src/styles/tokens.css`)
- **GSAP** — séquences d'ouverture, reveals, micro-interactions
- **i18n maison** — `TranslationService`, namespaces JSON chargés à la demande depuis `public/lang/<namespace>/`, baseline FR avec fallback automatique

### Routes publiques

Définies dans [`app.routes.ts`](front-portfolio/src/app/app.routes.ts), métadonnées SEO (title, OG, JSON-LD) portées par chaque route :

| Route | Contenu |
|---|---|
| `/` | Accueil (hero, resume, projets, parcours) |
| `/projects` | Projets avec filtres, modal de détail, lightbox |
| `/works` | Parcours — en construction (`noindex`) |
| `/resume` | CV interactif, fiche de personnage |
| `/linktree` | Liens (LinkedIn, GitHub, contact…) |
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |
| `/politique-cookies` | Politique de cookies |
| `/opening-home`, `/opening-resume` | Séquences d'ouverture (`noindex`) |
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

- CI GitHub Actions : lint + tests + build sur le runner, artefact `dist/` déployé sur le VPS via SSH, service SSR Node redémarré.
- Push sur `dev` → environnement de test (+ e2e Playwright, + rsync de `images/` vers le serveur d'images) ; push sur `main` → production.
- Apache fait reverse-proxy vers le serveur SSR Node ; le vhost images sert `images/` en statique.
- Les vhosts sont rendus depuis [`config/*.conf.template`](config/) par le workflow réutilisable [`deploy-apache.yml`](.github/workflows/deploy-apache.yml) — détail dans [`config/README.md`](config/README.md).

## Documentation

- [Rapport d'architecture](docs/architecture-report.md)
- [Investigations](docs/investigations/) — post-mortems et analyses d'incidents
- [Refactos](docs/refacto/) — chantiers de maintenabilité
- [Audit UI/UX](docs/audit-ui-ux.md)
- [Légal](docs/legal/) — sources des pages mentions légales / confidentialité / cookies
- Conventions et direction artistique : [`front-portfolio/CLAUDE.md`](front-portfolio/CLAUDE.md)
