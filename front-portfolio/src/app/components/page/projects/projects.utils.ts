import { ProjectCategory, ProjectItem, ProjectStatus } from './projects.state';

export function formatProjectPeriod(project: ProjectItem): string {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
  });

  const start = formatter.format(project.period.dateStart);

  if (!project.period.isEnd || !project.period.dateEnd) {
    return `${start} - Aujourd'hui`;
  }

  const end = formatter.format(project.period.dateEnd);
  return `${start} - ${end}`;
}

export function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'done':
      return 'Termine';
    case 'in_progress':
      return 'En cours';
    case 'archived':
      return 'Archive';
    default:
      return status;
  }
}

export function getProjectCategoryLabel(category: ProjectCategory): string {
  switch (category) {
    case 'personal':
      return 'Personnel';
    case 'open_source':
      return 'Open Source';
    case 'client':
      return 'Client';
    case 'training':
      return 'Formation';
    default:
      return category;
  }
}
