import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsivePicture, ResponsiveSource } from './responsive-picture';

/** Contrat de non-régression du pipeline images (tri, srcset, media) — verrouille
    la surface exacte de la migration « serveur d'images → .env ». */
describe('ResponsivePicture', () => {
  let component: ResponsivePicture;
  let fixture: ComponentFixture<ResponsivePicture>;

  const WIDTH_SOURCES: ResponsiveSource[] = [
    { src: '/icon/80x80_rune.webp', width: 80, type: 'image/webp' },
    { src: '/icon/24x24_rune.webp', width: 24, type: 'image/webp' },
    { src: '/icon/40x40_rune.webp', width: 40, type: 'image/webp' },
  ];

  const MAX_WIDTH_SOURCES: ResponsiveSource[] = [
    { src: '/project/640x400_lantern.webp', maxWidth: 640, type: 'image/webp' },
    { src: '/project/320x200_lantern.webp', maxWidth: 320, type: 'image/webp' },
    { src: '/project/lantern.webp', type: 'image/webp' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ResponsivePicture],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsivePicture);
    component = fixture.componentInstance;
    component.fallbackSrc = '/icon/80x80_rune.webp';
    component.sources = WIDTH_SOURCES;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tri des sources', () => {
    it('trie par largeur croissante (width)', () => {
      expect(component.sortedSources.map((s) => s.width)).toEqual([24, 40, 80]);
    });

    it('trie par maxWidth croissant et rejette les sources sans descripteur en dernier', () => {
      component.sources = MAX_WIDTH_SOURCES;
      expect(component.sortedSources.map((s) => s.src)).toEqual([
        '/project/320x200_lantern.webp',
        '/project/640x400_lantern.webp',
        '/project/lantern.webp',
      ]);
    });

    it('ne mute pas le tableau de sources fourni', () => {
      const original = [...MAX_WIDTH_SOURCES];
      component.sources = MAX_WIDTH_SOURCES;
      expect(component.sortedSources.length).toBe(3);
      expect(MAX_WIDTH_SOURCES).toEqual(original);
    });
  });

  describe('mode descripteurs de largeur (srcset)', () => {
    it('active le mode uniquement quand toutes les sources portent width', () => {
      expect(component.usesWidthDescriptors).toBeTrue();
      component.sources = MAX_WIDTH_SOURCES;
      expect(component.usesWidthDescriptors).toBeFalse();
      component.sources = [];
      expect(component.usesWidthDescriptors).toBeFalse();
    });

    it('construit un srcset trié « url Nw » par type MIME', () => {
      expect(component.buildSrcSet('image/webp')).toBe(
        '/icon/24x24_rune.webp 24w, /icon/40x40_rune.webp 40w, /icon/80x80_rune.webp 80w',
      );
    });

    it('rend une <source> par type avec srcset groupé et sizes', () => {
      fixture.componentRef.setInput('sizes', '(max-width: 640px) 80vw, 420px');
      fixture.detectChanges();

      const sources: HTMLSourceElement[] = fixture.nativeElement.querySelectorAll('source');
      expect(sources.length).toBe(1);
      expect(sources[0].getAttribute('type')).toBe('image/webp');
      expect(sources[0].getAttribute('srcset')).toBe(
        '/icon/24x24_rune.webp 24w, /icon/40x40_rune.webp 40w, /icon/80x80_rune.webp 80w',
      );
      expect(sources[0].getAttribute('sizes')).toBe('(max-width: 640px) 80vw, 420px');
    });
  });

  describe('mode media queries (maxWidth)', () => {
    it('dérive media=(max-width: Npx) de maxWidth, null sans descripteur', () => {
      expect(component.buildMedia(640)).toBe('(max-width: 640px)');
      expect(component.buildMedia(undefined)).toBeNull();
    });

    it('rend une <source> par entrée avec son attribut media', () => {
      fixture.componentRef.setInput('sources', MAX_WIDTH_SOURCES);
      fixture.detectChanges();

      const sources: HTMLSourceElement[] = fixture.nativeElement.querySelectorAll('source');
      expect(sources.length).toBe(3);
      expect(sources[0].media).toBe('(max-width: 320px)');
      expect(sources[0].srcset).toBe('/project/320x200_lantern.webp');
      expect(sources[1].media).toBe('(max-width: 640px)');
      expect(sources[1].srcset).toBe('/project/640x400_lantern.webp');
      expect(sources[2].srcset).toBe('/project/lantern.webp');
    });
  });

  describe('image de repli', () => {
    it('rend le fallbackSrc et le cadrage inline object-fit/object-position', () => {
      fixture.componentRef.setInput('objectFit', 'contain');
      fixture.detectChanges();

      const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('src')).toBe('/icon/80x80_rune.webp');
      expect(img.style.objectFit).toBe('contain');
      // Chrome sérialise « center » en « center center » selon la version.
      expect(['center', 'center center']).toContain(img.style.objectPosition);
    });
  });
});
