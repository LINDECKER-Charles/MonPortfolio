import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterLink, provideRouter } from '@angular/router';
import gsap from 'gsap';

import { HomeLantern } from './home-lantern';
import { OPENING_SEEN_KEY } from '../../../../misc/opening-resume/opening/opening.state';
import { AudioService } from '../../../../../services/audio-service';

describe('HomeLantern', () => {
  let component: HomeLantern;
  let fixture: ComponentFixture<HomeLantern>;
  let audio: jasmine.SpyObj<AudioService>;
  let navigate: jasmine.Spy;
  let navigateByUrl: jasmine.Spy;
  let originalMatchMedia: typeof window.matchMedia;

  /** Faux timeline chaînable : on capture les vars pour piloter `onComplete`. */
  let timelineVars: gsap.TimelineVars | undefined;
  let timeline: {
    to: jasmine.Spy;
    kill: jasmine.Spy;
    eventCallback: jasmine.Spy;
    reverse: jasmine.Spy;
  };
  let reverseCallback: (() => void) | undefined;
  let delayedCall: jasmine.Spy;
  let failsafe: { kill: jasmine.Spy };

  function mockMatchMedia(matches: boolean): void {
    window.matchMedia = ((q: string) => ({ matches, media: q }) as MediaQueryList) as any;
  }

  function mockGsap(): void {
    timelineVars = undefined;
    reverseCallback = undefined;
    timeline = {
      to: jasmine.createSpy('to').and.callFake(() => timeline),
      kill: jasmine.createSpy('kill'),
      eventCallback: jasmine
        .createSpy('eventCallback')
        .and.callFake((_type: string, callback: () => void) => {
          reverseCallback = callback;
          return timeline;
        }),
      // `reverse()` rembobine instantanément : on invoque le onReverseComplete posé juste avant.
      reverse: jasmine.createSpy('reverse').and.callFake(() => {
        reverseCallback?.();
        return timeline;
      }),
    };
    failsafe = { kill: jasmine.createSpy('kill') };
    spyOn(gsap, 'timeline').and.callFake((vars?: gsap.TimelineVars) => {
      timelineVars = vars;
      return timeline as any;
    });
    delayedCall = spyOn(gsap, 'delayedCall').and.returnValue(failsafe as any);
  }

  async function setup(): Promise<void> {
    audio = jasmine.createSpyObj<AudioService>('AudioService', ['playOnce']);

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AudioService, useValue: audio },
      ],
      imports: [HomeLantern],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigate = spyOn(router, 'navigate').and.resolveTo(true);
    navigateByUrl = spyOn(router, 'navigateByUrl').and.resolveTo(true);

    fixture = TestBed.createComponent(HomeLantern);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable(); // afterNextRender : lecture de localStorage
    fixture.detectChanges();
  }

  function aside(): HTMLElement {
    return fixture.nativeElement.querySelector('.lantern');
  }

  function trigger(): HTMLAnchorElement {
    return fixture.nativeElement.querySelector('.lantern__trigger');
  }

  /**
   * Vrai clic DOM sur le lien. `preventedByComponent` capture `defaultPrevented`
   * après le handler du composant ; l'hôte annule ensuite l'action native quoi
   * qu'il arrive (sinon le runner Karma suivrait le `href`).
   */
  function click(init: MouseEventInit = {}): { event: MouseEvent; preventedByComponent: boolean } {
    const host: HTMLElement = fixture.nativeElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init });
    let preventedByComponent = false;
    const guard = (e: Event): void => {
      preventedByComponent = e.defaultPrevented;
      e.preventDefault();
    };
    host.addEventListener('click', guard);
    try {
      trigger().dispatchEvent(event);
    } finally {
      host.removeEventListener('click', guard);
    }
    return { event, preventedByComponent };
  }

  /** Laisse se résoudre la promesse de navigation et ses `then`. */
  async function flushNavigation(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
  }

  function eyebrow(): string {
    return fixture.nativeElement.querySelector('.lantern__eyebrow').textContent.trim();
  }

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    localStorage.removeItem(OPENING_SEEN_KEY);
    mockMatchMedia(false);
    mockGsap();
  });

  afterEach(() => {
    fixture?.destroy();
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem(OPENING_SEEN_KEY);
  });

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('renders the replay link (works without JS) without routerLink', async () => {
    await setup();
    const link = trigger();
    expect(link.getAttribute('href')).toContain('/opening-home');
    expect(link.getAttribute('href')).toContain('replay=1');
    // Pas de RouterLink : il naviguerait avant l'ignition (navigation programmatique seulement).
    expect(fixture.debugElement.query(By.directive(RouterLink))).toBeNull();
  });

  it('composes the plaque from the shared surface primitives', async () => {
    await setup();
    const plaque = aside();
    expect(plaque.classList.contains('surface-crypt')).toBeTrue();
    expect(plaque.classList.contains('surface-vignetted--deep')).toBeTrue();
    expect(plaque.classList.contains('emerge-ritual')).toBeTrue();
    expect(fixture.nativeElement.querySelector('.lantern__play.lantern__gilt')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.lantern__cta.lantern__gilt')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.lantern__cta-label.cta-tome__label'),
    ).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.lantern__cta-top.cta-tome__top')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('.lantern__cta-bottom.cta-tome__bottom'),
    ).not.toBeNull();
  });

  it('wraps the rune in phrasing content (span, not figure) inside the link', async () => {
    await setup();
    const rune: HTMLElement = fixture.nativeElement.querySelector('.lantern__rune');
    expect(rune.tagName).toBe('SPAN');
    expect(fixture.nativeElement.querySelector('figure')).toBeNull();
  });

  it('renders the rune with width descriptors driven by sizes (not the viewport)', async () => {
    await setup();
    const source: HTMLSourceElement = fixture.nativeElement.querySelector('.lantern__rune source');
    const img: HTMLImageElement = fixture.nativeElement.querySelector('.lantern__rune img');
    expect(fixture.nativeElement.querySelectorAll('.lantern__rune source').length).toBe(1);
    expect(source.getAttribute('srcset')).toContain('160x160_opening_base.webp 160w');
    expect(source.getAttribute('srcset')).toContain('640x640_opening_base.webp 640w');
    expect(source.hasAttribute('media')).toBeFalse();
    expect(source.getAttribute('sizes')).toBe('(max-width: 640px) 110px, 150px');
    expect(img.getAttribute('src')).toContain('320x320_opening_base.webp');
    expect(img.getAttribute('loading')).toBe('eager');
  });

  it('carries the focus ring on the host (not clipped by overflow: hidden)', async () => {
    await setup();
    const link = trigger();
    link.focus();
    expect(document.activeElement).toBe(link);
    expect(aside().matches(':has(> .lantern__trigger:focus-visible)')).toBeTrue();
    expect(getComputedStyle(aside()).outlineStyle).toBe('solid');
    expect(getComputedStyle(link).outlineStyle).toBe('none');
  });

  it('shows the "never seen" eyebrow with its ember spark when opening.seen is absent', async () => {
    await setup();
    expect(component['seen']()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.lantern__spark')).not.toBeNull();
    expect(eyebrow()).toBe(component['ts'].translate('home-resume.lantern.eyebrow_unseen'));
  });

  it('reflects opening.seen from localStorage after first render', async () => {
    localStorage.setItem(OPENING_SEEN_KEY, '1');
    await setup();
    expect(component['seen']()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.lantern__spark')).toBeNull();
    expect(eyebrow()).toBe(component['ts'].translate('home-resume.lantern.eyebrow'));
  });

  it('moves the veil to <body> after render and removes it on destroy', async () => {
    await setup();
    const veil = document.body.querySelector(':scope > .lantern__veil');
    expect(veil).not.toBeNull();
    expect(fixture.nativeElement.contains(veil)).toBeFalse();

    fixture.destroy();
    expect(document.body.querySelector(':scope > .lantern__veil')).toBeNull();
  });

  describe('modified click (new tab / window)', () => {
    beforeEach(async () => {
      await setup();
    });

    for (const init of [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ] as MouseEventInit[]) {
      it(`leaves ${JSON.stringify(init)} to the browser: no preventDefault, no navigation`, () => {
        const { preventedByComponent } = click(init);
        expect(preventedByComponent).toBeFalse();
        expect(audio.playOnce).not.toHaveBeenCalled();
        expect(gsap.timeline).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
        expect(navigateByUrl).not.toHaveBeenCalled();
        expect(component['igniting']()).toBeFalse();
      });
    }
  });

  describe('ignite with reduced motion', () => {
    beforeEach(async () => {
      mockMatchMedia(true);
      await setup();
    });

    it('navigates immediately with ?replay=1: preventDefault, no sound, no timeline', () => {
      const { preventedByComponent } = click();
      expect(preventedByComponent).toBeTrue();
      expect(navigate).toHaveBeenCalledOnceWith(['/opening-home'], {
        queryParams: { replay: 1 },
      });
      expect(navigateByUrl).not.toHaveBeenCalled();
      expect(audio.playOnce).not.toHaveBeenCalled();
      expect(gsap.timeline).not.toHaveBeenCalled();
      expect(delayedCall).not.toHaveBeenCalled();
      expect(component['igniting']()).toBeFalse();
    });
  });

  describe('ignite with animations', () => {
    beforeEach(async () => {
      await setup();
    });

    it('prevents the native navigation, rings the bell and arms the timeline + failsafe', () => {
      const { preventedByComponent } = click();
      expect(preventedByComponent).toBeTrue();
      expect(component['igniting']()).toBeTrue();
      expect(audio.playOnce).toHaveBeenCalledOnceWith('smallBell');
      expect(gsap.timeline).toHaveBeenCalledTimes(1);
      expect(timeline.to).toHaveBeenCalledTimes(3);
      expect(delayedCall).toHaveBeenCalledTimes(1);
      expect(navigate).not.toHaveBeenCalled();
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('navigates exactly once with ?replay=1 when the timeline completes', () => {
      click();
      expect(navigate).not.toHaveBeenCalled();

      timelineVars?.onComplete?.();
      expect(navigate).toHaveBeenCalledOnceWith(['/opening-home'], {
        queryParams: { replay: 1 },
      });
      expect(navigateByUrl).not.toHaveBeenCalled();

      // Le garde-fou ne doit pas re-déclencher la navigation.
      const failsafeCallback = delayedCall.calls.mostRecent().args[1] as () => void;
      failsafeCallback();
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('navigates through the failsafe if the timeline never completes', () => {
      click();
      const failsafeCallback = delayedCall.calls.mostRecent().args[1] as () => void;
      failsafeCallback();
      expect(navigate).toHaveBeenCalledTimes(1);

      timelineVars?.onComplete?.();
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('ignores a second click while igniting (prevented, no new timeline)', () => {
      click();
      const second = click();
      expect(second.preventedByComponent).toBeTrue();
      expect(gsap.timeline).toHaveBeenCalledTimes(1);
      expect(audio.playOnce).toHaveBeenCalledTimes(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('keeps the veil up when the navigation succeeds', async () => {
      click();
      timelineVars?.onComplete?.();
      await flushNavigation();
      expect(timeline.reverse).not.toHaveBeenCalled();
      expect(component['igniting']()).toBeTrue();
    });

    it('rewinds the ignition and re-arms the CTA when navigate resolves to false', async () => {
      navigate.and.resolveTo(false);
      click();
      timelineVars?.onComplete?.();
      await flushNavigation();

      expect(failsafe.kill).toHaveBeenCalled();
      expect(timeline.eventCallback).toHaveBeenCalledWith(
        'onReverseComplete',
        jasmine.any(Function),
      );
      expect(timeline.reverse).toHaveBeenCalledTimes(1);
      expect(component['igniting']()).toBeFalse();

      // Le CTA est réarmé : un nouveau clic relance une ignition complète.
      click();
      expect(component['igniting']()).toBeTrue();
      expect(gsap.timeline).toHaveBeenCalledTimes(2);
    });

    it('rewinds the ignition when navigate rejects', async () => {
      navigate.and.rejectWith(new Error('guard failure'));
      click();
      const failsafeCallback = delayedCall.calls.mostRecent().args[1] as () => void;
      failsafeCallback();
      await flushNavigation();

      expect(timeline.reverse).toHaveBeenCalledTimes(1);
      expect(component['igniting']()).toBeFalse();
    });

    it('kills the timeline and the failsafe on destroy', () => {
      click();
      fixture.destroy();
      expect(timeline.kill).toHaveBeenCalled();
      expect(failsafe.kill).toHaveBeenCalled();
    });
  });
});
