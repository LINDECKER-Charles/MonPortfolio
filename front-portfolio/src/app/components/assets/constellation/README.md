# Constellation

Carte interactive façon « ciel étoilé » : des items placés en clusters par
catégorie, reliés par leurs tags partagés, avec pan/zoom, vue galaxie au
dézoom, recherche, légende filtrante, effet ressort au drag et un panneau de
détail intégré.

**Autonome.** Le dossier ne dépend que d'Angular core (≥ 17.3 pour `input()` /
`output()`). Aucun import hors du dossier, aucun service, aucune classe ou token
CSS global requis. Pour réutiliser ailleurs : **copier le dossier**, déclarer le
composant dans `imports`, lui passer `items` + `categories`.

## Fichiers

| Fichier                  | Rôle                                                        |
| ------------------------ | ----------------------------------------------------------- |
| `constellation.ts`       | Composant (rendu, pan/zoom, ressort, sélection, filtres).   |
| `constellation.html`     | Template SVG + panneau de détail.                           |
| `constellation.css`      | Styles + tokens DA inlinés (surchargeables).                |
| `constellation.layout.ts`| Calculs purs : placement, liens, anneaux, champ d'étoiles.  |
| `constellation.model.ts` | Modèle public (`ConstellationItem`, `…Category`, `…Labels`).|

## Utilisation

```ts
import { Constellation } from './…/constellation/constellation';
import {
  ConstellationCategory,
  ConstellationItem,
} from './…/constellation/constellation.model';

@Component({ imports: [Constellation], /* … */ })
export class Demo {
  categories: ConstellationCategory[] = [
    { id: 'personal', label: 'Perso', color: '#ff934d', glyph: '◆' },
    { id: 'work', label: 'Pro', color: '#8eb8ff', glyph: '✦' },
  ];

  items: ConstellationItem[] = [
    {
      id: 'p1',
      title: 'Mon projet',
      category: 'personal',
      tags: ['Angular', 'SSR'], // tags partagés ⇒ liens entre items
      description: 'Une courte description.',
      period: 'Mars 2026 – aujourd’hui',
      statusLabel: 'En cours',
      statusTone: 'active', // active | done | muted
      chips: ['Angular', 'TypeScript'],
      actions: [{ label: 'GitHub', href: 'https://…', icon: 'github' }],
    },
  ];
}
```

```html
<app-constellation
  [items]="items"
  [categories]="categories"
  (itemOpened)="open($event)" />
```

### Inputs / Outputs

| Nom          | Type                      | Détail                                                      |
| ------------ | ------------------------- | ----------------------------------------------------------- |
| `items`      | `ConstellationItem[]`     | Requis. Référence stable conseillée (sinon re-layout).      |
| `categories` | `ConstellationCategory[]` | Requis. L'ordre fixe l'ordre de la légende.                 |
| `labels`     | `ConstellationLabels`     | Optionnel. Libellés UI (i18n côté hôte) ; défauts anglais.  |
| `itemOpened` | `output<ConstellationItem>` | Émis au clic sur le bouton « Détail » du panneau.         |

## Placement des catégories

Chaque catégorie peut fournir un `seed` (`cx`, `cy`, `spread`, `angle`) dans le
repère viewBox `100×72`. Sans `seed`, les catégories sont **réparties
automatiquement** sur une ellipse autour du centre. Les positions exactes des
items sont dérivées de façon déterministe de leur `id` (stable, SSR-safe).

## Thème (DA)

Le rendu par défaut reprend une DA sombre « parchemin / or / braise ». Tous les
tokens sont déclarés sur `:host` via `var(--token-public, défaut)` :

- si l'hôte définit le **token public** (`--color-blood`, `--font-display`,
  `--radius-card`…), il prime — le composant s'aligne sur le design system hôte ;
- sinon le **défaut inliné** s'applique (rendu autonome) ;
- pour un réglage ponctuel, surcharger directement les variables `--cst-*` ou
  poser un `[style]` sur l'élément `<app-constellation>`.

La couleur d'un cluster vient de `ConstellationCategory.color` (n'importe quelle
couleur CSS), indépendamment des tokens.
