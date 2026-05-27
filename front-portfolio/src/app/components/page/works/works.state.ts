import { SHARED_IMAGES } from '../../../img-sources/shared.sources';
import type { ResponsiveImageSet } from '../../../img-sources/shared.sources';

/** Clés logo — ordre = ordre d'enregistrement dans SHARED_IMAGES.organism.
    Certaines clés (pvzf, missionLocale) n'ont pas encore de logo : un monogramme
    est affiché à la place dans l'UI via getOrganismMonogram(). */
export type OrganismKey =
  | 'elanformation'
  | 'devmates'
  | 'atis'
  | 'microsoft'
  | 'freecodecamp'
  | 'pvzf'
  | 'missionLocale';

/** Partial : les organismes sans asset logo ne figurent pas ici. */
export const ORGANISM_LOGOS: Partial<Record<OrganismKey, ResponsiveImageSet>> = {
  elanformation: SHARED_IMAGES.organism.elanformation,
  devmates: SHARED_IMAGES.organism.devmates,
  atis: SHARED_IMAGES.organism.atis,
  microsoft: SHARED_IMAGES.organism.microsoft,
  freecodecamp: SHARED_IMAGES.organism.freecodecamp,
};

export const ORGANISM_NAMES: Record<OrganismKey, string> = {
  elanformation: 'Elan Formation',
  devmates: 'Dev Mates',
  atis: 'Atis Solutions',
  microsoft: 'Microsoft',
  freecodecamp: 'freeCodeCamp',
  pvzf: 'PVZF-Translation',
  missionLocale: 'Mission Locale Altkirch',
};

/** Monogramme de secours pour les organismes sans logo. 2-3 lettres max. */
export const ORGANISM_MONOGRAMS: Partial<Record<OrganismKey, string>> = {
  pvzf: 'PVZ',
  missionLocale: 'ML',
};

/* ─────────────────────────────────────────────────────────────────────────
   EXPÉRIENCES — poste professionnel ou bénévolat, avec période + description.
   end === null ⇒ en cours.
   ─────────────────────────────────────────────────────────────────────── */

export interface Experience {
  id: string;
  title: string;
  organism: OrganismKey;
  employment: string;      // Freelance / CDI / Stage / Alternance / Bénévole
  sector?: string;         // Secteur d'activité (optionnel)
  location: string;
  workMode: string;        // Sur site / À distance / Hybride
  start: string;           // YYYY-MM
  end: string | null;      // null ⇒ en poste
  description: string;     // paragraphes séparés par \n\n
  volunteer?: boolean;     // teinte visuelle distincte si true
}

/* Ordre inverse chronologique (le plus récent en premier).
   L'alternance gauche/droite de la timeline suit cet ordre. */
export const EXPERIENCES: Experience[] = [
  {
    id: 'mission-locale-mentor',
    title: 'Mentor & Animateur d\'ateliers',
    organism: 'missionLocale',
    employment: 'volunteer',
    sector: 'social',
    location: 'Altkirch, Grand Est, France',
    workMode: 'onsite',
    start: '2026-01',
    end: null,
    volunteer: true,
    description:
      "Accompagnement de jeunes dans un parcours de mentorat orienté vers les métiers du développement web. " +
      "L'objectif est de faciliter leur insertion professionnelle en travaillant sur les bases techniques, la compréhension du métier, les bonnes pratiques du secteur et la posture attendue en environnement professionnel.\n\n" +
      "En parallèle, animation d'ateliers d'initiation au développement web auprès de publics débutants pour démystifier le code et susciter des vocations.",
  },
  {
    id: 'elan-trainer',
    title: 'Formateur en Développement Web',
    organism: 'elanformation',
    employment: 'freelance',
    sector: 'training',
    location: 'Mulhouse, Grand Est, France',
    workMode: 'onsite',
    start: '2025-12',
    end: null,
    description:
      "Accompagnement et formation de futurs développeurs dans le cadre des parcours Développeur Web et Web Mobile (DWWM) et Concepteur Développeur d'Applications (CDA).\n\n" +
      "Transmission des fondamentaux techniques, des bonnes pratiques professionnelles et des compétences nécessaires à une insertion durable dans les métiers du développement logiciel.",
  },
  {
    id: 'pvzf-lead',
    title: "Chef d'équipe — Pôle francophone",
    organism: 'pvzf',
    employment: 'volunteer',
    sector: 'science',
    location: 'remote',
    workMode: 'remote',
    start: '2025-12',
    end: null,
    volunteer: true,
    description:
      "En tant que lead du pôle francophone du projet PVZ Fusion, je gère l'ensemble de l'équipe francophone : un pôle traduction et un pôle développement, soit une dizaine de contributeurs bénévoles répartis entre ces deux axes.\n\n" +
      "Je supervise les revues de traduction, rédige et maintiens l'ensemble de la documentation du pôle, et développe des outils internes pour faciliter le travail de l'équipe. Mon rôle inclut l'organisation, la distribution des tâches et la garantie d'une cohérence et d'une qualité constantes.",
  },
  {
    id: 'devmates',
    title: 'Développeur Full Stack',
    organism: 'devmates',
    employment: 'freelance',
    sector: 'consulting',
    location: 'remote',
    workMode: 'remote',
    start: '2025-11',
    end: null,
    description:
      "Chez Dev-Mates, j'accompagne en freelance les entreprises dans leur transformation digitale. Nous créons des sites vitrines et des applications web sur mesure, en offrant un accompagnement complet et humain à chaque étape.\n\n" +
      "Nous ne nous contentons pas seulement de développer des solutions : nous conseillons aussi nos clients sur les bonnes pratiques et assurons un suivi de qualité tout au long du cycle de vie de leurs projets. Chaque collaboration est synonyme d'excellence technique et d'une relation de confiance durable.",
  },
  {
    id: 'pvzf-translator',
    title: 'Traducteur & Développeur',
    organism: 'pvzf',
    employment: 'volunteer',
    sector: 'science',
    location: 'remote',
    workMode: 'remote',
    start: '2025-10',
    end: '2025-12',
    volunteer: true,
    description:
      "À mes débuts dans le projet PVZ Fusion, j'occupais le poste de traducteur au sein du pôle francophone. " +
      "Participation active à la relecture, à l'uniformisation terminologique et à la mise en place des premiers outils internes qui ont préfiguré le pôle développement.",
  },
  {
    id: 'atis-internship',
    title: 'Stage Développeur Full-Stack — Dolibarr ERP/CRM',
    organism: 'atis',
    employment: 'internship',
    sector: 'software',
    location: 'Sausheim, Grand Est, France',
    workMode: 'onsite',
    start: '2025-08',
    end: '2025-09',
    description:
      "Développement de modules et d'outils internes pour optimiser les processus de gestion dans Dolibarr ERP/CRM.\n\n" +
      "Création et personnalisation de modules métiers (gestion du temps, suivi des contrats) ayant réduit de 30 % le temps de traitement administratif. Mise en place de tableaux dynamiques, filtres avancés et dashboards interactifs permettant aux équipes de suivre en temps réel l'état des contrats et produits.\n\n" +
      "Amélioration de l'ergonomie via JavaScript et CSS, automatisation des exports et génération de statistiques. Développement modulaire et documenté en PHP POO, MySQL, ES6, avec intégration aux hooks Dolibarr Core.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   DIPLÔMES — formation diplômante.
   ─────────────────────────────────────────────────────────────────────── */

export interface Education {
  id: string;
  organism: OrganismKey;
  start: string;
  end: string;
  hasSubtitle?: boolean;
}

export const EDUCATIONS: Education[] = [
  {
    id: 'elan-dwwm',
    organism: 'elanformation',
    start: '2025-04',
    end: '2025-10',
    hasSubtitle: true,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   CERTIFICATIONS — sceaux obtenus, triés récent → ancien.
   url facultatif : si présent, le badge est cliquable.
   category : axe de filtrage du rail (glyphes ci-dessous, labels i18n).
   ─────────────────────────────────────────────────────────────────────── */

export type CertCategory = 'dev' | 'web' | 'data' | 'lang';

/** Glyphe rituel par catégorie — affiché dans les puces de filtre du rail. */
export const CERT_CATEGORIES: Record<CertCategory, { glyph: string }> = {
  dev:  { glyph: '◆' },
  web:  { glyph: '❖' },
  data: { glyph: '◉' },
  lang: { glyph: '✦' },
};

/** Ordre d'affichage des filtres (le filtre "tous" est ajouté en tête par l'UI). */
export const CERT_CATEGORY_ORDER: CertCategory[] = ['dev', 'web', 'data', 'lang'];

export interface Certification {
  id: string;
  title: string;
  organism: OrganismKey;
  issuedAt: string;
  category: CertCategory;
  credentialId?: string;
  url?: string;
}

export const CERTIFICATIONS: Certification[] = [
  { id: 'fcc-js',         title: 'JavaScript',                                        organism: 'freecodecamp', issuedAt: '2026-03', category: 'dev',  credentialId: 'hexanti-jsv9' },
  { id: 'fcc-py',         title: 'Python',                                            organism: 'freecodecamp', issuedAt: '2026-03', category: 'dev',  credentialId: 'hexanti-pyv9' },
  { id: 'fcc-b1-efd',     title: 'B1 English for Developers',                         organism: 'freecodecamp', issuedAt: '2026-03', category: 'lang', credentialId: 'hexanti-b1efd' },
  { id: 'fcc-rdv9',       title: 'Relational Database',                               organism: 'freecodecamp', issuedAt: '2026-03', category: 'data', credentialId: 'hexanti-rdv9' },
  { id: 'fcc-rd-v8',      title: 'Relational Database V8',                            organism: 'freecodecamp', issuedAt: '2026-03', category: 'data', credentialId: 'hexanti-rd' },
  { id: 'fcc-a2-efd',     title: 'A2 English for Developers',                         organism: 'freecodecamp', issuedAt: '2026-03', category: 'lang', credentialId: 'hexanti-a2efd' },
  { id: 'fcc-rwd-v9',     title: 'Responsive Web Design',                             organism: 'freecodecamp', issuedAt: '2026-03', category: 'web',  credentialId: 'hexanti-rwdv9' },
  { id: 'fcc-legacy-jads',title: 'Legacy JavaScript Algorithms and Data Structures V7', organism: 'freecodecamp', issuedAt: '2025-11', category: 'dev', credentialId: 'hexanti-ljaads' },
  { id: 'ms-csharp',      title: 'Foundational C# with Microsoft',                    organism: 'microsoft',    issuedAt: '2025-11', category: 'dev',  credentialId: 'hexanti-fcswm' },
  { id: 'fcc-backend',    title: 'Back End Development and APIs',                     organism: 'freecodecamp', issuedAt: '2025-06', category: 'web' },
  { id: 'fcc-jads',       title: 'JavaScript Algorithms and Data Structures',         organism: 'freecodecamp', issuedAt: '2025-06', category: 'dev',  credentialId: 'hexanti-jaads' },
  { id: 'fcc-rwd',        title: 'Responsive Web Design',                             organism: 'freecodecamp', issuedAt: '2024-11', category: 'web',  credentialId: 'hexanti-rwd' },
];

/* ─────────────────────────────────────────────────────────────────────────
   TIMELINE — fusion chronologique expériences + formations sur un même axe.
   buildTimeline trie selon l'ordre demandé et insère un marqueur d'année à
   chaque changement d'année.
   ─────────────────────────────────────────────────────────────────────── */

export type TimelineNode =
  | { kind: 'experience'; exp: Experience }
  | { kind: 'education'; edu: Education };

export type TimelineRow =
  | { type: 'year'; year: string }
  | { type: 'node'; node: TimelineNode };

export type TimelineOrder = 'recent' | 'old';

/** Périmètre de la timeline : tout, piste pro/académique, ou bénévolat seul. */
export type TimelineScope = 'all' | 'pro' | 'volunteer';

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

export interface WorksStat {
  key: 'experiences' | 'organisms' | 'formations' | 'certifications';
  value: number;
}

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
