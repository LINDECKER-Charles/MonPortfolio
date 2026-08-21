import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ProjectCategory, ProjectFilterItem, ProjectFiltersState } from '../projects.state';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-projects-filter',
  imports: [],
  templateUrl: './projects-filter.html',
  styleUrl: './projects-filter.css',
  // Entrance rituelle au premier paint (cf. ornaments.css) — pas de tween JS
  // à l'hydratation, qui re-masquerait la barre rendue en SSR.
  host: { class: 'emerge-ritual' },
})
export class ProjectsFilter {
  protected readonly ts = inject(TranslationService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  @Input({ required: true }) filters: ProjectFilterItem[] = [];
  @Input({ required: true }) filtersState!: ProjectFiltersState;
  @Input({ required: true }) availableTags: string[] = [];
  @Input({ required: true }) availableStack: string[] = [];

  @Output() categorySelected = new EventEmitter<ProjectCategory | 'all'>();
  @Output() tagToggled = new EventEmitter<string>();
  @Output() stackToggled = new EventEmitter<string>();
  @Output() resetRequested = new EventEmitter<void>();

  protected isTagsPanelOpen = false;
  protected isStackPanelOpen = false;
  protected tagQuery = '';
  protected stackQuery = '';

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
