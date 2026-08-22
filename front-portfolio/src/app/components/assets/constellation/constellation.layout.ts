import { ConstellationCategory, ConstellationItem, ConstellationSeed } from './constellation.model';

/**
 * Calculs purs (déterministes, SSR-safe) de la carte « constellation » :
 * placement des nœuds par cluster de catégorie, liens (tags partagés),
 * anneaux de cluster et poussière d'étoiles décorative.
 *
 * Tout est dérivé des données — aucune position n'est codée en dur par item,
 * de sorte que l'ajout/retrait d'un item recompose la carte.
 */

export interface ConstellationNode {
  id: string;
  item: ConstellationItem;
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

export interface ConstellationClusterRing {
  id: string;
  color: string;
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
  /** Teinte ponctuelle pour enrichir la galaxie (la majorité reste neutre). */
  hue: '' | 'gold' | 'blood' | 'moon';
}

/** Cadre « cœur » : ce que l'on voit au zoom 1 (les clusters d'items). */
export const VIEWBOX = { w: 100, h: 72 } as const;

/**
 * Cadre « univers » : champ d'étoiles bien plus large que le cœur, révélé en
 * dézoomant. Même ratio que VIEWBOX pour un letterboxing cohérent.
 * MIN_SCALE du composant = VIEWBOX.w / UNIVERSE.w.
 */
export const UNIVERSE = { w: 300, h: 216 } as const;

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

function normalizedTokens(item: ConstellationItem): Set<string> {
  return new Set(item.tags.map((token) => token.toLowerCase().trim()).filter(Boolean));
}

/**
 * Résout un seed par catégorie : explicite si fourni, sinon réparti
 * automatiquement sur une ellipse autour du centre du cœur.
 */
export function resolveSeeds(
  categories: readonly ConstellationCategory[],
): Map<string, ConstellationSeed> {
  const count = categories.length;
  const cx0 = VIEWBOX.w / 2;
  const cy0 = VIEWBOX.h / 2;
  const rx = VIEWBOX.w * 0.26;
  const ry = VIEWBOX.h * 0.28;
  const seeds = new Map<string, ConstellationSeed>();

  categories.forEach((category, index) => {
    if (category.seed) {
      seeds.set(category.id, category.seed);
      return;
    }
    if (count === 1) {
      seeds.set(category.id, { cx: cx0, cy: cy0 - 4, spread: 20, angle: 0 });
      return;
    }
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
    seeds.set(category.id, {
      cx: cx0 + Math.cos(angle) * rx,
      cy: cy0 + Math.sin(angle) * ry,
      spread: count <= 3 ? 16 : 12,
      angle: angle + 0.6,
    });
  });

  return seeds;
}

export function buildNodes(
  items: readonly ConstellationItem[],
  categories: readonly ConstellationCategory[],
): ConstellationNode[] {
  const seeds = resolveSeeds(categories);
  const nodes: ConstellationNode[] = [];

  for (const category of categories) {
    const seed = seeds.get(category.id);
    if (!seed) continue;

    const group = items.filter((item) => item.category === category.id);
    const count = group.length;

    group.forEach((item, index) => {
      let x: number;
      let y: number;

      if (count === 1) {
        x = seed.cx;
        y = seed.cy - seed.spread * 0.15;
      } else {
        const jitter = hash01(item.id);
        const angle = seed.angle + (index / count) * Math.PI * 2 + (jitter - 0.5) * 0.5;
        const radius = seed.spread * (0.5 + 0.45 * hash01(`${item.id}#r`));
        x = seed.cx + Math.cos(angle) * radius;
        y = seed.cy + Math.sin(angle) * radius * 0.82;
      }

      x = clamp(x, MARGIN.x, VIEWBOX.w - MARGIN.x);
      y = clamp(y, MARGIN.top, MARGIN.bottom);

      nodes.push({
        id: item.id,
        item,
        x,
        y,
        labelBelow: y < 34,
        driftDelay: -hash01(`${item.id}#dd`) * 9,
        driftDur: 6 + hash01(`${item.id}#du`) * 5,
      });
    });
  }

  return nodes;
}

export function buildClusters(
  items: readonly ConstellationItem[],
  categories: readonly ConstellationCategory[],
): ConstellationClusterRing[] {
  const seeds = resolveSeeds(categories);
  return categories
    .filter((category) => items.some((item) => item.category === category.id))
    .map((category) => {
      const seed = seeds.get(category.id)!;
      return {
        id: category.id,
        color: category.color,
        cx: seed.cx,
        cy: seed.cy,
        rx: seed.spread * 1.08,
        ry: seed.spread * 0.92,
      };
    });
}

/**
 * Lie chaque item à ses 2 voisins les plus proches (tags partagés),
 * dédupliqué. Graphe creux et stable quel que soit le jeu de données.
 */
export function buildEdges(items: readonly ConstellationItem[]): ConstellationEdge[] {
  const tokenSets = new Map(items.map((item) => [item.id, normalizedTokens(item)]));
  const seen = new Set<string>();
  const edges: ConstellationEdge[] = [];

  for (const item of items) {
    const own = tokenSets.get(item.id)!;

    const neighbours = items
      .filter((other) => other.id !== item.id)
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
      const key = [item.id, neighbour.id].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const [a, b] = key.split('|');
      edges.push({ a, b });
    }
  }

  return edges;
}

export function connectedIds(
  selectedId: string | null,
  edges: readonly ConstellationEdge[],
): Set<string> {
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
