import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { AudioService } from '../../../../../../services/audio-service';
import { HomeResumeSnippets } from './home-resume-snippets';

describe('HomeResumeSnippets', () => {
  let component: HomeResumeSnippets;
  let fixture: ComponentFixture<HomeResumeSnippets>;
  let audio: jasmine.SpyObj<AudioService>;
  let originalMatchMedia: typeof window.matchMedia;

  // GSAP is fully spied so no real DOM animation runs in headless.
  function spyGsap(): void {
    spyOn(gsap, 'set').and.returnValue({} as gsap.core.Tween);
    spyOn(gsap, 'fromTo').and.callFake(((_t: unknown, _from: unknown, to: gsap.TweenVars) => {
      // Fire onComplete synchronously so the post-expand cleanup branch is covered.
      to.onComplete?.call(null);
      return {} as gsap.core.Tween;
    }) as typeof gsap.fromTo);
    spyOn(gsap, 'to').and.returnValue({} as gsap.core.Tween);
    spyOn(gsap, 'killTweensOf');
    spyOn(gsap, 'registerPlugin');
  }

  function setReducedMotion(simple: boolean): void {
    window.matchMedia = ((query: string) =>
      ({
        matches: simple,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as typeof window.matchMedia;
  }

  async function setup(simpleMotion: boolean): Promise<void> {
    spyGsap();
    setReducedMotion(simpleMotion);
    audio = jasmine.createSpyObj<AudioService>('AudioService', ['playOnce']);

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: AudioService, useValue: audio }],
      imports: [HomeResumeSnippets],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeResumeSnippets);
    component = fixture.componentInstance;
    fixture.detectChanges(); // builds the @for refs + runs ngAfterViewInit
  }

  const api = () =>
    component as unknown as {
      toggleSnippet: (id: string) => void;
      openId: () => string | null;
    };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should create and expose the five snippets collapsed', async () => {
    await setup(false);
    expect(component).toBeTruthy();
    expect(component.snippets.length).toBe(5);
    expect(api().openId()).toBeNull();
  });

  it('initializes the accordion collapsed and runs the intro (full motion)', async () => {
    await setup(false);
    // initializeAccordionState + animateIntro both invoke gsap.set/gsap.to
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalled();
  });

  it('uses the simplified intro when reduced motion is requested', async () => {
    await setup(true);
    // animateIntro early-returns after a single gsap.set, never reaching gsap.to
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).not.toHaveBeenCalled();
  });

  it('opens a snippet then closes it on a second toggle (full motion)', async () => {
    await setup(false);
    const id = component.snippets[0].id;

    api().toggleSnippet(id);
    expect(api().openId()).toBe(id);
    expect(gsap.fromTo).toHaveBeenCalled();

    api().toggleSnippet(id);
    expect(api().openId()).toBeNull();
  });

  it('opening one snippet collapses any other open snippet', async () => {
    await setup(false);
    const [first, second] = component.snippets;

    api().toggleSnippet(first.id);
    expect(api().openId()).toBe(first.id);

    api().toggleSnippet(second.id);
    expect(api().openId()).toBe(second.id);
  });

  it('toggles state without animation tweens under reduced motion', async () => {
    await setup(true);
    const id = component.snippets[0].id;

    api().toggleSnippet(id);
    expect(api().openId()).toBe(id);
    // simple-motion path uses gsap.set only, never fromTo/to
    expect(gsap.fromTo).not.toHaveBeenCalled();

    api().toggleSnippet(id);
    expect(api().openId()).toBeNull();
  });

  it('plays the echo sound when a snippet opens', async () => {
    await setup(false);

    api().toggleSnippet(component.snippets[0].id);

    expect(audio.playOnce).toHaveBeenCalledOnceWith('getEcho');
  });

  it('plays the returning echo when the open snippet closes', async () => {
    await setup(false);
    const id = component.snippets[0].id;

    api().toggleSnippet(id);
    audio.playOnce.calls.reset();
    api().toggleSnippet(id);

    expect(audio.playOnce).toHaveBeenCalledOnceWith('getbackEcho');
  });

  it('plays the echo when switching directly from one snippet to another', async () => {
    await setup(true);
    const [first, second] = component.snippets;

    api().toggleSnippet(first.id);
    api().toggleSnippet(second.id);

    expect(audio.playOnce.calls.allArgs()).toEqual([['getEcho'], ['getEcho']]);
  });
});
