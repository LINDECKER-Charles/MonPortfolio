import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projects } from './projects';
import { PROJECTS_DATA } from './projects.data';
import type { ProjectItem } from './projects.types';

/** Accès typé-lâche aux membres protégés pour les tests. */
function api(component: Projects): any {
  return component as any;
}

async function createFixture(platformId: unknown = 'browser'): Promise<ComponentFixture<Projects>> {
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: PLATFORM_ID, useValue: platformId },
    ],
    imports: [Projects],
  }).compileComponents();

  const fixture = TestBed.createComponent(Projects);
  fixture.detectChanges();
  return fixture;
}

function pressEscape(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

describe('Projects', () => {
  let component: Projects;
  let fixture: ComponentFixture<Projects>;

  beforeEach(async () => {
    fixture = await createFixture('browser');
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtres dérivés', () => {
    it('availableTags est trié et dédupliqué', () => {
      const tags = api(component).availableTags;
      expect(tags).toEqual([...new Set(tags)]);
      expect(tags).toEqual([...tags].sort((a: string, b: string) => a.localeCompare(b)));
    });

    it('availableStack est trié et dédupliqué', () => {
      const stack = api(component).availableStack;
      expect(stack).toEqual([...new Set(stack)]);
      expect(stack).toEqual([...stack].sort((a: string, b: string) => a.localeCompare(b)));
    });

    it('filteredProjects = tous les projets sans filtre', () => {
      expect(api(component).filteredProjects().length).toBe(PROJECTS_DATA.length);
    });
  });

  describe('selectCategory', () => {
    it('filtre par catégorie', () => {
      api(component).selectCategory('client');
      const filtered: ProjectItem[] = api(component).filteredProjects();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((p) => p.category === 'client')).toBeTrue();
    });

    it('« all » conserve tous les projets', () => {
      api(component).selectCategory('client');
      api(component).selectCategory('all');
      expect(api(component).filteredProjects().length).toBe(PROJECTS_DATA.length);
    });
  });

  describe('toggleTag', () => {
    it('ajoute puis retire un tag', () => {
      const tag = api(component).availableTags[0];
      api(component).toggleTag(tag);
      expect(api(component).filtersState().tags).toContain(tag);
      api(component).toggleTag(tag);
      expect(api(component).filtersState().tags).not.toContain(tag);
    });

    it('filtre les projets sur le tag actif', () => {
      const tag = 'Open Source';
      api(component).toggleTag(tag);
      const filtered: ProjectItem[] = api(component).filteredProjects();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((p) => p.tags.includes(tag))).toBeTrue();
    });
  });

  describe('toggleStack', () => {
    it('ajoute puis retire un élément de stack', () => {
      const item = 'Angular';
      api(component).toggleStack(item);
      expect(api(component).filtersState().stack).toContain(item);
      api(component).toggleStack(item);
      expect(api(component).filtersState().stack).not.toContain(item);
    });

    it('filtre les projets sur la stack active', () => {
      api(component).toggleStack('Angular');
      const filtered: ProjectItem[] = api(component).filteredProjects();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((p) => p.stack.includes('Angular'))).toBeTrue();
    });
  });

  describe('clearFilters', () => {
    it('réinitialise catégorie, tags et stack', () => {
      api(component).selectCategory('client');
      api(component).toggleTag('Client');
      api(component).toggleStack('Angular');
      api(component).clearFilters();
      expect(api(component).filtersState()).toEqual({ category: 'all', tags: [], stack: [] });
    });
  });

  describe('setView', () => {
    it('bascule la vue', () => {
      api(component).setView('list');
      expect(api(component).view()).toBe('list');
      api(component).setView('map');
      expect(api(component).view()).toBe('map');
    });
  });

  describe('openProject / closeProject', () => {
    it("ouvre un projet, bloque le scroll body et remet l'index à zéro", () => {
      api(component).currentImageIndex.set(5);
      api(component).openProject(PROJECTS_DATA[0]);
      expect(api(component).selectedProject()).toBe(PROJECTS_DATA[0]);
      expect(api(component).currentImageIndex()).toBe(0);
      fixture.detectChanges(); // monte ProjectsModal, qui pose le verrou de scroll
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('ferme le projet et libère le scroll body', () => {
      api(component).openProject(PROJECTS_DATA[0]);
      fixture.detectChanges();
      api(component).closeProject();
      fixture.detectChanges(); // détruit ProjectsModal, qui restaure le scroll
      expect(api(component).selectedProject()).toBeNull();
      expect(api(component).currentImageIndex()).toBe(0);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('navigation images', () => {
    function projectWithImages(count: number): ProjectItem {
      const images = Array.from({ length: count }, (_, i) => ({
        alt: `img-${i}`,
        fallbackSrc: '',
        sources: [],
      }));
      return { ...PROJECTS_DATA[0], detail: { images } };
    }

    it('nextImage avance cycliquement', () => {
      api(component).openProject(projectWithImages(3));
      api(component).nextImage();
      expect(api(component).currentImageIndex()).toBe(1);
      api(component).currentImageIndex.set(2);
      api(component).nextImage();
      expect(api(component).currentImageIndex()).toBe(0);
    });

    it('previousImage recule cycliquement', () => {
      api(component).openProject(projectWithImages(3));
      api(component).previousImage();
      expect(api(component).currentImageIndex()).toBe(2);
      api(component).previousImage();
      expect(api(component).currentImageIndex()).toBe(1);
    });

    it('nextImage est un no-op sans images', () => {
      api(component).openProject({ ...PROJECTS_DATA[0], detail: { images: [] } });
      api(component).nextImage();
      expect(api(component).currentImageIndex()).toBe(0);
    });

    it('previousImage est un no-op sans detail', () => {
      api(component).openProject({ ...PROJECTS_DATA[0], detail: undefined });
      api(component).previousImage();
      expect(api(component).currentImageIndex()).toBe(0);
    });
  });

  describe('onConstellationOpen', () => {
    it("ouvre le projet correspondant à l'id", () => {
      const target = PROJECTS_DATA[1];
      api(component).onConstellationOpen({ id: target.id });
      expect(api(component).selectedProject()?.id).toBe(target.id);
    });

    it('ne fait rien pour un id inconnu', () => {
      api(component).onConstellationOpen({ id: 'does-not-exist' });
      expect(api(component).selectedProject()).toBeNull();
    });
  });

  describe('cascade Échap (intégration modal + lightbox, keydown réel sur document)', () => {
    const projectWithImages = (): ProjectItem =>
      PROJECTS_DATA.find((project) => (project.detail?.images?.length ?? 0) > 0)!;

    it('Échap ferme le modal ouvert', () => {
      api(component).openProject(PROJECTS_DATA[0]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-projects-modal')).not.toBeNull();

      pressEscape();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-projects-modal')).toBeNull();
      expect(api(component).selectedProject()).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });

    it('lightbox ouverte dans le modal : Échap ne ferme que la lightbox', () => {
      api(component).openProject(projectWithImages());
      fixture.detectChanges();

      const openLightbox: HTMLButtonElement | null = fixture.nativeElement.querySelector(
        '.projects-modal__carousel-image',
      );
      expect(openLightbox).not.toBeNull();
      openLightbox!.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-image-lightbox')).not.toBeNull();

      pressEscape();
      fixture.detectChanges();

      // Seule la lightbox se ferme : le modal projet reste ouvert et verrouillé.
      expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeNull();
      expect(fixture.nativeElement.querySelector('app-projects-modal')).not.toBeNull();
      expect(api(component).selectedProject()).not.toBeNull();
      expect(document.body.style.overflow).toBe('hidden');

      // Un second Échap ferme le modal et libère le scroll.
      pressEscape();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-projects-modal')).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });
  });
});

describe('Projects (serveur / non-browser)', () => {
  let component: Projects;
  let fixture: ComponentFixture<Projects>;

  beforeEach(async () => {
    // L'ordre des specs est aléatoire : on neutralise toute pollution laissée par un
    // test précédent (modal/lightbox posant overflow:hidden) avant d'asserter dessus.
    document.body.style.overflow = '';
    fixture = await createFixture('server');
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('openProject ne touche pas au scroll body côté serveur', () => {
    api(component).openProject(PROJECTS_DATA[0]);
    fixture.detectChanges(); // ProjectsModal monté, mais son verrou est neutralisé hors browser
    expect(document.body.style.overflow).toBe('');
    expect(api(component).selectedProject()).toBe(PROJECTS_DATA[0]);
  });

  it('closeProject reste neutre côté serveur', () => {
    api(component).openProject(PROJECTS_DATA[0]);
    api(component).closeProject();
    expect(api(component).selectedProject()).toBeNull();
  });
});
