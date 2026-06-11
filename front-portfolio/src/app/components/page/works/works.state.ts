/* État works : logique de transformation (timeline, stats) construite sur les
   types de `works.types.ts` et les données de `works.data.ts`, tous deux
   ré-exportés ici pour préserver les imports existants des consommateurs. */
import type {
  OrganismKey,
  TimelineNode,
  TimelineOrder,
  TimelineRow,
  TimelineScope,
  WorksStat,
} from './works.types';
import { CERTIFICATIONS, EDUCATIONS, EXPERIENCES } from './works.data';

export * from './works.types';
export * from './works.data';

/* ─────────────────────────────────────────────────────────────────────────
   TIMELINE — fusion chronologique expériences + formations sur un même axe.
   buildTimeline trie selon l'ordre demandé et insère un marqueur d'année à
   chaque changement d'année.
   ─────────────────────────────────────────────────────────────────────── */

/** La formation (diplôme) est rattachée à la piste pro (non bénévole). */
function inScope(node: TimelineNode, scope: TimelineScope): boolean {
  if (scope === 'all') return true;
  if (node.kind === 'education') return scope === 'pro';
  return scope === 'volunteer' ? !!node.exp.volunteer : !node.exp.volunteer;
}

/** "YYYY-MM" du mois courant — utilisé pour rattacher les postes en cours. */
function nowYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function buildTimeline(order: TimelineOrder, scope: TimelineScope = 'all'): TimelineRow[] {
  // Une expérience "en poste" (end === null) est rattachée à l'année courante
  // pour le tri et le marqueur d'année, même si elle a démarré plus tôt.
  const now = nowYearMonth();
  const nodes = [
    ...EXPERIENCES.map((exp) => ({
      start: exp.start,
      sortKey: exp.end === null ? now : exp.start,
      node: { kind: 'experience', exp } as TimelineNode,
    })),
    ...EDUCATIONS.map((edu) => ({
      start: edu.start,
      sortKey: edu.start,
      node: { kind: 'education', edu } as TimelineNode,
    })),
  ].filter(({ node }) => inScope(node, scope));

  // "YYYY-MM" se compare lexicalement comme chronologiquement.
  // Tri sur la clé effective, départage par le vrai début (ordre cohérent
  // entre plusieurs postes en cours).
  nodes.sort((a, b) => {
    const primary =
      order === 'recent'
        ? b.sortKey.localeCompare(a.sortKey)
        : a.sortKey.localeCompare(b.sortKey);
    if (primary !== 0) return primary;
    return order === 'recent' ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start);
  });

  const rows: TimelineRow[] = [];
  let currentYear = '';
  for (const { sortKey, node } of nodes) {
    const year = sortKey.slice(0, 4);
    if (year !== currentYear) {
      rows.push({ type: 'year', year });
      currentYear = year;
    }
    rows.push({ type: 'node', node });
  }
  return rows;
}

/** Nombre de nœuds (hors marqueurs d'année) par périmètre — pour les compteurs UI. */
export function timelineCounts(): Record<TimelineScope, number> {
  const count = (scope: TimelineScope) =>
    buildTimeline('recent', scope).filter((row) => row.type === 'node').length;
  return { all: count('all'), pro: count('pro'), volunteer: count('volunteer') };
}

/* ─────────────────────────────────────────────────────────────────────────
   STATS — chiffres dérivés des données pour le bandeau du header.
   ─────────────────────────────────────────────────────────────────────── */

export function computeStats(): WorksStat[] {
  const organisms = new Set<OrganismKey>();
  for (const exp of EXPERIENCES) organisms.add(exp.organism);
  for (const edu of EDUCATIONS) organisms.add(edu.organism);

  return [
    { key: 'experiences', value: EXPERIENCES.length },
    { key: 'organisms', value: organisms.size },
    { key: 'formations', value: EDUCATIONS.length },
    { key: 'certifications', value: CERTIFICATIONS.length },
  ];
}
