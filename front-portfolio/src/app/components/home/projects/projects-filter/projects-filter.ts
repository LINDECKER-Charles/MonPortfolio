import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  ProjectCategory,
  ProjectFilterItem,
  ProjectFiltersState,
} from '../../../page/projects/projects.state';

@Component({
  selector: 'app-projects-filter',
  imports: [],
  templateUrl: './projects-filter.html',
  styleUrl: './projects-filter.css',
})
export class ProjectsFilter {
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

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

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
