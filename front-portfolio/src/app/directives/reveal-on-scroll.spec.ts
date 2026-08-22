import {
  Component,
  PLATFORM_ID,
  provideZonelessChangeDetection,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import gsap from 'gsap';

import { RevealOnScrollDirective } from './reveal-on-scroll';
import { NavigationContextService } from '../services/navigation-context.service';

/** Fake IntersectionObserver capturant le callback pour le piloter à la main. */
class FakeIntersectionObserver {
  static last: FakeIntersectionObserver | null = null;

  readonly observed: Element[] = [];
  readonly unobserved: Element[] = [];
  disconnectCount = 0;
  readonly options?: IntersectionObserverInit;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.options = options;
    FakeIntersectionObserver.last = this;
  }

  observe(el: Element): void {
    this.observed.push(el);
  }

  unobserve(el: Element): void {
    this.unobserved.push(el);
  }

  disconnect(): void {
    this.disconnectCount++;
  }

  /** Simule un changement de visibilité sur la cible. */
  fire(isIntersecting: boolean, target: Element): void {
    this.callback(
      [{ isIntersecting, target } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

@Component({
  imports: [RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div
      [style.position]="'fixed'"
      [style.top]="top"
      appRevealOnScroll
      [revealDelay]="delay"
      [revealDuration]="duration"
      [revealY]="y"
      [revealBlur]="blur"
      [revealOnce]="once"
      [revealStart]="start"
      [revealScale]="scale"
      [revealGlow]="glow"
    >
      content
    </div>
  `,
})
class HostComponent {
  /* Hors viewport par défaut : la directive ne re-masque jamais un élément
     déjà visible au premier paint, il faut donc le placer sous la ligne. */
  top = '200vh';
  delay = 0;
  duration = 0.7;
  y = 24;
  blur = 8;
  once = true;
  start = '0px 0px 25% 0px';
  scale = false;
  glow = false;
}

describe('RevealOnScrollDirective', () => {
  let originalIO: typeof IntersectionObserver;

  function configure(platform: 'browser' | 'server' = 'browser') {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: platform }],
    });
  }

  beforeEach(() => {
    originalIO = window.IntersectionObserver;
    FakeIntersectionObserver.last = null;
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIntersectionObserver;

    spyOn(gsap, 'set');
    spyOn(gsap, 'to');
    spyOn(gsap, 'registerPlugin');
    spyOn(gsap, 'timeline').and.returnValue({
      to() {
        return this;
      },
    } as unknown as gsap.core.Timeline);
  });

  afterEach(() => {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = originalIO;
  });

  it('creates the directive instance', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const dir = fixture.debugElement
      .query(By.directive(RevealOnScrollDirective))
      .injector.get(RevealOnScrollDirective);
    expect(dir).toBeTruthy();
  });

  it('sets initial hidden props and registers an observer in the browser', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(gsap.registerPlugin).toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalledTimes(1);
    const [, initialProps] = (gsap.set as jasmine.Spy).calls.mostRecent().args;
    expect(initialProps.autoAlpha).toBe(0);
    expect(initialProps.y).toBe(24);
    expect(initialProps.filter).toBe('blur(8px)');
    expect(initialProps.scale).toBeUndefined();

    expect(FakeIntersectionObserver.last).toBeTruthy();
    expect(FakeIntersectionObserver.last!.observed.length).toBe(1);
    expect(FakeIntersectionObserver.last!.options?.rootMargin).toBe('0px 0px 25% 0px');
  });

  it('includes scale in the initial props when revealScale is true', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.scale = true;
    fixture.componentInstance.y = 40;
    fixture.componentInstance.blur = 12;
    fixture.detectChanges();

    const [, initialProps] = (gsap.set as jasmine.Spy).calls.mostRecent().args;
    expect(initialProps.scale).toBe(0.94);
    expect(initialProps.y).toBe(40);
    expect(initialProps.filter).toBe('blur(12px)');
  });

  it('animates to visible and unobserves when intersecting with revealOnce=true', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.delay = 0.3;
    fixture.componentInstance.duration = 1.2;
    fixture.detectChanges();

    const io = FakeIntersectionObserver.last!;
    const target = io.observed[0];
    io.fire(true, target);

    expect(gsap.to).toHaveBeenCalledTimes(1);
    const [, toProps] = (gsap.to as jasmine.Spy).calls.mostRecent().args;
    expect(toProps.autoAlpha).toBe(1);
    expect(toProps.y).toBe(0);
    expect(toProps.delay).toBe(0.3);
    expect(toProps.duration).toBe(1.2);
    expect(toProps.scale).toBeUndefined();
    expect(io.unobserved).toContain(target);
  });

  it('keeps observing when revealOnce=false', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.once = false;
    fixture.detectChanges();

    const io = FakeIntersectionObserver.last!;
    io.fire(true, io.observed[0]);

    expect(gsap.to).toHaveBeenCalledTimes(1);
    expect(io.unobserved.length).toBe(0);
  });

  it('does nothing when the entry is not intersecting', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const io = FakeIntersectionObserver.last!;
    io.fire(false, io.observed[0]);

    expect(gsap.to).not.toHaveBeenCalled();
    expect(io.unobserved.length).toBe(0);
  });

  it('adds scale:1 to the to-props when revealScale is true', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.scale = true;
    fixture.detectChanges();

    FakeIntersectionObserver.last!.fire(true, FakeIntersectionObserver.last!.observed[0]);

    const [, toProps] = (gsap.to as jasmine.Spy).calls.mostRecent().args;
    expect(toProps.scale).toBe(1);
  });

  it('plays the ember flash timeline when revealGlow is true and motion is allowed', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.glow = true;
    fixture.detectChanges();

    FakeIntersectionObserver.last!.fire(true, FakeIntersectionObserver.last!.observed[0]);

    expect(gsap.timeline).toHaveBeenCalled();
  });

  it('leaves the element untouched when prefers-reduced-motion is set', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.glow = true;
    fixture.detectChanges();

    expect(gsap.set).not.toHaveBeenCalled();
    expect(gsap.timeline).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.last).toBeNull();
  });

  it('does not re-hide an element already inside the initial viewport', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.top = '0px';
    fixture.detectChanges();

    expect(gsap.set).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.last).toBeNull();
  });

  it('re-hides a visible element after a client navigation (entrance légitime)', () => {
    configure();
    TestBed.inject(NavigationContextService).hasNavigated.set(true);
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.top = '0px';
    fixture.detectChanges();

    expect(gsap.set).toHaveBeenCalledTimes(1);
    expect(FakeIntersectionObserver.last).not.toBeNull();
  });

  it('does not create an observer on the server platform', () => {
    configure('server');
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(gsap.set).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.last).toBeNull();
  });

  it('disconnects the observer on destroy', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const io = FakeIntersectionObserver.last!;

    fixture.destroy();

    expect(io.disconnectCount).toBe(1);
  });
});
