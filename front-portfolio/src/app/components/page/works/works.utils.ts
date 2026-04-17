/**
 * Helpers de formatage pour la page Works.
 * Se base sur la langue active (`ts.lang()`) pour les noms de mois.
 */

const MONTHS_FR = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Parse "YYYY-MM" → { year, monthIdx (0..11) } ou null si invalide. */
function parse(ym: string): { year: number; monthIdx: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return null;
  const year = Number(m[1]);
  const monthIdx = Number(m[2]) - 1;
  if (Number.isNaN(year) || monthIdx < 0 || monthIdx > 11) return null;
  return { year, monthIdx };
}

/** "2025-12" → "déc. 2025" (fr) ou "Dec 2025" (en). */
export function formatMonthYear(ym: string, lang: string): string {
  const p = parse(ym);
  if (!p) return ym;
  const months = lang === 'en' ? MONTHS_EN : MONTHS_FR;
  return `${months[p.monthIdx]} ${p.year}`;
}

/** Période : "déc. 2025 — aujourd'hui" ou "avr. 2025 — oct. 2025". */
export function formatPeriod(start: string, end: string | null, lang: string, todayLabel: string): string {
  const startStr = formatMonthYear(start, lang);
  const endStr = end ? formatMonthYear(end, lang) : todayLabel;
  return `${startStr} — ${endStr}`;
}

/** Durée lisible : "5 mois" / "1 an 3 mois" / "2 mois". */
export function formatDuration(start: string, end: string | null, lang: string): string {
  const s = parse(start);
  const e = end ? parse(end) : parse(nowYearMonth());
  if (!s || !e) return '';

  const totalMonths = (e.year - s.year) * 12 + (e.monthIdx - s.monthIdx) + 1;
  if (totalMonths <= 0) return '';

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (lang === 'en') {
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo`);
    return parts.join(' ');
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} an${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mois`);
  return parts.join(' ');
}

function nowYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
