import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { OpeningAnimationRefs, OpeningAnimationService } from './opening-animation.service';

/** Timeline factice : enregistre les `.add(cb)` et exécute les callbacks à la demande. */
function makeTimelineMock() {
  const added: Array<() => void> = [];
  const tl: any = {
    added,
    fromTo: jasmine.createSpy('fromTo').and.callFake(() => tl),
    to: jasmine.createSpy('to').and.callFake(() => tl),
    add: jasmine.createSpy('add').and.callFake((cb: () => void): any => {
      if (typeof cb === 'function') added.push(cb);
      return tl;
    }),
  };
  return tl;
}

function makeRefs(): OpeningAnimationRefs {
  const el = () => document.createElement('div');
  return {
    audioState: el() as HTMLDivElement,
    openingState: el() as HTMLDivElement,
    soundButton: document.createElement('button'),
    soundIcon: document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement,
    soundLabel: document.createElement('p'),
    openingButton: document.createElement('button'),
    openingFigure: el() as HTMLElement,
  };
}

describe('OpeningAnimationService', () => {
  let service: OpeningAnimationService;
  let refs: OpeningAnimationRefs;
  let setSpy: jasmine.Spy;
  let toSpy: jasmine.Spy;
  let timelineSpy: jasmine.Spy;
  let tl: ReturnType<typeof makeTimelineMock>;
  let matchMediaSpy: jasmine.Spy;
  let originalMatchMedia: typeof window.matchMedia;

  function setReducedMotion(value: boolean) {
    matchMediaSpy.and.returnValue({ matches: value } as MediaQueryList);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(OpeningAnimationService);
    refs = makeRefs();

    setSpy = spyOn(gsap, 'set');
    toSpy = spyOn(gsap, 'to').and.returnValue({ kill: jasmine.createSpy('kill') } as any);
    spyOn(gsap, 'killTweensOf');
    tl = makeTimelineMock();
    timelineSpy = spyOn(gsap, 'timeline').and.returnValue(tl as any);

    originalMatchMedia = window.matchMedia;
    matchMediaSpy = jasmine.createSpy('matchMedia');
    setReducedMotion(false);
    window.matchMedia = matchMediaSpy as any;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('prepareInitialState lays out every layer via gsap.set', () => {
    service.prepareInitialState(refs);
    expect(setSpy).toHaveBeenCalledTimes(6);
  });

  describe('enterSoundState', () => {
    it('builds an animated timeline and starts the idle floats on add()', () => {
      service.enterSoundState(refs);
      expect(timelineSpy).toHaveBeenCalled();
      expect(tl.fromTo).toHaveBeenCalled();
      // exécute le callback `.add` -> startSoundIdle -> 2 tweens idle
      tl.added.forEach((cb: () => void) => cb());
      expect(toSpy).toHaveBeenCalledTimes(2);
    });

    it('reduced motion sets final state without a timeline', () => {
      setReducedMotion(true);
      service.enterSoundState(refs);
      expect(timelineSpy).not.toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalled();
    });
  });

  describe('launchBgMusicTransition', () => {
    it('reduced motion hides instantly and calls onComplete synchronously', () => {
      setReducedMotion(true);
      const done = jasmine.createSpy('done');
      service.launchBgMusicTransition(refs, done);
      expect(done).toHaveBeenCalled();
      expect(timelineSpy).not.toHaveBeenCalled();
    });

    it('animated path wires onComplete into the timeline', () => {
      const done = jasmine.createSpy('done');
      service.launchBgMusicTransition(refs, done);
      expect(timelineSpy).toHaveBeenCalledWith({ onComplete: done });
      expect(tl.to).toHaveBeenCalled();
    });
  });

  describe('enterOpeningState', () => {
    it('reduced motion posts final state, no timeline', () => {
      setReducedMotion(true);
      service.enterOpeningState(refs);
      expect(timelineSpy).not.toHaveBeenCalled();
    });

    it('animated path builds timeline and starts opening idle on add()', () => {
      service.enterOpeningState(refs);
      expect(tl.fromTo).toHaveBeenCalled();
      tl.added.forEach((cb: () => void) => cb());
      expect(toSpy).toHaveBeenCalled();
    });
  });

  describe('playVoiceTransition', () => {
    it('reduced motion hides opening and calls onComplete', () => {
      setReducedMotion(true);
      const done = jasmine.createSpy('done');
      service.playVoiceTransition(refs, done);
      expect(done).toHaveBeenCalled();
      expect(timelineSpy).not.toHaveBeenCalled();
    });

    it('animated path builds a timeline whose onComplete hides state then fires callback', () => {
      const done = jasmine.createSpy('done');
      service.playVoiceTransition(refs, done);
      const opts = timelineSpy.calls.mostRecent().args[0] as { onComplete: () => void };
      opts.onComplete();
      expect(done).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalled();
    });
  });

  describe('hover/press micro-interactions', () => {
    it('sound hover enter tweens button + icon', () => {
      service.onSoundHoverEnter(refs);
      expect(toSpy).toHaveBeenCalledTimes(2);
    });

    it('sound hover leave tweens button + icon', () => {
      service.onSoundHoverLeave(refs);
      expect(toSpy).toHaveBeenCalledTimes(2);
    });

    it('sound press uses fromTo with yoyo', () => {
      const fromToSpy = spyOn(gsap, 'fromTo');
      service.onSoundPress(refs);
      expect(fromToSpy).toHaveBeenCalled();
    });

    it('opening hover enter/leave tween the opening button', () => {
      service.onOpeningHoverEnter(refs);
      service.onOpeningHoverLeave(refs);
      expect(toSpy).toHaveBeenCalledTimes(2);
    });

    it('opening press uses fromTo', () => {
      const fromToSpy = spyOn(gsap, 'fromTo');
      service.onOpeningPress(refs);
      expect(fromToSpy).toHaveBeenCalled();
    });
  });

  it('stopAllTweens kills idle tweens then mass-kills element tweens', () => {
    const killSpy = jasmine.createSpy('kill');
    toSpy.and.returnValue({ kill: killSpy } as any);
    // crée des idle tweens à tuer
    service.enterSoundState(refs);
    tl.added.forEach((cb: () => void) => cb());
    killSpy.calls.reset();

    service.stopAllTweens(refs);
    expect(killSpy).toHaveBeenCalled();
    expect(gsap.killTweensOf).toHaveBeenCalled();
  });

  describe('reducedMotion getter SSR guard', () => {
    it('returns false when matchMedia is unavailable', () => {
      window.matchMedia = undefined as any;
      // launchBgMusicTransition emprunte le chemin animé puisque reducedMotion === false
      const done = jasmine.createSpy('done');
      service.launchBgMusicTransition(refs, done);
      expect(timelineSpy).toHaveBeenCalled();
    });
  });
});
