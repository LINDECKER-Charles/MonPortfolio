import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  PROJECT_FILTERS,
  PROJECTS_DATA,
  ProjectCategory,
  ProjectFilterItem,
  ProjectItem,
} from './projects.state';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit {
  @ViewChildren('timelineItem')
  private timelineItemRefs!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('projectContent')
  private projectContentRefs!: QueryList<ElementRef<HTMLElement>>;

  protected readonly filters: ProjectFilterItem[] = PROJECT_FILTERS;
  protected selectedFilter: ProjectCategory = 'all';
  protected projects: ProjectItem[] = PROJECTS_DATA.map((project) => ({ ...project }));

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  protected get filteredProjects(): ProjectItem[] {
    if (this.selectedFilter === 'all') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === this.selectedFilter);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.initializeProjectPanels();
    this.animateTimelineIntro();
  }

  protected selectFilter(filter: ProjectCategory): void {
    this.selectedFilter = filter;

    this.projects = this.projects.map((project) => ({
      ...project,
      isOpen: false,
    }));

    if (!this.isBrowser) return;

    queueMicrotask(() => {
      this.initializeProjectPanels();
      this.animateTimelineIntro();
    });
  }

  protected toggleProject(projectId: string): void {
    const filtered = this.filteredProjects;
    const targetIndex = filtered.findIndex((project) => project.id === projectId);
    if (targetIndex === -1) return;

    const targetProject = filtered[targetIndex];

    this.projects = this.projects.map((project) => {
      if (project.id === targetProject.id) {
        return { ...project, isOpen: !project.isOpen };
      }

      return { ...project, isOpen: false };
    });

    if (!this.isBrowser) return;

    queueMicrotask(() => {
      const updatedFiltered = this.filteredProjects;

      updatedFiltered.forEach((project, index) => {
        const contentEl = this.projectContentRefs.get(index)?.nativeElement;
        if (!contentEl) return;

        gsap.killTweensOf(contentEl);

        if (project.isOpen) {
          gsap.set(contentEl, {
            overflow: 'hidden',
            display: 'block',
          });

          gsap.fromTo(
            contentEl,
            {
              height: 0,
              autoAlpha: 0,
              y: -8,
              filter: 'blur(6px)',
            },
            {
              height: contentEl.scrollHeight,
              autoAlpha: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.42,
              ease: 'power3.out',
              onComplete: () => {
                gsap.set(contentEl, {
                  height: 'auto',
                  overflow: 'visible',
                });
              },
            }
          );
        } else {
          gsap.set(contentEl, {
            overflow: 'hidden',
          });

          gsap.to(contentEl, {
            height: 0,
            autoAlpha: 0,
            y: -8,
            filter: 'blur(6px)',
            duration: 0.34,
            ease: 'power2.inOut',
          });
        }
      });
    });
  }

  protected trackByProjectId(_index: number, project: ProjectItem): string {
    return project.id;
  }

  protected trackByFilterId(_index: number, filter: ProjectFilterItem): string {
    return filter.id;
  }

  protected getStatusLabel(status: ProjectItem['status']): string {
    switch (status) {
      case 'done':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  }

  protected getCategoryLabel(category: ProjectItem['category']): string {
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

  private initializeProjectPanels(): void {
    this.projectContentRefs.forEach((ref) => {
      gsap.set(ref.nativeElement, {
        height: 0,
        autoAlpha: 0,
        overflow: 'hidden',
        y: -8,
        filter: 'blur(6px)',
      });
    });
  }

  private animateTimelineIntro(): void {
    const items = this.timelineItemRefs.map((ref) => ref.nativeElement);

    if (!items.length) return;

    gsap.set(items, {
      autoAlpha: 0,
      y: 24,
      filter: 'blur(10px)',
    });

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'filter',
    });
  }
}
