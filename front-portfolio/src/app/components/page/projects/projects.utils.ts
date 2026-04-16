import { ProjectItem } from './projects.state';

const VALID_INTL_LOCALES = new Set(['fr', 'en', 'es', 'de', 'it', 'pt', 'ja', 'zh', 'ar', 'ru']);

export function formatProjectPeriod(project: ProjectItem, langCode: string, todayLabel: string): string {
  const resolvedLang = VALID_INTL_LOCALES.has(langCode) ? langCode : 'en';
  const locale = resolvedLang === 'zh' ? 'zh-CN' : resolvedLang === 'ar' ? 'ar-SA' : resolvedLang;
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
  });

  const start = formatter.format(project.period.dateStart);

  if (!project.period.isEnd || !project.period.dateEnd) {
    return `${start} - ${todayLabel}`;
  }

  const end = formatter.format(project.period.dateEnd);
  return `${start} - ${end}`;
}
