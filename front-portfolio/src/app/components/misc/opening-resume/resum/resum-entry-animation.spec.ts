import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import gsap from 'gsap';

import { ResumEntryAnimation } from './resum-entry-animation';

@Component({ selector: 'app-entry-host', template: '<span class="anim">a</span><span class="anim">b</span>' })
class EntryHost extends ResumEntryAnimation {
  protected readonly animationSelectors = '.anim';
}

@Component({ selector: 'app-entry-empty-host', template: '<span>nothing</span>' })
class EntryEmptyHost extends ResumEntryAnimation {
  protected readonly animationSelectors = '.missing';
}

describe('ResumEntryAnimation', () => {
  let setSpy: jasmine.Spy;
  let toSpy: jasmine.Spy;

  beforeEach(() => {
    setSpy = spyOn(gsap, 'set');
    // gsap.context exécute son callback de façon synchrone et le scope ; on garde le vrai context.
    toSpy = spyOn(gsap, 'to').and.callFake((_t: any, vars: any) => {
      // Exécute immédiatement onComplete pour couvrir la branche de fin d'animation.
      vars?.onComplete?.();
      return { kill: () => {} } as any;
    });
  });

  function build<T extends ResumEntryAnimation>(type: any): ComponentFixture<T> {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [type],
    });
    const fixture = TestBed.createComponent<T>(type);
    fixture.detectChanges();
    return fixture;
  }

  it('sets targets, tweens them and marks completion when targets exist', () => {
    const fixture = build<EntryHost>(EntryHost);
    expect(setSpy).toHaveBeenCalled();
    expect(toSpy).toHaveBeenCalled();
    // onComplete a basculé le flag de complétion.
    expect((fixture.componentInstance as any).isEntryAnimationComplete).toBeTrue();
  });

  it('marks completion immediately and skips tweening when no targets match', () => {
    const fixture = build<EntryEmptyHost>(EntryEmptyHost);
    expect((fixture.componentInstance as any).isEntryAnimationComplete).toBeTrue();
    expect(toSpy).not.toHaveBeenCalled();
  });

  it('ngOnDestroy reverts context and flags completion', () => {
    const fixture = build<EntryHost>(EntryHost);
    expect(() => fixture.destroy()).not.toThrow();
    expect((fixture.componentInstance as any).isEntryAnimationComplete).toBeTrue();
  });
});
