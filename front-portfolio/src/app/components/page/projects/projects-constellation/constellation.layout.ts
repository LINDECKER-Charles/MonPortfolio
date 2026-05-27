import { ProjectCategory, ProjectItem } from '../projects.state';

/**
 * Calculs purs (déterministes, SSR-safe) de la carte « constellation » :
 * placement des nœuds par cluster de catégorie, liens (stack/tags partagés),
 * anneaux de cluster et poussière d'étoiles décorative.
 *
 * Tout est dérivé des données projet — aucune position n'est codée en dur par
 * projet, de sorte que l'ajout/retrait d'un projet recompose la carte.
 */

export interface ConstellationNode {
  id: string;
  project: ProjectItem;
  x: number;
  y: number;
  /** Place le label sous le point (clusters hauts) plutôt qu'au-dessus. */
  labelBelow: boolean;
  /** Dérive « jiggle » désynchronisée (secondes), dérivée du hash de l'id. */
  driftDelay: number;
  driftDur: number;
}

export interface ConstellationEdge {
  a: string;
  b: string;
}

export interface ConstellationCluster {
  category: ProjectCategory;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface ConstellationStar {
  x: number;
  y: number;
  r: number;
  variant: '' | 's2' | 's3';
  /** Teinte ponctuelle pour enrichir la galaxie (la majorité reste parchemin). */
  hue: '' | 'gold' | 'blood' | 'moon';
}

/** Cadre « cœur » : ce que l'on voit au zoom 1 (les clusters de projets). */
export const VIEWBOX = { w: 100, h: 72 } as const;

/**
 * Cadre « univers » : champ d'étoiles bien plus large que le cœur, révélé en
 * dézoomant. Même ratio que VIEWBOX pour un letterboxing cohérent.
 * MIN_SCALE du composant = VIEWBOX.w / UNIVERSE.w.
 */
export const UNIVERSE = { w: 300, h: 216 } as const;

/** Ordre d'affichage (légende, rendu) et seul jeu de catégories cartographié. */
export const CATEGORY_ORDER: readonly ProjectCategory[] = [
  'personal',
  'open_source',
  'client',
] as const;

/** Glyphe décoratif par catégorie (gravure rituelle, neutre côté i18n). */
export const CATEGORY_GLYPH: Record<ProjectCategory, string> = {
  personal: '◆',
  open_source: '✦',
  client: '◈',
};

interface ClusterSeed {
  cx: number;
  cy: number;
  /** Rayon nominal de dispersion des nœuds autour du centre. */
  spread: number;
  /** Décalage angulaire de départ pour casser l'alignement. */
  angle: number;
}

const CLUSTER_SEEDS: Record<ProjectCategory, ClusterSeed> = {
  personal: { cx: 31, cy: 38, spread: 22, angle: -0.4 },
  open_source: { cx: 74, cy: 20, spread: 13, angle: 0.8 },
  client: { cx: 73, cy: 55, spread: 13, angle: 0.2 },
};

const MARGIN = { x: 7, top: 9, bottom: 63 };

/** FNV-1a normalisé sur [0,1) — bruit stable par identifiant. */
function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizedTokens(project: ProjectItem): Set<string> {
  return new Set(
    [...project.stack, ...project.tags].map((token) => token.toLowerCase().trim())
  );
}

export function buildNodes(projects: readonly ProjectItem[]): ConstellationNode[] {
  const nodes: ConstellationNode[] = [];

  for (const category of CATEGORY_ORDER) {
    const seed = CLUSTER_SEEDS[category];
    const group = projects.filter((project) => project.category === category);
    const count = group.length;

    group.forEach((project, index) => {
      let x: number;
      let y: number;

      if (count === 1) {
        x = seed.cx;
        y = seed.cy - seed.spread * 0.15;
      } else {
        const jitter = hash01(project.id);
        const angle = seed.angle + (index / count) * Math.PI * 2 + (jitter - 0.5) * 0.5;
        const radius = seed.spread * (0.5 + 0.45 * hash01(`${project.id}#r`));
        x = seed.cx + Math.cos(angle) * radius;
        y = seed.cy + Math.sin(angle) * radius * 0.82;
      }

      x = clamp(x, MARGIN.x, VIEWBOX.w - MARGIN.x);
      y = clamp(y, MARGIN.top, MARGIN.bottom);

      nodes.push({
        id: project.id,
        project,
        x,
        y,
        labelBelow: y < 34,
        driftDelay: -hash01(`${project.id}#dd`) * 9,
        driftDur: 6 + hash01(`${project.id}#du`) * 5,
      });
    });
  }

  return nodes;
}

export function buildClusters(projects: readonly ProjectItem[]): ConstellationCluster[] {
  return CATEGORY_ORDER.filter((category) =>
    projects.some((project) => project.category === category)
  ).map((category) => {
    const seed = CLUSTER_SEEDS[category];
    return {
      category,
      cx: seed.cx,
      cy: seed.cy,
      rx: seed.spread * 1.08,
      ry: seed.spread * 0.92,
    };
  });
}

/**
 * Lie chaque projet à ses 2 voisins les plus proches (stack/tags partagés),
 * dédupliqué. Graphe creux et stable quel que soit le jeu de données.
 */
export function buildEdges(projects: readonly ProjectItem[]): ConstellationEdge[] {
  const tokenSets = new Map(projects.map((project) => [project.id, normalizedTokens(project)]));
  const seen = new Set<string>();
  const edges: ConstellationEdge[] = [];

  for (const project of projects) {
    const own = tokenSets.get(project.id)!;

    const neighbours = projects
      .filter((other) => other.id !== project.id)
      .map((other) => {
        const otherTokens = tokenSets.get(other.id)!;
        let weight = 0;
        for (const token of own) {
          if (otherTokens.has(token)) weight++;
        }
        return { id: other.id, weight };
      })
      .filter((candidate) => candidate.weight > 0)
      .sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id))
      .slice(0, 2);

    for (const neighbour of neighbours) {
      const key = [project.id, neighbour.id].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const [a, b] = key.split('|');
      edges.push({ a, b });
    }
  }

  return edges;
}

export function connectedIds(selectedId: string | null, edges: readonly ConstellationEdge[]): Set<string> {
  const result = new Set<string>();
  if (!selectedId) return result;

  for (const edge of edges) {
    if (edge.a === selectedId) result.add(edge.b);
    else if (edge.b === selectedId) result.add(edge.a);
  }

  return result;
}

/**
 * Champ d'étoiles décoratif (galaxie), généré une fois de façon déterministe.
 * Réparti en polaire autour du cœur avec une densité décroissante vers les
 * bords (cœur de galaxie plus dense), pour que le dézoom révèle une nébuleuse.
 */
const frac = (n: number): number => n - Math.floor(n);

export const STARS: readonly ConstellationStar[] = Array.from({ length: 220 }, (_, i) => {
  const a = frac(Math.sin(i * 12.9898 + 3.1) * 43758.5453);
  const b = frac(Math.sin(i * 4.1414 + 1.7) * 2987.123);
  const c = frac(Math.sin(i * 78.233 + 0.5) * 12543.213);
  const d = frac(Math.cos(i * 24.17 + 2.3) * 7777.77);

  const angle = c * Math.PI * 2;
  // d^1.7 concentre les étoiles vers le centre ; ellipse plus large que haute.
  const radius = Math.pow(d, 1.7) * (UNIVERSE.w / 2) * 1.02;
  const x = VIEWBOX.w / 2 + Math.cos(angle) * radius * 1.12;
  const y = VIEWBOX.h / 2 + Math.sin(angle) * radius * 0.8;

  return {
    x,
    y,
    r: 0.1 + a * 0.4 + (b > 0.92 ? 0.45 : 0),
    variant: i % 3 === 0 ? 's2' : i % 5 === 0 ? 's3' : '',
    hue: i % 11 === 0 ? 'gold' : i % 17 === 0 ? 'blood' : i % 7 === 0 ? 'moon' : '',
  };
});
