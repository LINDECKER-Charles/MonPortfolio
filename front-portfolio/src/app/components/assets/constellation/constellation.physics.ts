/**
 * Simulation masse-ressort pure de la carte « constellation ». Aucune
 * dépendance Angular — la boucle RAF et le signal `displaced` restent côté
 * composant, qui applique le résultat de chaque {@link simStep}.
 */

/** Position dynamique d'une sphère pendant l'effet ressort. */
export interface Sim {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/* Constantes du système de ressorts (par frame ~60 fps). */
export const K_ANCHOR = 0.018; // rappel vers la position d'origine
export const K_EDGE = 0.05; // tension des liens (propagation)
export const DAMP = 0.86; // amortissement
export const REST_ENERGY = 1e-4; // seuil d'arrêt de la boucle

/** Ancre d'une sphère : sa position « maison » déterministe. */
export interface SpringAnchor {
  id: string;
  x: number;
  y: number;
}

/** Lien entre deux sphères (identifiants d'ancres). */
export interface SpringEdge {
  a: string;
  b: string;
}

export interface SimStepResult {
  next: Map<string, Sim>;
  /** Vrai quand le système est au repos (aucun drag, énergie sous le seuil). */
  settled: boolean;
}

/**
 * Une itération du système masse-ressort : chaque sphère est rappelée vers sa
 * position d'origine (ancre) et reliée à ses voisines (arêtes). La sphère
 * tirée est épinglée sur le pointeur et entraîne les autres de proche en proche.
 */
export function simStep(
  homes: readonly SpringAnchor[],
  edges: readonly SpringEdge[],
  displaced: ReadonlyMap<string, Sim>,
  draggingId: string | null,
  dragTarget: { x: number; y: number },
): SimStepResult {
  const homeById = new Map(homes.map((n) => [n.id, n]));

  // Positions courantes (maison si non déplacée), sphère tirée épinglée.
  const cur = new Map<string, Sim>();
  for (const n of homes) {
    const p = displaced.get(n.id);
    cur.set(n.id, p ? { ...p } : { x: n.x, y: n.y, vx: 0, vy: 0 });
  }
  if (draggingId) {
    const c = cur.get(draggingId);
    if (c) {
      c.x = dragTarget.x;
      c.y = dragTarget.y;
      c.vx = 0;
      c.vy = 0;
    }
  }

  // Forces : ancrage + tension des liens.
  const force = new Map<string, { x: number; y: number }>();
  for (const id of cur.keys()) force.set(id, { x: 0, y: 0 });

  for (const [id, p] of cur) {
    const home = homeById.get(id)!;
    const f = force.get(id)!;
    f.x += (home.x - p.x) * K_ANCHOR;
    f.y += (home.y - p.y) * K_ANCHOR;
  }

  for (const edge of edges) {
    const a = cur.get(edge.a);
    const b = cur.get(edge.b);
    const ha = homeById.get(edge.a);
    const hb = homeById.get(edge.b);
    if (!a || !b || !ha || !hb) continue;
    const rest = Math.hypot(ha.x - hb.x, ha.y - hb.y);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1e-4;
    const k = ((dist - rest) / dist) * K_EDGE;
    force.get(edge.a)!.x += dx * k;
    force.get(edge.a)!.y += dy * k;
    force.get(edge.b)!.x -= dx * k;
    force.get(edge.b)!.y -= dy * k;
  }

  // Intégration (Euler amorti) ; la sphère tirée reste épinglée.
  let energy = 0;
  const next = new Map<string, Sim>();
  for (const [id, p] of cur) {
    if (id === draggingId) {
      next.set(id, { x: p.x, y: p.y, vx: 0, vy: 0 });
      continue;
    }
    const f = force.get(id)!;
    const vx = (p.vx + f.x) * DAMP;
    const vy = (p.vy + f.y) * DAMP;
    energy += vx * vx + vy * vy;
    next.set(id, { x: p.x + vx, y: p.y + vy, vx, vy });
  }

  return { next, settled: draggingId === null && energy <= REST_ENERGY };
}
