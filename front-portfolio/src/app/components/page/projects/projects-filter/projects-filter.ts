import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  ProjectCategory,
  ProjectFilterItem,
  ProjectFiltersState,
} from '../projects.state';

@Component({
  selector: 'app-projects-filter',
  imports: [],
  templateUrl: './projects-filter.html',
  styleUrl: './projects-filter.css',
})
export class ProjectsFilter implements AfterViewInit {
  @Input({ required: true }) filters: ProjectFilterItem[] = [];
  @Input({ required: true }) filtersState!: ProjectFiltersState;
  @Input({ required: true }) availableTags: string[] = [];
  @Input({ required: true }) availableStack: string[] = [];

  @Output() categorySelected = new EventEmitter<ProjectCategory | 'all'>();
  @Output() tagToggled = new EventEmitter<string>();
  @Output() stackToggled = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  protected isTagsPanelOpen = false;
  protected isStackPanelOpen = false;
  protected tagQuery = '';
  protected stackQuery = '';

  private readonly isBrowser: boolean;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const host = this.elementRef.nativeElement;
    const items = host.querySelectorAll(
      '.projects-filters__group, .projects-filters__actions'
    );

    gsap.fromTo(
      host,
      { autoAlpha: 0, y: 24, filter: 'blur(10px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.62,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );

    if (items.length) {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
          stagger: 0.05,
          delay: 0.12,
        }
      );
    }
  }

  protected get filteredTags(): string[] {
    return this.filterItems(this.availableTags, this.tagQuery);
  }

  protected get filteredStack(): string[] {
    return this.filterItems(this.availableStack, this.stackQuery);
  }

  protected isTagSelected(tag: string): boolean {
    return this.filtersState.tags.includes(tag);
  }

  protected isStackSelected(stackItem: string): boolean {
    return this.filtersState.stack.includes(stackItem);
  }

  protected hasActiveFilters(): boolean {
    return (
      this.filtersState.category !== 'all' ||
      this.filtersState.tags.length > 0 ||
      this.filtersState.stack.length > 0
    );
  }

  protected trackByFilterId(_index: number, filter: ProjectFilterItem): string {
    return filter.id;
  }

  protected toggleTagsPanel(): void {
    this.isTagsPanelOpen = !this.isTagsPanelOpen;
    if (this.isTagsPanelOpen) {
      this.isStackPanelOpen = false;
    }
  }

  protected toggleStackPanel(): void {
    this.isStackPanelOpen = !this.isStackPanelOpen;
    if (this.isStackPanelOpen) {
      this.isTagsPanelOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    if (this.elementRef.nativeElement.contains(event.target as Node)) {
      return;
    }

    this.isTagsPanelOpen = false;
    this.isStackPanelOpen = false;
  }

  private filterItems(items: string[], query: string): string[] {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => item.toLocaleLowerCase().includes(normalizedQuery));
  }
}
