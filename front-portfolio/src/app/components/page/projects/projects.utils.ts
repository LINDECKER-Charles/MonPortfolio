import { formatMonthYearDate } from '../../../utils/date-format';
import type { ProjectFiltersState, ProjectItem } from './projects.types';

/**
 * Filtrage pur de la timeline : catégorie exacte, tags et stack en « au moins
 * un ». Un groupe vide est neutre (aucun filtre actif sur ce groupe).
 */
export function applyFilters(
  projects: readonly ProjectItem[],
  filters: ProjectFiltersState,
): ProjectItem[] {
  return projects.filter((project) => {
    const categoryMatch = filters.category === 'all' || project.category === filters.category;

    const tagsMatch =
      filters.tags.length === 0 || filters.tags.some((tag) => project.tags.includes(tag));

    const stackMatch =
      filters.stack.length === 0 ||
      filters.stack.some((stackItem) => project.stack.includes(stackItem));

    return categoryMatch && tagsMatch && stackMatch;
  });
}

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
