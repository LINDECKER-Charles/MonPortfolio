import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Opening } from './opening';
import { OpeningAnimationService } from './opening-animation.service';
import { AudioService } from '../../../../services/audio-service';

describe('Opening', () => {
  let component: Opening;
  let fixture: ComponentFixture<Opening>;
  let audio: jasmine.SpyObj<AudioService>;
  let anim: jasmine.SpyObj<OpeningAnimationService>;
  let originalMatchMedia: typeof window.matchMedia;

  /** Stub minimal d'ActivatedRoute : seuls les query params sont lus par Opening. */
  function routeWithQuery(params: Record<string, string>): Partial<ActivatedRoute> {
    return { snapshot: { queryParamMap: convertToParamMap(params) } } as Partial<ActivatedRoute>;
  }

  /** Configure le TestBed après avoir préparé l'environnement (localStorage/URL/matchMedia). */
  async function setup(queryParams?: Record<string, string>): Promise<void> {
    audio = jasmine.createSpyObj<AudioService>('AudioService', ['play']);
    anim = jasmine.createSpyObj<OpeningAnimationService>('OpeningAnimationService', [
      'prepareInitialState',
      'enterSoundState',
      'launchBgMusicTransition',
      'enterOpeningState',
      'playVoiceTransition',
      'stopAllTweens',
      'onSoundHoverEnter',
      'onSoundHoverLeave',
      'onSoundPress',
      'onOpeningHoverEnter',
      'onOpeningHoverLeave',
      'onOpeningPress',
    ]);
    // Les transitions appellent leur callback immédiatement pour piloter la machine d'états.
    anim.launchBgMusicTransition.and.callFake((_r: unknown, cb: () => void) => cb());
    anim.playVoiceTransition.and.callFake((_r: unknown, cb: () => void) => cb());

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AudioService, useValue: audio },
        { provide: OpeningAnimationService, useValue: anim },
        ...(queryParams
          ? [{ provide: ActivatedRoute, useValue: routeWithQuery(queryParams) }]
          : []),
      ],
      imports: [Opening],
    }).compileComponents();

    fixture = TestBed.createComponent(Opening);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    localStorage.removeItem('opening.seen');
    window.matchMedia = ((q: string) => ({ matches: false, media: q }) as MediaQueryList) as any;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem('opening.seen');
  });

  describe('first visit (no bypass)', () => {
    beforeEach(async () => {
      await setup();
      fixture.detectChanges(); // ngAfterViewInit
    });

    it('prepares and enters the sound gate', () => {
      expect(component.state).toBe('sound-gate');
      expect(anim.prepareInitialState).toHaveBeenCalled();
      expect(anim.enterSoundState).toHaveBeenCalled();
      expect(component.isSoundGateVisible).toBeTrue();
      expect(component.isOpeningVisible).toBeFalse();
    });

    it('launchBgMusic plays sounds and moves to intro-ready', () => {
      component.launchBgMusic();
      expect(audio.play).toHaveBeenCalledWith('getItem');
      expect(audio.play).toHaveBeenCalledWith('bgMusic');
      expect(component.state).toBe('intro-ready');
      expect(anim.enterOpeningState).toHaveBeenCalled();
      expect(component.isOpeningVisible).toBeTrue();
    });

    it('launchBgMusic is a no-op once past the sound gate', () => {
      component.launchBgMusic();
      audio.play.calls.reset();
      component.launchBgMusic();
      expect(audio.play).not.toHaveBeenCalled();
    });

    it('playVoice requires intro-ready; ignored from sound-gate', () => {
      component.playVoice();
      expect(audio.play).not.toHaveBeenCalled();
      expect(component.state).toBe('sound-gate');
    });

    it('full happy path: sound -> intro -> voice -> finished emits', () => {
      const finished = spyOn(component.finished, 'emit');
      component.launchBgMusic();
      component.playVoice();
      expect(audio.play).toHaveBeenCalledWith('pouperVoice');
      expect(component.state).toBe('finished');
      expect(finished).toHaveBeenCalled();
      expect(localStorage.getItem('opening.seen')).toBe('1');
    });

    it('skipOpening stops tweens, finishes and emits', () => {
      const finished = spyOn(component.finished, 'emit');
      component.skipOpening();
      expect(anim.stopAllTweens).toHaveBeenCalled();
      expect(component.state).toBe('finished');
      expect(finished).toHaveBeenCalled();
    });

    it('hover/press guards delegate only in the matching state', () => {
      component.onSoundHoverEnter();
      component.onSoundHoverLeave();
      component.onSoundPress();
      expect(anim.onSoundHoverEnter).toHaveBeenCalled();
      // opening interactions require intro-ready
      component.onOpeningHoverEnter();
      expect(anim.onOpeningHoverEnter).not.toHaveBeenCalled();

      component.launchBgMusic(); // -> intro-ready
      component.onOpeningHoverEnter();
      component.onOpeningHoverLeave();
      component.onOpeningPress();
      expect(anim.onOpeningHoverEnter).toHaveBeenCalled();
      expect(anim.onOpeningPress).toHaveBeenCalled();

      // sound interactions no longer fire outside sound-gate
      anim.onSoundHoverEnter.calls.reset();
      component.onSoundHoverEnter();
      expect(anim.onSoundHoverEnter).not.toHaveBeenCalled();
    });

    it('ngOnDestroy stops all tweens', () => {
      anim.stopAllTweens.calls.reset();
      fixture.destroy();
      expect(anim.stopAllTweens).toHaveBeenCalled();
    });
  });

  describe('bypass paths', () => {
    // On rend d'abord la vue sans bypass (ViewChildren peuplés, lifecycle propre), puis on
    // ré-invoque ngAfterViewInit directement avec la condition de bypass : muter `state` +
    // émettre via detectChanges synchrone déclencherait sinon un
    // ExpressionChangedAfterItHasBeenChecked (artefact de test ; CD zoneless async en prod).
    beforeEach(async () => {
      await setup();
      fixture.detectChanges(); // peuple les @ViewChild
      anim.prepareInitialState.calls.reset();
      anim.enterSoundState.calls.reset();
      component.state = 'sound-gate';
    });

    it('bypasses immediately when opening.seen is set', () => {
      localStorage.setItem('opening.seen', '1');
      const finished = spyOn(component.finished, 'emit');
      component.ngAfterViewInit();
      expect(component.state).toBe('finished');
      expect(finished).toHaveBeenCalled();
      expect(anim.prepareInitialState).not.toHaveBeenCalled();
    });

    it('bypasses when prefers-reduced-motion matches', () => {
      window.matchMedia = ((q: string) => ({ matches: true, media: q }) as MediaQueryList) as any;
      const finished = spyOn(component.finished, 'emit');
      component.ngAfterViewInit();
      expect(component.state).toBe('finished');
      expect(finished).toHaveBeenCalled();
    });
  });

  describe('query params (ActivatedRoute)', () => {
    it('bypasses when ?skip-opening is present', async () => {
      await setup({ 'skip-opening': '' });
      // Le bypass n'utilise aucun @ViewChild : on invoque le hook sans detectChanges
      // (muter `state` pendant la première CD lèverait ExpressionChanged en test).
      const finished = spyOn(component.finished, 'emit');
      component.ngAfterViewInit();
      expect(component.state).toBe('finished');
      expect(finished).toHaveBeenCalled();
    });

    it('?replay wins over opening.seen and reduced-motion (explicit replay from home)', async () => {
      localStorage.setItem('opening.seen', '1');
      window.matchMedia = ((q: string) => ({ matches: true, media: q }) as MediaQueryList) as any;
      await setup({ replay: '1' });
      const finished = spyOn(component.finished, 'emit');
      fixture.detectChanges(); // ngAfterViewInit
      expect(component.state).toBe('sound-gate');
      expect(finished).not.toHaveBeenCalled();
      expect(anim.prepareInitialState).toHaveBeenCalled();
      expect(anim.enterSoundState).toHaveBeenCalled();
    });
  });
});
