import { ProjectItem } from './projects.state';

export function formatProjectPeriod(project: ProjectItem, langCode: string, todayLabel: string): string {
  const locale = langCode === 'zh' ? 'zh-CN' : langCode === 'ar' ? 'ar-SA' : langCode;
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
