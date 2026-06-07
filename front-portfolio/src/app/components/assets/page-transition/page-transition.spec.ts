import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import gsap from 'gsap';

import { PageTransition } from './page-transition';

describe('PageTransition', () => {
  let fixture: ComponentFixture<PageTransition>;
  let events: Subject<NavigationStart | NavigationEnd>;
  let toSpy: jasmine.Spy;
  let setSpy: jasmine.Spy;

  beforeEach(async () => {
    events = new Subject();
    toSpy = spyOn(gsap, 'to').and.stub();
    setSpy = spyOn(gsap, 'set').and.stub();

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: { events } },
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

  it('skips the animation on the very first NavigationEnd', () => {
    toSpy.calls.reset();
    events.next(new NavigationEnd(1, '/home', '/home'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('skips NavigationStart while still on the first navigation', () => {
    toSpy.calls.reset();
    events.next(new NavigationStart(1, '/home'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('runs the fade-to-black on a subsequent NavigationStart', () => {
    events.next(new NavigationEnd(1, '/home', '/home')); // consume first nav
    toSpy.calls.reset();
    events.next(new NavigationStart(2, '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // overlay + rune
  });

  it('runs the fade-in on a subsequent NavigationEnd', () => {
    events.next(new NavigationEnd(1, '/home', '/home'));
    toSpy.calls.reset();
    events.next(new NavigationEnd(2, '/projects', '/projects'));
    expect(toSpy).toHaveBeenCalledTimes(2); // rune out + overlay out
  });

  it('excludes opening routes from the transition', () => {
    events.next(new NavigationEnd(1, '/home', '/home'));
    toSpy.calls.reset();
    events.next(new NavigationStart(2, '/opening-home'));
    events.next(new NavigationEnd(2, '/opening-resume', '/opening-resume'));
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('ignores router events unrelated to start/end', () => {
    events.next(new NavigationEnd(1, '/home', '/home'));
    toSpy.calls.reset();
    // A non-Start/End event must be filtered out before reaching the handlers.
    events.next({ id: 3 } as unknown as NavigationEnd);
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('unsubscribes from router events on destroy', () => {
    expect(events.observed).toBeTrue();
    fixture.destroy();
    expect(events.observed).toBeFalse();
  });
});
