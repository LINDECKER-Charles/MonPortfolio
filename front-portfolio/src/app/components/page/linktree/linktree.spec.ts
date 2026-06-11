import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { Linktree } from './linktree';
import { LINKTREE_SECTIONS, LinktreeLink, LinktreeSection } from './linktree.state';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly cb: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(el: Element): void {
    this.observed.push(el);
  }
  unobserve(): void {}
  disconnect(): void {
    this.disconnected = true;
  }
  fire(target: Element): void {
    this.cb(
      [{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

describe('Linktree', () => {
  let originalIO: typeof IntersectionObserver;

  function configure(platform: 'browser' | 'server' = 'browser') {
    return TestBed.configureTestingModule({
      imports: [Linktree],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: platform },
      ],
    }).compileComponents();
  }

  /** Place tous les éléments sous le viewport initial (la garde anti-flash
      du composant ne masque que le contenu non encore peint). */
  function stubRectsBelowViewport(inViewport = false) {
    const top = inViewport ? 0 : window.innerHeight * 2;
    spyOn(Element.prototype, 'getBoundingClientRect').and.returnValue({
      top,
      bottom: top + 120,
      left: 0,
      right: 100,
      width: 100,
      height: 120,
      x: 0,
      y: top,
      toJSON: () => ({}),
    } as DOMRect);
  }

  beforeEach(() => {
    originalIO = window.IntersectionObserver;
    FakeIntersectionObserver.instances = [];
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIntersectionObserver;

    spyOn(gsap, 'registerPlugin');
    spyOn(gsap, 'set');
    spyOn(gsap, 'to');
    spyOn(gsap, 'fromTo');
  });

  afterEach(() => {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = originalIO;
  });

  it('creates and renders the four chapters', async () => {
    await configure();
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    const chapters = (fixture.nativeElement as HTMLElement).querySelectorAll('.linktree-chapter');
    expect(chapters.length).toBe(LINKTREE_SECTIONS.length);
  });

  it('registers an observer per below-fold chapter without touching the hero', async () => {
    await configure('browser');
    stubRectsBelowViewport();
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    expect(gsap.registerPlugin).toHaveBeenCalled();
    expect(gsap.fromTo).not.toHaveBeenCalled(); // entrance du hero en CSS pur
    expect(FakeIntersectionObserver.instances.length).toBe(LINKTREE_SECTIONS.length);
  });

  it('does not re-hide chapters already inside the initial viewport', async () => {
    await configure('browser');
    stubRectsBelowViewport(true);
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    expect(gsap.set).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('leaves chapters untouched when prefers-reduced-motion is set', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    await configure('browser');
    stubRectsBelowViewport();
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    expect(gsap.set).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('reveals a chapter and disconnects its observer when intersecting', async () => {
    await configure('browser');
    stubRectsBelowViewport();
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    const observer = FakeIntersectionObserver.instances[0];
    observer.fire(observer.observed[0]);

    expect(gsap.to).toHaveBeenCalled();
    expect(observer.disconnected).toBeTrue();
  });

  it('does not animate or observe on the server platform', async () => {
    await configure('server');
    const fixture = TestBed.createComponent(Linktree);
    fixture.detectChanges();

    expect(gsap.registerPlugin).not.toHaveBeenCalled();
    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('trackBy helpers return stable identifiers', async () => {
    await configure();
    const fixture = TestBed.createComponent(Linktree);
    const cmp = fixture.componentInstance as unknown as {
      trackLink: (i: number, l: LinktreeLink) => string;
      trackSection: (i: number, s: LinktreeSection) => string;
    };

    const section = LINKTREE_SECTIONS[0];
    const link = section.links[0];
    expect(cmp.trackSection(0, section)).toBe(section.id);
    expect(cmp.trackLink(0, link)).toBe(link.id);
  });
});
