import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ProjectsFilter } from '../../home/projects/projects-filter/projects-filter';
import { ProjectsHeader } from '../../home/projects/projects-header/projects-header';
import { ProjectsModal } from '../../home/projects/projects-modal/projects-modal';
import { ProjectsTimeline } from '../../home/projects/projects-timeline/projects-timeline';
import {
  PROJECT_FILTERS,
  PROJECTS_DATA,
  ProjectCategory,
  ProjectFilterItem,
  ProjectFiltersState,
  ProjectItem,
} from './projects.state';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsHeader, ProjectsFilter, ProjectsTimeline, ProjectsModal],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly filters: ProjectFilterItem[] = PROJECT_FILTERS;
  protected readonly projects: ProjectItem[] = PROJECTS_DATA.map((project) => ({ ...project }));

  protected filtersState: ProjectFiltersState = {
    category: 'all',
    tags: [],
    stack: [],
  };

  protected selectedProject: ProjectItem | null = null;
  protected currentImageIndex = 0;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  protected get filteredProjects(): ProjectItem[] {
    return this.projects.filter((project) => {
      const categoryMatch =
        this.filtersState.category === 'all' ||
        project.category === this.filtersState.category;

      const tagsMatch =
        this.filtersState.tags.length === 0 ||
        this.filtersState.tags.some((tag) => project.tags.includes(tag));

      const stackMatch =
        this.filtersState.stack.length === 0 ||
        this.filtersState.stack.some((stackItem) => project.stack.includes(stackItem));

      return categoryMatch && tagsMatch && stackMatch;
    });
  }

  protected get availableTags(): string[] {
    return [...new Set(this.projects.flatMap((project) => project.tags))].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  protected get availableStack(): string[] {
    return [...new Set(this.projects.flatMap((project) => project.stack))].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  protected selectCategory(category: ProjectCategory | 'all'): void {
    this.filtersState = {
      ...this.filtersState,
      category,
    };
  }

  protected toggleTag(tag: string): void {
    const exists = this.filtersState.tags.includes(tag);

    this.filtersState = {
      ...this.filtersState,
      tags: exists
        ? this.filtersState.tags.filter((item) => item !== tag)
        : [...this.filtersState.tags, tag],
    };
  }

  protected toggleStack(stackItem: string): void {
    const exists = this.filtersState.stack.includes(stackItem);

    this.filtersState = {
      ...this.filtersState,
      stack: exists
        ? this.filtersState.stack.filter((item) => item !== stackItem)
        : [...this.filtersState.stack, stackItem],
    };
  }

  protected clearFilters(): void {
    this.filtersState = {
      category: 'all',
      tags: [],
      stack: [],
    };
  }

  protected openProject(project: ProjectItem): void {
    this.selectedProject = project;
    this.currentImageIndex = 0;

    if (!this.isBrowser) return;

    queueMicrotask(() => {
      document.body.style.overflow = 'hidden';
    });
  }

  protected closeProject(): void {
    this.selectedProject = null;
    this.currentImageIndex = 0;

    if (!this.isBrowser) return;

    document.body.style.overflow = '';
  }

  protected nextImage(): void {
    const images = this.selectedProject?.detail?.images ?? [];
    if (!images.length) return;

    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
  }

  protected previousImage(): void {
    const images = this.selectedProject?.detail?.images ?? [];
    if (!images.length) return;

    this.currentImageIndex =
      (this.currentImageIndex - 1 + images.length) % images.length;
  }

  @HostListener('document:keydown.escape')
  protected handleEscape(): void {
    if (this.selectedProject) {
      this.closeProject();
    }
  }
}
