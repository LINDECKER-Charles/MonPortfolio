/**
 * Modèle public du composant « constellation » — entièrement générique et
 * sans dépendance i18n / projet. Un hôte mappe ses propres données vers ces
 * types pour réutiliser le composant tel quel (copier le dossier suffit).
 */

/** Icônes intégrées disponibles pour les liens d'action du panneau. */
export type ConstellationActionIcon = 'github' | 'external' | 'website';

/** Lien d'action affiché dans le panneau de détail (ouvert dans un onglet). */
export interface ConstellationAction {
  label: string;
  href: string;
  /** Icône intégrée ; `external` par défaut. */
  icon?: ConstellationActionIcon;
}

/**
 * Tonalité du point d'état affiché dans le panneau.
 * `active` ajoute en plus le marqueur lumineux sur le nœud (item en cours).
 */
export type ConstellationStatusTone = 'active' | 'done' | 'muted';

/** Un item cartographié dans la constellation (un « projet », « article »…). */
export interface ConstellationItem {
  id: string;
  title: string;
  /** Identifiant de catégorie ; doit correspondre à une {@link ConstellationCategory}. */
  category: string;
  /**
   * Termes de rapprochement : deux items partageant des termes (insensible à
   * la casse) sont reliés par une arête. Source unique du graphe de liens.
   */
  tags: string[];
  /** Sous-titre / description courte affiché dans le panneau. */
  description?: string;
  /** Méta affichée sous le titre (déjà formatée, ex. période). */
  period?: string;
  /** Libellé d'état (ex. « Terminé », « En cours »). */
  statusLabel?: string;
  /** Tonalité du point d'état ; `active` allume aussi le marqueur du nœud. */
  statusTone?: ConstellationStatusTone;
  /** Petites étiquettes affichées dans le panneau (stack, mots-clés…). */
  chips?: string[];
  /** Liens d'action du panneau. */
  actions?: ConstellationAction[];
}

/** Placement manuel d'un cluster dans le repère viewBox 100×72 (cf. VIEWBOX). */
export interface ConstellationSeed {
  cx: number;
  cy: number;
  /** Rayon nominal de dispersion des nœuds autour du centre. */
  spread: number;
  /** Décalage angulaire de départ, pour casser l'alignement. */
  angle: number;
}

/** Une catégorie = une « constellation » (couleur, glyphe, placement). */
export interface ConstellationCategory {
  id: string;
  label: string;
  /** Couleur CSS (`#8eb8ff`, `var(--xxx)`, `oklch(...)`…). */
  color: string;
  /** Glyphe décoratif (◆ ✦ ◈ …). */
  glyph: string;
  /**
   * Placement manuel du cluster. Si omis, les catégories sans seed sont
   * réparties automatiquement sur une ellipse autour du centre.
   */
  seed?: ConstellationSeed;
}

/** Libellés UI — l'i18n reste à la charge de l'hôte. */
export interface ConstellationLabels {
  /** `aria-label` de la région carte. */
  region: string;
  search: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  legend: string;
  related: string;
  /** Libellé du bouton d'ouverture (émet `itemOpened`). */
  detail: string;
  emptyTitle: string;
  emptyText: string;
  /** Gabarit méta ; `{count}` et `{links}` sont substitués. */
  meta: string;
}

/** Libellés par défaut (anglais) — surchargeables via l'input `labels`. */
export const DEFAULT_CONSTELLATION_LABELS: ConstellationLabels = {
  region: 'Constellation map',
  search: 'Search',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  reset: 'Reset view',
  legend: 'Categories',
  related: 'Related',
  detail: 'Details',
  emptyTitle: 'Nothing selected',
  emptyText: 'No item matches the current filters.',
  meta: '{count} items · {links} links',
};
