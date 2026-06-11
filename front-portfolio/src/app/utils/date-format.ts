/**
 * Formatage de dates partagé (projects, works) basé sur Intl.
 * La langue active est résolue vers une locale Intl valide, fallback anglais.
 */

const VALID_INTL_LOCALES = new Set(['fr', 'en', 'es', 'de', 'it', 'pt', 'ja', 'zh', 'ar', 'ru']);

/** Résout un code langue applicatif vers une locale Intl (zh→zh-CN, ar→ar-SA, inconnu→en). */
export function resolveIntlLocale(lang: string): string {
  const resolved = VALID_INTL_LOCALES.has(lang) ? lang : 'en';
  return resolved === 'zh' ? 'zh-CN' : resolved === 'ar' ? 'ar-SA' : resolved;
}

/** "mois court + année" dans la langue active — ex. "déc. 2025" (fr), "Dec 2025" (en). */
export function formatMonthYearDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(resolveIntlLocale(lang), {
    year: 'numeric',
    month: 'short',
  }).format(date);
}
