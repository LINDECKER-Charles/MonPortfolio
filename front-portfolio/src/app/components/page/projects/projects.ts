import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Constellation } from '../../assets/constellation/constellation';
import { ConstellationItem } from '../../assets/constellation/constellation.model';
import {
  buildConstellationCategories,
  buildConstellationLabels,
  toConstellationItems,
} from './projects-constellation.adapter';
import { ProjectsFilter } from './projects-filter/projects-filter';
import { ProjectsHeader } from './projects-header/projects-header';
import { ProjectsModal } from './projects-modal/projects-modal';
import { ProjectsTimeline } from './projects-timeline/projects-timeline';
import { TranslationService } from '../../../services/translation.service';
import { wrapIndex } from '../../../utils/math';
import { PROJECT_FILTERS, PROJECT_STACK, PROJECT_TAGS, PROJECTS_DATA } from './projects.data';
import { applyFilters } from './projects.utils';
import type {
  ProjectCategory,
  ProjectFilterItem,
  ProjectFiltersState,
  ProjectItem,
} from './projects.types';

type ProjectsView = 'map' | 'list';

const EMPTY_FILTERS: ProjectFiltersState = {
  category: 'all',
  tags: [],
  stack: [],
};

@Component({
  selector: 'app-projects',
  imports: [ProjectsHeader, Constellation, ProjectsFilter, ProjectsTimeline, ProjectsModal],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly ts = inject(TranslationService);
  protected readonly filters: ProjectFilterItem[] = PROJECT_FILTERS;
  protected readonly availableTags: string[] = PROJECT_TAGS;
  protected readonly availableStack: string[] = PROJECT_STACK;

  protected readonly view = signal<ProjectsView>('map');
  protected readonly filtersState = signal<ProjectFiltersState>(EMPTY_FILTERS);
  protected readonly selectedProject = signal<ProjectItem | null>(null);
  protected readonly currentImageIndex = signal(0);

  protected readonly filteredProjects = computed(() =>
    applyFilters(PROJECTS_DATA, this.filtersState()),
  );

  // Entrées du composant générique « constellation » — recalculées à chaque
  // changement de langue (lecture de TranslationService dans l'adaptateur).
  protected readonly constellationItems = computed(() =>
    toConstellationItems(PROJECTS_DATA, this.ts),
  );
  protected readonly constellationCategories = computed(() =>
    buildConstellationCategories(this.ts),
  );
  protected readonly constellationLabels = computed(() => buildConstellationLabels(this.ts));

  protected selectCategory(category: ProjectCategory | 'all'): void {
    this.filtersState.update((state) => ({ ...state, category }));
  }

  protected toggleTag(tag: string): void {
    this.filtersState.update((state) => ({ ...state, tags: toggleValue(state.tags, tag) }));
  }

  protected toggleStack(stackItem: string): void {
    this.filtersState.update((state) => ({ ...state, stack: toggleValue(state.stack, stackItem) }));
  }

  protected clearFilters(): void {
    this.filtersState.set(EMPTY_FILTERS);
  }

  protected setView(view: ProjectsView): void {
    this.view.set(view);
  }

  protected onConstellationOpen(item: ConstellationItem): void {
    const project = PROJECTS_DATA.find((candidate) => candidate.id === item.id);
    if (project) this.openProject(project);
  }

  // Le verrou de scroll et la fermeture Échap appartiennent à ProjectsModal
  // (et à sa lightbox) : la page ne fait que porter l'état d'ouverture.
  protected openProject(project: ProjectItem): void {
    this.selectedProject.set(project);
    this.currentImageIndex.set(0);
  }

  protected closeProject(): void {
    this.selectedProject.set(null);
    this.currentImageIndex.set(0);
  }

  protected nextImage(): void {
    const images = this.selectedProject()?.detail?.images ?? [];
    if (!images.length) return;

    this.currentImageIndex.update((index) => wrapIndex(index + 1, images.length));
  }

  protected previousImage(): void {
    const images = this.selectedProject()?.detail?.images ?? [];
    if (!images.length) return;

    this.currentImageIndex.update((index) => wrapIndex(index - 1, images.length));
  }
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
