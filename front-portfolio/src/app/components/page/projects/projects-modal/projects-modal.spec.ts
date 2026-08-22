import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { ProjectsModal } from './projects-modal';
import { PROJECTS_DATA } from '../projects.data';
import type { ProjectItem } from '../projects.types';

function api(component: ProjectsModal): any {
  return component as any;
}

async function createFixture(
  project: ProjectItem,
  sanitizerOverride?: Partial<DomSanitizer>,
): Promise<ComponentFixture<ProjectsModal>> {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      ...(sanitizerOverride ? [{ provide: DomSanitizer, useValue: sanitizerOverride }] : []),
    ],
    imports: [ProjectsModal],
  }).compileComponents();

  const fixture = TestBed.createComponent(ProjectsModal);
  fixture.componentRef.setInput('project', project);
  fixture.detectChanges();
  return fixture;
}

const projectWith = (detail: ProjectItem['detail']): ProjectItem => ({
  ...PROJECTS_DATA[0],
  detail,
});

describe('ProjectsModal', () => {
  let component: ProjectsModal;
  let fixture: ComponentFixture<ProjectsModal>;

  beforeEach(async () => {
    fixture = await createFixture(PROJECTS_DATA[0]);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('verrou de scroll', () => {
    it('verrouille le body au montage et restaure la valeur précédente à la destruction', () => {
      expect(document.body.style.overflow).toBe('hidden');
      fixture.destroy();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('currentImage', () => {
    it('renvoie null sans images', async () => {
      const f = await createFixture(projectWith({ images: [] }));
      expect(api(f.componentInstance).currentImage).toBeNull();
    });

    it('renvoie null si detail absent', async () => {
      const f = await createFixture(projectWith(undefined));
      expect(api(f.componentInstance).currentImage).toBeNull();
    });

    it("renvoie l'image à l'index courant", () => {
      const img = api(component).currentImage;
      expect(img).toBe(PROJECTS_DATA[0].detail!.images![0]);
    });

    it('renvoie null si index hors bornes', async () => {
      const f = await createFixture(
        projectWith({ images: [{ alt: '', fallbackSrc: '', sources: [] }] }),
      );
      f.componentRef.setInput('currentImageIndex', 99);
      f.detectChanges();
      expect(api(f.componentInstance).currentImage).toBeNull();
    });
  });

  describe('safeVideoUrl', () => {
    it('renvoie null sans video', async () => {
      const f = await createFixture(projectWith({ images: [] }));
      expect(api(f.componentInstance).safeVideoUrl).toBeNull();
    });

    it('renvoie null si video est une chaîne vide après trim', async () => {
      const f = await createFixture(projectWith({ video: '   ' }));
      expect(api(f.componentInstance).safeVideoUrl).toBeNull();
    });

    it('renvoie null si la sanitization renvoie null', async () => {
      const sanitizer: Partial<DomSanitizer> = {
        sanitize: () => null,
        bypassSecurityTrustResourceUrl: () => 'should-not-be-called' as never,
      };
      const f = await createFixture(projectWith({ video: 'https://example.com/video' }), sanitizer);
      expect(api(f.componentInstance).safeVideoUrl).toBeNull();
    });

    it('renvoie une URL sûre pour une video valide', async () => {
      const f = await createFixture(projectWith({ video: 'https://www.youtube.com/embed/abc' }));
      expect(api(f.componentInstance).safeVideoUrl).not.toBeNull();
    });
  });

  describe('hasMedia', () => {
    it('vrai avec une image', () => {
      expect(api(component).hasMedia).toBeTrue();
    });

    it('vrai avec une video seule', async () => {
      const f = await createFixture(
        projectWith({ images: [], video: 'https://www.youtube.com/embed/abc' }),
      );
      expect(api(f.componentInstance).hasMedia).toBeTrue();
    });

    it('faux sans image ni video', async () => {
      const f = await createFixture(projectWith({ images: [] }));
      expect(api(f.componentInstance).hasMedia).toBeFalse();
    });
  });

  describe('formatPeriod', () => {
    it('renvoie une chaîne non vide', () => {
      expect(api(component).formatPeriod()).toBeTruthy();
    });
  });

  describe('lightbox', () => {
    it('openImageLightbox ouvre quand une image existe', () => {
      api(component).openImageLightbox();
      expect(api(component).isImageLightboxOpen).toBeTrue();
    });

    it('openImageLightbox no-op sans image', async () => {
      const f = await createFixture(projectWith({ images: [] }));
      api(f.componentInstance).openImageLightbox();
      expect(api(f.componentInstance).isImageLightboxOpen).toBeFalse();
    });

    it('closeImageLightbox referme', () => {
      api(component).openImageLightbox();
      api(component).closeImageLightbox();
      expect(api(component).isImageLightboxOpen).toBeFalse();
    });
  });

  describe('onEscape', () => {
    it('ferme la lightbox si ouverte sans émettre close', () => {
      const closeSpy = spyOn(component.closed, 'emit');
      api(component).openImageLightbox();
      api(component).onEscape();
      expect(api(component).isImageLightboxOpen).toBeFalse();
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('émet close si la lightbox est fermée', () => {
      const closeSpy = spyOn(component.closed, 'emit');
      api(component).onEscape();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
