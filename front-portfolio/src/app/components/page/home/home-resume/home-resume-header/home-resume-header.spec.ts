import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeHeader } from './home-resume-header';

describe('HomeResumeHeader', () => {
  let component: HomeResumeHeader;
  let fixture: ComponentFixture<HomeResumeHeader>;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(async () => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: false, media: q }) as MediaQueryList) as any;

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [HomeResumeHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeResumeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    window.matchMedia = originalMatchMedia;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the cinematic altar inside the hero', () => {
    expect(fixture.nativeElement.querySelector('app-home-lantern')).not.toBeNull();
  });

  it('keeps four CTA and delegates the opening replay to the altar', () => {
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelectorAll('.hero__cta').length).toBe(4);

    const openingLinks = Array.from(host.querySelectorAll<HTMLAnchorElement>('a')).filter((a) =>
      (a.getAttribute('href') ?? '').startsWith('/opening-home'),
    );
    expect(openingLinks.length).toBe(1);
    expect(openingLinks[0].closest('app-home-lantern')).not.toBeNull();
  });

  it('orders the CTA: resume, CV download, linktree, tech watch', () => {
    const host: HTMLElement = fixture.nativeElement;
    const hrefs = Array.from(host.querySelectorAll<HTMLAnchorElement>('.hero__cta')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      '/resume',
      '/CV-FR-FR-DESIGN.pdf',
      '/linktree',
      'https://veille.charles-lindecker.com',
    ]);
  });

  it('mounts the lantern light layer on the hero surface', () => {
    const hero: HTMLElement = fixture.nativeElement.querySelector('.hero');
    expect(hero.querySelector(':scope > .lantern-light')).not.toBeNull();
  });
});
