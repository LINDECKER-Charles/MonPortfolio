# MonPortfolio Front

Frontend du portfolio personnel de Charles Lindecker, construit avec Angular 20, SSR et une direction visuelle fortement orientee experience. Le projet combine pages editoriales, sequences d'ouverture, animations GSAP, audio d'interface et rendu serveur avec prerender.

## Apercu

Le site expose plusieurs parcours distincts :

- une home immersive avec sections hero, resume, projets et parcours
- une page `resume` mise en scene comme une fiche de personnage interactive
- une page `projects` avec filtres, timeline, modal de detail et lightbox d'images
- des routes d'ouverture dediees qui rejouent les sequences d'introduction

Le projet est pense comme une vitrine technique autant qu'un portfolio :

- architecture Angular moderne basee sur des composants standalone
- metadata SEO route par route
- SSR + prerender pour la livraison
- gestion audio centralisee
- medias responsives centralises dans `src/app/imgSources`
- animations GSAP pour les introductions, hovers et reveals

## Stack

- Angular 20
- TypeScript 5
- Angular SSR
- Express
- GSAP
- PostCSS
- Tailwind CSS 4 dans la toolchain
- Karma + Jasmine pour les tests unitaires

## Prerequis

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Scripts

```bash
npm start
npm run build
npm run watch
npm run test
npm run serve:ssr:front-portfolio
```

Details :

- `npm start` lance le serveur de dev Angular sur `http://localhost:4200`
- `npm run build` genere le build applicatif SSR dans `dist/front-portfolio`
- `npm run watch` rebuild en continu en configuration development
- `npm run test` lance la suite Karma/Jasmine
- `npm run serve:ssr:front-portfolio` sert le build SSR genere localement

## Architecture

```text
src/
  app/
    components/
      assets/        composants UI reutilisables
      misc/          navigation, footer, openings, resume
      page/          pages routees
    directives/      comportements UI transverses
    imgSources/      catalogues de medias responsives
    services/        audio, meta, logique transversale
  main.ts
  main.server.ts
  server.ts
public/              assets servis tels quels
```

Organisation fonctionnelle principale :

- `src/app/components/page/home` porte la page d'accueil
- `src/app/components/page/projects` porte le listing complet des projets, le filtrage et la modal
- `src/app/components/misc/opening-resume` contient l'intro du resume et l'ecran `resume`
- `src/app/services/meta-service.ts` pilote les balises SEO, Open Graph, Twitter et JSON-LD
- `src/app/services/audio-service.ts` centralise l'enregistrement, la lecture, le mute et le volume des sons
- `src/app/directives/reveal-on-scroll.ts` fournit les reveals au scroll bases sur `IntersectionObserver` + GSAP

## Routage

Les routes principales definies dans [src/app/app.routes.ts](/F:/Git/MonPortfolio/front-portfolio/src/app/app.routes.ts:1) sont :

- `/` : accueil principal du portfolio
- `/resume` : CV interactif / fiche resume
- `/projects` : liste complete des projets avec filtres et details
- `/works` : page parcours, actuellement en construction
- `/opening-home` : sequence d'ouverture avant redirection vers l'accueil
- `/opening-resume` : sequence d'ouverture dediee a l'univers du resume

Chaque route configure ses propres metadonnees :

- `title`
- `description`
- `canonical`
- `robots`
- Open Graph
- Twitter cards
- donnees structurees Schema.org

## Rendu et SEO

Le projet utilise le builder `@angular/build:application` avec :

- `outputMode: "server"`
- `server: "src/main.server.ts"`
- `ssr.entry: "src/server.ts"`

En production, Angular prerender les routes statiques. Le build genere :

- les bundles browser
- les bundles server
- les routes statiques prerenderes

Le service de metadata met a jour dynamiquement :

- la meta description
- la balise canonical
- les balises robots
- les balises Open Graph
- les balises Twitter
- un script `application/ld+json` unique pour le schema courant

## Medias et images

Les composants n'embarquent pas directement leurs chemins d'assets. Les sources sont centralisees dans `src/app/imgSources`, notamment :

- `shared.sources.ts`
- `opening.sources.ts`
- `resum.sources.ts`
- `projects/*.source.ts`

Ce choix permet de :

- mutualiser les variantes responsive
- garder les composants declaratifs
- changer un asset sans recabler plusieurs templates
- conserver une convention unique pour `app-responsive-picture`

## Audio

L'audio est enregistre dans le composant racine via [src/app/app.ts](/F:/Git/MonPortfolio/front-portfolio/src/app/app.ts:1), puis pilote par [src/app/services/audio-service.ts](/F:/Git/MonPortfolio/front-portfolio/src/app/services/audio-service.ts:1).

Le service gere :

- les sons persistants et one-shot
- le volume maitre
- le mute global
- la persistence des preferences dans `localStorage`
- le comptage des sons actifs

Les interactions UI declenchent ensuite les effets via composants ou directives, par exemple `PlaySoundOnClickDirective`.

## Animations

Le projet repose sur deux mecanismes principaux :

- GSAP pour les introductions, transitions d'etat et micro-interactions
- `RevealOnScrollDirective` pour les apparitions au scroll

Points notables :

- les composants du `resume` heritent d'une base commune pour leurs animations d'entree
- les openings sont orchestres via services et etats dedies
- les hovers et press effects sont separes dans des fichiers `*.animations.ts`

Si tu modifies une animation interactive, verifie bien les collisions entre tween d'entree et tween de hover sur les memes proprietes (`opacity`, `x`, `y`, `scale`, `rotate`).

## Page projets

La page `projects` s'appuie sur [src/app/components/page/projects/projects.state.ts](/F:/Git/MonPortfolio/front-portfolio/src/app/components/page/projects/projects.state.ts:1) comme source de verite.

Elle fournit :

- les projets affiches
- les filtres par categorie
- les tags
- la stack
- les contenus detailles de la modal
- les images du carousel/lightbox

Le composant [src/app/components/page/projects/projects.ts](/F:/Git/MonPortfolio/front-portfolio/src/app/components/page/projects/projects.ts:1) gere ensuite :

- le filtrage derive
- l'ouverture/fermeture de la modal
- la navigation dans les images
- le lock du scroll du `body` pendant l'ouverture d'une modal

## Conventions de travail

Quelques conventions implicites du projet :

- privilegier les composants standalone
- centraliser les medias dans `imgSources` avant de les brancher aux composants
- isoler les animations complexes dans des fichiers `*.animations.ts`
- conserver la logique SEO au niveau des routes
- faire attention aux budgets Angular definis dans `angular.json`

Les budgets de build en production sont actuellement :

- `initial` warning a `500kB`
- `anyComponentStyle` warning a `4kB`

## Tests

Les tests unitaires existent au format `*.spec.ts` sur les composants, directives et services principaux.

Execution :

```bash
npm run test
```

## Points d'attention

- Le projet est visuel et anime : une optimisation ne doit pas casser l'intention UI.
- Certaines interactions combinent audio, animation et SSR ; il faut donc garder les gardes `isPlatformBrowser` en place.
- Toute nouvelle route devrait definir ses metadonnees completement pour rester coherente avec le reste du site.
- Les assets du dossier `public/` sont publies tels quels ; garde une nomenclature propre et des tailles adaptees.

## Build local SSR

Workflow standard :

```bash
npm run build
npm run serve:ssr:front-portfolio
```

Le serveur Node sert alors la sortie construite depuis :

- `dist/front-portfolio/browser`
- `dist/front-portfolio/server`

## Resume technique

Ce projet est un frontend Angular SSR de portfolio, structure autour d'une home editoriale, d'un ecran resume gamifie, d'une page projets riche et d'un socle transverse pour le SEO, l'audio, les animations et les medias responsives.
