import { WritableSignal, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subject } from 'rxjs';
import gsap from 'gsap';

import { PageTransition } from './page-transition';
import { NavigationContextService } from '../../../services/navigation-context.service';

type RouterEventLike = NavigationStart | NavigationEnd | NavigationError | NavigationCancel;

describe('PageTransition', () => {
  let fixture: ComponentFixture<PageTransition>;
  let events: Subject<RouterEventLike>;
  let hasNavigated: WritableSignal<boolean>;
  let toSpy: jasmine.Spy;
  let setSpy: jasmine.Spy;

  beforeEach(async () => {
    events = new Subject();
    // Contexte contrôlé : hasNavigated pilote la garde « rendu initial »
    // (l'intégration avec le vrai service est couverte plus bas).
    hasNavigated = signal(false);
    toSpy = spyOn(gsap, 'to').and.stub();
    setSpy = spyOn(gsap, 'set').and.stub();

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: { events } },
        { provide: NavigationContextService, useValue: { hasNavigated } },
      ],
      imports: [PageTransition],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTransition);
    fixture.detectChanges(); // triggers ngAfterViewInit (static ViewChild)
  });

  afterEach(() => fixture.destroy());

  it('sets the initial hidden state of overlay and rune', () => {
    expect(setSpy).toHaveBeenCalledTimes(2);
  });

  it('skips any animation while on the initial render (aucune navigation client)', () => {
    toSpy.calls.reset();
    events.next(new NavigationStart(1, '/home'));
    events.next(new NavigationEnd(1, '/home', '/home'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('runs the fade-to-black on a client NavigationStart', () => {
    hasNavigated.set(true);
    toSpy.calls.reset();
    events.next(new NavigationStart(2, '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // overlay + rune
  });

  it('runs the fade-in on a client NavigationEnd', () => {
    hasNavigated.set(true);
    toSpy.calls.reset();
    events.next(new NavigationEnd(2, '/projects', '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // rune out + overlay out
  });

  it('excludes opening routes from the transition', () => {
    hasNavigated.set(true);
    toSpy.calls.reset();
    events.next(new NavigationStart(2, '/opening-home'));
    events.next(new NavigationEnd(2, '/opening-resume', '/opening-resume'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('ignores router events unrelated to start/end', () => {
    hasNavigated.set(true);
    toSpy.calls.reset();
    // A non-Start/End event must be filtered out before reaching the handlers.
    events.next({ id: 3 } as unknown as NavigationEnd);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('hides the overlay when a navigation fails (stale chunk after a deploy)', () => {
    hasNavigated.set(true);
    events.next(new NavigationStart(2, '/projects'));
    toSpy.calls.reset();
    events.next(new NavigationError(2, '/projects', new TypeError('Failed to fetch module')));
    expect(toSpy).toHaveBeenCalledTimes(2); // rune out + overlay out
  });

  it('hides the overlay when a navigation is cancelled', () => {
    hasNavigated.set(true);
    events.next(new NavigationStart(2, '/projects'));
    toSpy.calls.reset();
    events.next(new NavigationCancel(2, '/projects', 'guard rejected'));
    expect(toSpy).toHaveBeenCalledTimes(2);
  });

  it('leaves the overlay untouched on an aborted navigation during the initial render', () => {
    toSpy.calls.reset();
    events.next(new NavigationCancel(1, '/', 'redirect'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('arms a failsafe on NavigationStart and disarms it on NavigationEnd', () => {
    const delayedCallSpy = spyOn(gsap, 'delayedCall').and.callThrough();
    hasNavigated.set(true);
    events.next(new NavigationStart(2, '/projects'));
    expect(delayedCallSpy).toHaveBeenCalledTimes(1);
    const tween = delayedCallSpy.calls.mostRecent().returnValue;
    const killSpy = spyOn(tween, 'kill').and.callThrough();
    events.next(new NavigationEnd(2, '/projects', '/projects'));
    expect(killSpy).toHaveBeenCalled();
  });

  it('unsubscribes from router events on destroy', () => {
    expect(events.observed).toBeTrue();
    fixture.destroy();
    expect(events.observed).toBeFalse();
  });
});

describe('PageTransition + NavigationContextService (intégration)', () => {
  let fixture: ComponentFixture<PageTransition>;
  let events: Subject<RouterEventLike>;
  let toSpy: jasmine.Spy;

  beforeEach(async () => {
    events = new Subject();
    toSpy = spyOn(gsap, 'to').and.stub();
    spyOn(gsap, 'set').and.stub();

    // Vrai NavigationContextService : il s'abonne au même flux d'events que le
    // composant et compte les NavigationStart (la navigation initiale est ignorée).
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: Router, useValue: { events } }],
      imports: [PageTransition],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTransition);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it("ne joue rien sur la navigation initiale puis anime et rabat l'overlay ensuite", () => {
    events.next(new NavigationStart(1, '/'));
    events.next(new NavigationEnd(1, '/', '/'));
    expect(toSpy).not.toHaveBeenCalled();

    events.next(new NavigationStart(2, '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // fade-to-black : overlay + rune

    toSpy.calls.reset();
    events.next(new NavigationEnd(2, '/projects', '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // fade-in : rune + overlay
  });
});
