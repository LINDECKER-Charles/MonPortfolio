import { ProjectCategory, ProjectItem, ProjectStatus } from './projects.state';

export function formatProjectPeriod(
  project: ProjectItem,
  locale: string,
  todayLabel: string
): string {
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

export function getProjectStatusKey(status: ProjectStatus): string {
  switch (status) {
    case 'done':
      return 'projects.status.done';
    case 'in_progress':
      return 'projects.status.inProgress';
    case 'archived':
      return 'projects.status.archived';
    default:
      return status;
  }
}

export function getProjectCategoryKey(category: ProjectCategory): string {
  switch (category) {
    case 'personal':
      return 'projects.category.personal';
    case 'open_source':
      return 'projects.category.openSource';
    case 'client':
      return 'projects.category.client';
    default:
      return category;
  }
}
