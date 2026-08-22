import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanternLightDirective } from './lantern-light.directive';

@Component({
  imports: [LanternLightDirective],
  template: `<section appLanternLight style="width: 200px; height: 100px"></section>`,
})
class HostComponent {}

describe('LanternLightDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HTMLElement;
  let originalMatchMedia: typeof window.matchMedia;

  /** Simule un environnement : pointeur fin et reduced-motion pilotés par requête média. */
  function mockMatchMedia(finePointer: boolean, reducedMotion: boolean): void {
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes('reduced-motion') ? reducedMotion : finePointer,
        media: query,
      }) as MediaQueryList) as typeof window.matchMedia;
  }

  async function setup(): Promise<void> {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement.querySelector('section');
  }

  function pointer(type: string, clientX: number, clientY: number): void {
    host.dispatchEvent(new PointerEvent(type, { clientX, clientY, bubbles: true }));
  }

  /** Attend l'exécution du requestAnimationFrame posé par la directive. */
  function nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('lights the surface and tracks the pointer (px from the host corner) with a fine pointer', async () => {
    mockMatchMedia(true, false);
    await setup();
    const rect = host.getBoundingClientRect();

    pointer('pointerenter', rect.left, rect.top);
    expect(host.style.getPropertyValue('--lantern-on')).toBe('1');
    expect(host.style.getPropertyValue('--lantern-x')).toBe('0.0px');
    expect(host.style.getPropertyValue('--lantern-y')).toBe('0.0px');

    // Hôte 200×100 : milieu horizontal = 100px, quart vertical = 25px.
    pointer('pointermove', rect.left + rect.width / 2, rect.top + rect.height / 4);
    await nextFrame();
    expect(host.style.getPropertyValue('--lantern-x')).toBe('100.0px');
    expect(host.style.getPropertyValue('--lantern-y')).toBe('25.0px');

    pointer('pointerleave', rect.left, rect.top);
    expect(host.style.getPropertyValue('--lantern-on')).toBe('0');
  });

  it('applies the entry position synchronously, before switching the light on', async () => {
    mockMatchMedia(true, false);
    await setup();
    const rect = host.getBoundingClientRect();
    const setProperty = spyOn(host.style, 'setProperty').and.callThrough();

    pointer('pointerenter', rect.left + 40, rect.top + 10);

    expect(setProperty.calls.allArgs()).toEqual([
      ['--lantern-x', '40.0px'],
      ['--lantern-y', '10.0px'],
      ['--lantern-on', '1'],
    ]);
  });

  it('coalesces successive moves into a single frame (last position wins)', async () => {
    mockMatchMedia(true, false);
    await setup();
    const rect = host.getBoundingClientRect();

    pointer('pointermove', rect.left, rect.top);
    pointer('pointermove', rect.left + rect.width, rect.top + rect.height);
    await nextFrame();
    expect(host.style.getPropertyValue('--lantern-x')).toBe('200.0px');
    expect(host.style.getPropertyValue('--lantern-y')).toBe('100.0px');
  });

  it('stays inert without a fine pointer (touch)', async () => {
    mockMatchMedia(false, false);
    await setup();

    pointer('pointerenter', 10, 10);
    pointer('pointermove', 10, 10);
    await nextFrame();
    expect(host.style.getPropertyValue('--lantern-on')).toBe('');
    expect(host.style.getPropertyValue('--lantern-x')).toBe('');
  });

  it('stays inert under prefers-reduced-motion', async () => {
    mockMatchMedia(true, true);
    await setup();

    pointer('pointerenter', 10, 10);
    expect(host.style.getPropertyValue('--lantern-on')).toBe('');
    expect(host.style.getPropertyValue('--lantern-x')).toBe('');
  });

  it('cancels a pending frame on destroy', async () => {
    mockMatchMedia(true, false);
    await setup();
    const cancel = spyOn(window, 'cancelAnimationFrame').and.callThrough();

    pointer('pointermove', 10, 10);
    fixture.destroy();
    expect(cancel).toHaveBeenCalled();
  });
});
