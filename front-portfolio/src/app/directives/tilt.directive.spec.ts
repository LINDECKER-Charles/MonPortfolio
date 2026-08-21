import { Component, PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TiltDirective } from './tilt.directive';

@Component({
  imports: [TiltDirective],
  template: `
    <div appTilt [tiltMax]="max" [tiltPerspective]="perspective" [tiltResetMs]="resetMs">
      tilt target
    </div>
  `,
})
class HostComponent {
  max = 4;
  perspective = 900;
  resetMs = 500;
}

describe('TiltDirective', () => {
  let rafSpy: jasmine.Spy;

  function configure(platform: 'browser' | 'server' = 'browser') {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: platform }],
    });
  }

  function el(fixture: ComponentFixture<HostComponent>): HTMLElement {
    return fixture.debugElement.query(By.directive(TiltDirective)).nativeElement;
  }

  /** matchMedia stub : pointeur fin actif + reduced-motion désactivé par défaut. */
  function stubMatchMedia(finePointer: boolean, reducedMotion: boolean) {
    spyOn(window, 'matchMedia').and.callFake(
      (query: string) =>
        ({
          matches: query.includes('hover') ? finePointer : reducedMotion,
        }) as MediaQueryList,
    );
  }

  beforeEach(() => {
    // rAF est aussi utilisé par le scheduler zoneless d'Angular : on ne peut pas
    // asserter "non appelé" globalement. On garde le vrai rAF pour le scheduler et
    // on exécute de façon synchrone uniquement les callbacks de la directive en
    // observant l'effet (style.transform) plutôt que le nombre d'appels.
    const realRaf = window.requestAnimationFrame.bind(window);
    rafSpy = spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return realRaf(() => {});
    });
    spyOn(window, 'cancelAnimationFrame').and.callThrough();
  });

  it('enables tilt and sets base styles on a fine-pointer device', () => {
    stubMatchMedia(true, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    expect(node.style.transformStyle).toBe('preserve-3d');
    expect(node.style.willChange).toBe('transform');
    expect(node.style.transition).toContain('transform 500ms');
  });

  it('does not enable tilt without a fine pointer', () => {
    stubMatchMedia(false, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    expect(node.style.transformStyle).toBe('');
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
    expect(node.style.transform).toBe('');
  });

  it('does not enable tilt when prefers-reduced-motion is set', () => {
    stubMatchMedia(true, true);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 10 }));
    expect(node.style.transform).toBe('');
  });

  it('applies a perspective transform on mousemove', () => {
    stubMatchMedia(true, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    spyOn(node, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    } as DOMRect);

    // Souris en bas à droite (clientX = width, clientY = height) → x=+0.5, y=+0.5.
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 100 }));

    // rotY = 0.5 * 4 * 2 = 4 ; rotX = -0.5 * 4 * 2 = -4.
    // Le navigateur normalise rotateX(-4.00deg) → rotateX(-4deg) au reflow.
    expect(node.style.transform).toBe('perspective(900px) rotateX(-4deg) rotateY(4deg)');
  });

  it('computes tilt relative to the element center', () => {
    stubMatchMedia(true, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    spyOn(node, 'getBoundingClientRect').and.returnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    } as DOMRect);

    // Centre exact → x=0, y=0 → pas de rotation, quel que soit tiltMax.
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

    expect(node.style.transform).toBe('perspective(900px) rotateX(0deg) rotateY(0deg)');
  });

  it('cancels the pending frame when a new mousemove arrives', () => {
    stubMatchMedia(true, false);
    rafSpy.and.returnValue(42); // ne pas exécuter immédiatement pour garder rafId.
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 2, clientY: 2 }));

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42);
  });

  it('resets the transform on mouseleave', () => {
    stubMatchMedia(true, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    node.dispatchEvent(new MouseEvent('mouseleave'));

    expect(node.style.transform).toBe('perspective(900px) rotateX(0deg) rotateY(0deg)');
  });

  it('ignores mousemove/mouseleave when not enabled', () => {
    stubMatchMedia(false, false);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    node.dispatchEvent(new MouseEvent('mouseleave'));
    expect(node.style.transform).toBe('');
  });

  it('cancels a pending frame on destroy', () => {
    stubMatchMedia(true, false);
    rafSpy.and.returnValue(7);
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    fixture.destroy();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(7);
  });

  it('does nothing on the server platform', () => {
    configure('server');
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const node = el(fixture);
    expect(node.style.transformStyle).toBe('');
    node.dispatchEvent(new MouseEvent('mousemove', { clientX: 5, clientY: 5 }));
    expect(node.style.transform).toBe('');
  });
});
