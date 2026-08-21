import { formatMonthYearDate } from '../../../utils/date-format';
import { ProjectItem } from './projects.state';

export function formatProjectPeriod(
  project: ProjectItem,
  langCode: string,
  todayLabel: string,
): string {
  const start = formatMonthYearDate(project.period.dateStart, langCode);

  if (!project.period.isEnd || !project.period.dateEnd) {
    return `${start} - ${todayLabel}`;
  }

  return `${start} - ${formatMonthYearDate(project.period.dateEnd, langCode)}`;
}
