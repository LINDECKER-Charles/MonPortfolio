import gsap from 'gsap';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsFilter } from './projects-filter';
import { PROJECT_FILTERS, ProjectFiltersState } from '../projects.state';

function api(component: ProjectsFilter): any {
  return component as any;
}

async function createFixture(
  filtersState: ProjectFiltersState,
  platformId: unknown = 'browser'
): Promise<ComponentFixture<ProjectsFilter>> {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: platformId },
    ],
    imports: [ProjectsFilter],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProjectsFilter);
  fixture.componentRef.setInput('filters', PROJECT_FILTERS);
  fixture.componentRef.setInput('filtersState', filtersState);
  fixture.componentRef.setInput('availableTags', ['Angular', 'DDD', 'Full Stack', 'Jeu']);
  fixture.componentRef.setInput('availableStack', ['C#', '.NET', 'PostgreSQL', 'TypeScript']);
  return fixture;
}

describe('ProjectsFilter', () => {
  let component: ProjectsFilter;
  let fixture: ComponentFixture<ProjectsFilter>;

  const baseState = (): ProjectFiltersState => ({ category: 'all', tags: [], stack: [] });

  beforeEach(async () => {
    // évite de jouer les animations GSAP réelles dans ngAfterViewInit
    spyOn(gsap, 'fromTo').and.callThrough();
    fixture = await createFixture(baseState());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('déclenche les animations GSAP côté browser', () => {
      expect(gsap.fromTo).toHaveBeenCalled();
    });
  });

  describe('toggleTagsPanel / toggleStackPanel', () => {
    it('toggleTagsPanel ouvre puis ferme', () => {
      api(component).toggleTagsPanel();
      expect(api(component).isTagsPanelOpen).toBeTrue();
      api(component).toggleTagsPanel();
      expect(api(component).isTagsPanelOpen).toBeFalse();
    });

    it('ouvrir le panneau tags ferme le panneau stack', () => {
      api(component).isStackPanelOpen = true;
      api(component).toggleTagsPanel();
      expect(api(component).isTagsPanelOpen).toBeTrue();
      expect(api(component).isStackPanelOpen).toBeFalse();
    });

    it('ouvrir le panneau stack ferme le panneau tags', () => {
      api(component).isTagsPanelOpen = true;
      api(component).toggleStackPanel();
      expect(api(component).isStackPanelOpen).toBeTrue();
      expect(api(component).isTagsPanelOpen).toBeFalse();
    });
  });

  describe('handleDocumentClick', () => {
    it('ferme les panneaux si le clic est hors host', () => {
      api(component).isTagsPanelOpen = true;
      api(component).isStackPanelOpen = true;
      const outside = document.createElement('div');
      api(component).handleDocumentClick({ target: outside } as unknown as MouseEvent);
      expect(api(component).isTagsPanelOpen).toBeFalse();
      expect(api(component).isStackPanelOpen).toBeFalse();
    });

    it('laisse les panneaux ouverts si le clic est dans le host', () => {
      api(component).isTagsPanelOpen = true;
      const inside = fixture.nativeElement as HTMLElement;
      api(component).handleDocumentClick({ target: inside } as unknown as MouseEvent);
      expect(api(component).isTagsPanelOpen).toBeTrue();
    });
  });

  describe('filteredTags / filteredStack', () => {
    it('query vide renvoie la liste complète', () => {
      api(component).tagQuery = '   ';
      expect(api(component).filteredTags).toEqual(['Angular', 'DDD', 'Full Stack', 'Jeu']);
    });

    it('filtre insensible à la casse', () => {
      api(component).tagQuery = 'aNg';
      expect(api(component).filteredTags).toEqual(['Angular']);
    });

    it('renvoie une liste vide sans correspondance', () => {
      api(component).stackQuery = 'zzz';
      expect(api(component).filteredStack).toEqual([]);
    });

    it('filtre la stack', () => {
      api(component).stackQuery = 'type';
      expect(api(component).filteredStack).toEqual(['TypeScript']);
    });
  });

  describe('hasActiveFilters', () => {
    it('faux quand aucun filtre actif', () => {
      expect(api(component).hasActiveFilters()).toBeFalse();
    });

    it('vrai quand catégorie != all', async () => {
      const f = await createFixture({ category: 'client', tags: [], stack: [] });
      expect(api(f.componentInstance).hasActiveFilters()).toBeTrue();
    });

    it('vrai quand des tags sont sélectionnés', async () => {
      const f = await createFixture({ category: 'all', tags: ['Angular'], stack: [] });
      expect(api(f.componentInstance).hasActiveFilters()).toBeTrue();
    });

    it('vrai quand de la stack est sélectionnée', async () => {
      const f = await createFixture({ category: 'all', tags: [], stack: ['C#'] });
      expect(api(f.componentInstance).hasActiveFilters()).toBeTrue();
    });
  });

  describe('isTagSelected / isStackSelected', () => {
    it('reflètent l\'état des filtres', async () => {
      const f = await createFixture({ category: 'all', tags: ['Angular'], stack: ['C#'] });
      const c = f.componentInstance;
      expect(api(c).isTagSelected('Angular')).toBeTrue();
      expect(api(c).isTagSelected('DDD')).toBeFalse();
      expect(api(c).isStackSelected('C#')).toBeTrue();
      expect(api(c).isStackSelected('.NET')).toBeFalse();
    });
  });

  describe('trackByFilterId', () => {
    it('renvoie l\'id du filtre', () => {
      expect(api(component).trackByFilterId(0, PROJECT_FILTERS[0])).toBe(PROJECT_FILTERS[0].id);
    });
  });
});

describe('ProjectsFilter (serveur / non-browser)', () => {
  it('ngAfterViewInit ne joue aucune animation côté serveur', async () => {
    const spy = spyOn(gsap, 'fromTo').and.callThrough();
    const fixture = await createFixture(
      { category: 'all', tags: [], stack: [] },
      'server'
    );
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });
});
