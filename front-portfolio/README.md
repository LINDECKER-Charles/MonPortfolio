# MonPortfolio Front

Portfolio personnel développé avec Angular 20, SSR et une direction UI très orientée expérience.

Le projet met l'accent sur :

- une home animée avec séquences d'ouverture et transitions GSAP
- une architecture de composants standalone
- des médias responsives centralisés dans `src/app/imgSources`
- un rendu SSR avec prerender
- une page projets filtrable avec modal, carousel et lightbox image

## Stack

- Angular 20
- TypeScript
- Angular SSR
- GSAP
- CSS
- Tailwind/PostCSS dans la toolchain

## Démarrage

Installe les dépendances :

```bash
npm install
```

Lance le serveur de développement :

```bash
npm start
```

Application accessible sur `http://localhost:4200`.

## Scripts utiles

```bash
npm start
npm run build
npm run watch
npm run test
npm run serve:ssr:front-portfolio
```

## Build

Build production SSR :

```bash
npm run build
```

Le résultat est généré dans `dist/front-portfolio/`.

Pour servir le build SSR localement :

```bash
npm run serve:ssr:front-portfolio
```

## Structure

```text
src/
  app/
    components/
      assets/        composants UI réutilisables
      home/          briques métiers des pages home/projets
      misc/          navbar, footer, opening, resume
      page/          pages routées
    directives/      directives UI
    imgSources/      sources d'images responsives centralisées
public/              assets statiques servis tels quels
```

## Médias

Les médias responsives sont décrits dans :

- `src/app/imgSources/shared.sources.ts`
- `src/app/imgSources/resum.sources.ts`
- `src/app/imgSources/projects/*.ts`

Le principe retenu dans le projet :

- privilégier `webp` pour les icônes et captures de projets
- utiliser des tailles réellement exploitées par l'interface
- éviter la duplication de chemins d'assets dans les composants

## Pages principales

- `/` : accueil, résumé, projets mis en avant, parcours
- `/projects` : listing complet des projets avec filtres, tags, stack et modal détail
- `/resume` : version CV / résumé avec animations d'entrée
- `/opening-home` : rejoue l'animation d'ouverture puis renvoie vers l'accueil
- `/opening-resume` : animation d'ouverture dédiée au résumé

## Notes

- Le projet utilise des budgets Angular assez serrés sur le bundle initial et les styles de composants.
- Certaines pages sont volontairement très travaillées visuellement, donc toute optimisation doit préserver l'intention de design.
- Les images utilisées par l'UI doivent être déclarées via `imgSources` avant d'être branchées dans les composants.
