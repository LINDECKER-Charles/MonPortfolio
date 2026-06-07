import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import gsap from 'gsap';

import { ConstructionState } from './construction-state';

describe('ConstructionState', () => {
  function configure(platform: 'browser' | 'server' = 'browser') {
    return TestBed.configureTestingModule({
      imports: [ConstructionState],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: platform },
      ],
    }).compileComponents();
  }

  beforeEach(() => {
    spyOn(gsap, 'fromTo');
    spyOn(gsap, 'registerPlugin');
  });

  it('creates and exposes the three pillar icons', async () => {
    await configure();
    const fixture = TestBed.createComponent(ConstructionState);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    const icons = (fixture.componentInstance as unknown as { pillarIcons: string[] }).pillarIcons;
    expect(icons).toEqual(['roadmap', 'craft', 'launch']);
  });

  it('runs the intro GSAP animations in the browser', async () => {
    await configure('browser');
    const fixture = TestBed.createComponent(ConstructionState);
    fixture.detectChanges();

    expect(gsap.registerPlugin).toHaveBeenCalled();
    // Panneau + groupe d'éléments enfants = 2 fromTo.
    expect(gsap.fromTo).toHaveBeenCalledTimes(2);
  });

  it('does not animate on the server platform', async () => {
    await configure('server');
    const fixture = TestBed.createComponent(ConstructionState);
    fixture.detectChanges();

    expect(gsap.registerPlugin).not.toHaveBeenCalled();
    expect(gsap.fromTo).not.toHaveBeenCalled();
  });
});
