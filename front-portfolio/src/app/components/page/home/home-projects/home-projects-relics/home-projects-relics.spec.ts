import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeProjectsRelics, Relic, selectRelics, toRelicImage } from './home-projects-relics';
import { PROJECTS_DATA } from '../../../projects/projects.data';
import type { ProjectItem, ProjectMediaImage } from '../../../projects/projects.types';
import { TranslationService } from '../../../../../services/translation.service';

function api(component: HomeProjectsRelics): { relics: readonly Relic[] } {
  return component as any;
}

function relicLinks(fixture: ComponentFixture<HomeProjectsRelics>): HTMLAnchorElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('a.relic'));
}

describe('HomeProjectsRelics', () => {
  let component: HomeProjectsRelics;
  let fixture: ComponentFixture<HomeProjectsRelics>;
  let translateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeProjectsRelics],
    }).compileComponents();

    translateSpy = spyOn(TestBed.inject(TranslationService), 'translate').and.callFake(
      (key: string) => key,
    );

    fixture = TestBed.createComponent(HomeProjectsRelics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders four relics, each linking to /projects', () => {
    const links = relicLinks(fixture);

    expect(links.length).toBe(4);
    links.forEach((link) => expect(link.getAttribute('href')).toBe('/projects'));
  });

  it('prefers featured projects, in data order', () => {
    const expected = PROJECTS_DATA.filter((project) => project.featured)
      .slice(0, 4)
      .map((project) => project.id);

    expect(api(component).relics.map((relic) => relic.id)).toEqual(expected);
  });

  it('derives year, live state, first image and a three-item stack', () => {
    const relic = api(component).relics[0];
    const source = PROJECTS_DATA.find((project) => project.id === relic.id)!;

    expect(relic.year).toBe(source.period.dateStart.getFullYear());
    expect(relic.live).toBe(source.status === 'in_progress');
    expect(relic.image).toEqual(toRelicImage(source.detail!.images![0]));
    expect(relic.stack).toEqual(source.stack.slice(0, 3));
  });

  it('renders a single srcset source with width descriptors and a sizes attribute', () => {
    const pictures: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.relic__media app-responsive-picture'),
    );

    expect(pictures.length).toBe(api(component).relics.filter((relic) => relic.image).length);
    pictures.forEach((picture) => {
      const sources = picture.querySelectorAll('source');
      const srcset = sources[0].getAttribute('srcset')!;
      const candidates = srcset.split(',').map((candidate) => candidate.trim());

      expect(sources.length).toBe(1);
      expect(sources[0].hasAttribute('media')).toBeFalse();
      expect(sources[0].getAttribute('sizes')).toBe('(max-width: 640px) 80vw, 280px');
      expect(candidates.length).toBeGreaterThan(1);
      candidates.forEach((candidate) => expect(candidate).toMatch(/ \d+w$/));
      expect(picture.querySelector('img')!.getAttribute('sizes')).toBe(
        '(max-width: 640px) 80vw, 280px',
      );
    });
  });

  it('resolves category and status labels through TranslationService', () => {
    const links = relicLinks(fixture);

    api(component).relics.forEach((relic, index) => {
      expect(translateSpy).toHaveBeenCalledWith(`projects.filter.${relic.category}`);
      expect(translateSpy).toHaveBeenCalledWith(`projects.status.${relic.status}`);
      expect(links[index].querySelector('.relic__category')!.textContent).toContain(
        `projects.filter.${relic.category}`,
      );
    });
  });

  it('lights an ember pip only on in-progress relics', () => {
    const liveCount = api(component).relics.filter((relic) => relic.live).length;
    const pips = fixture.nativeElement.querySelectorAll('.relic__pip');
    const liveStatuses = fixture.nativeElement.querySelectorAll('.relic__status--live');

    expect(pips.length).toBe(liveCount);
    expect(liveStatuses.length).toBe(liveCount);
  });

  it('labels the list and the open hint through TranslationService', () => {
    const list = fixture.nativeElement.querySelector('.relics__track');

    expect(list.getAttribute('aria-label')).toBe('home-projects.relics.aria');
    expect(translateSpy).toHaveBeenCalledWith('home-projects.relics.eyebrow');
    expect(translateSpy).toHaveBeenCalledWith('home-projects.relics.hint');
    expect(translateSpy).toHaveBeenCalledWith('home-projects.relics.open');
  });

  describe('toRelicImage', () => {
    const image: ProjectMediaImage = {
      alt: 'Lanterne',
      fallbackSrc: '/project/lantern.webp',
      sources: [
        { src: '/project/1536x960_lantern.webp', maxWidth: 1536, type: 'image/webp' },
        { src: '/project/320x200_lantern.webp', maxWidth: 320, type: 'image/webp' },
        { src: '/project/768x480_lantern.webp', maxWidth: 768, type: 'image/webp' },
        { src: '/project/1024x640_lantern.webp', maxWidth: 1024, type: 'image/webp' },
        { src: '/project/lantern.webp', type: 'image/webp' },
      ],
    };

    it('returns null without an image', () => {
      expect(toRelicImage(undefined)).toBeNull();
    });

    it('keeps only sources up to 768px, as width descriptors', () => {
      const relicImage = toRelicImage(image)!;

      expect(relicImage.sources).toEqual([
        { src: '/project/320x200_lantern.webp', width: 320, type: 'image/webp' },
        { src: '/project/768x480_lantern.webp', width: 768, type: 'image/webp' },
      ]);
      relicImage.sources.forEach((source) => expect(source.maxWidth).toBeUndefined());
    });

    it('preserves alt and fallback without mutating the input', () => {
      const before = structuredClone(image);
      const relicImage = toRelicImage(image)!;

      expect(relicImage.alt).toBe('Lanterne');
      expect(relicImage.fallbackSrc).toBe('/project/lantern.webp');
      expect(image).toEqual(before);
    });
  });

  describe('selectRelics', () => {
    function project(id: string, featured?: boolean): ProjectItem {
      return { ...PROJECTS_DATA[0], id, featured };
    }

    it('fills up to four with non-featured projects when featured ones are scarce', () => {
      const projects = [
        project('a'),
        project('b', true),
        project('c'),
        project('d', true),
        project('e'),
        project('f'),
      ];

      expect(selectRelics(projects).map((p) => p.id)).toEqual(['b', 'd', 'a', 'c']);
    });

    it('caps at four featured projects', () => {
      const projects = ['a', 'b', 'c', 'd', 'e'].map((id) => project(id, true));

      expect(selectRelics(projects).map((p) => p.id)).toEqual(['a', 'b', 'c', 'd']);
    });
  });
});
