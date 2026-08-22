/** Clés logo — ordre = ordre d'enregistrement dans SHARED_IMAGES.organism.
    Certaines clés (pvzf, missionLocale) n'ont pas encore de logo : un monogramme
    est affiché à la place dans l'UI via getOrganismMonogram(). */
export type OrganismKey =
  'elanformation' | 'devmates' | 'atis' | 'microsoft' | 'freecodecamp' | 'pvzf' | 'missionLocale';

/* ─────────────────────────────────────────────────────────────────────────
   EXPÉRIENCES — poste professionnel ou bénévolat, avec période + description.
   end === null ⇒ en cours.
   ─────────────────────────────────────────────────────────────────────── */

export interface Experience {
  id: string;
  title: string;
  organism: OrganismKey;
  employment: string; // Freelance / CDI / Stage / Alternance / Bénévole
  sector?: string; // Secteur d'activité (optionnel)
  location: string;
  workMode: string; // Sur site / À distance / Hybride
  start: string; // YYYY-MM
  end: string | null; // null ⇒ en poste
  description: string; // paragraphes séparés par \n\n
  volunteer?: boolean; // teinte visuelle distincte si true
}

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

/* ─────────────────────────────────────────────────────────────────────────
   CERTIFICATIONS — sceaux obtenus, triés récent → ancien.
   url facultatif : si présent, le badge est cliquable.
   category : axe de filtrage du rail (glyphes côté data, labels i18n).
   ─────────────────────────────────────────────────────────────────────── */

export type CertCategory = 'dev' | 'web' | 'data' | 'lang';

export interface Certification {
  id: string;
  title: string;
  organism: OrganismKey;
  issuedAt: string;
  category: CertCategory;
  credentialId?: string;
  url?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
   TIMELINE — fusion chronologique expériences + formations sur un même axe.
   ─────────────────────────────────────────────────────────────────────── */

export type TimelineNode =
  { kind: 'experience'; exp: Experience } | { kind: 'education'; edu: Education };

export type TimelineRow = { type: 'year'; year: string } | { type: 'node'; node: TimelineNode };

export type TimelineOrder = 'recent' | 'old';

/** Périmètre de la timeline : tout, piste pro/académique, ou bénévolat seul. */
export type TimelineScope = 'all' | 'pro' | 'volunteer';

/* ─────────────────────────────────────────────────────────────────────────
   STATS — chiffres dérivés des données pour le bandeau du header.
   ─────────────────────────────────────────────────────────────────────── */

export interface WorksStat {
  key: 'experiences' | 'organisms' | 'formations' | 'certifications';
  value: number;
}
