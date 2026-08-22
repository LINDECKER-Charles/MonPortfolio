import {
  Component,
  PLATFORM_ID,
  provideZonelessChangeDetection,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FocusTrapDirective } from './focus-trap.directive';

@Component({
  imports: [FocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="outside" type="button">outside</button>
    @if (showTrap) {
      <div appFocusTrap>
        @if (withFocusables) {
          <button id="first" type="button">first</button>
          <button id="middle" type="button">middle</button>
          <button id="last" type="button">last</button>
        } @else {
          <span>no focusables</span>
        }
      </div>
    }
  `,
})
class HostComponent {
  showTrap = true;
  withFocusables = true;
}

/** offsetParent vaut null en jsdom/headless invisible : on le force pour le filtre. */
function makeVisible(fixture: ComponentFixture<HostComponent>): void {
  fixture.nativeElement.querySelectorAll('button, [appFocusTrap]').forEach((el: HTMLElement) => {
    Object.defineProperty(el, 'offsetParent', { value: document.body, configurable: true });
  });
}

function dispatchTab(host: HTMLElement, shiftKey: boolean): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  host.dispatchEvent(event);
  return event;
}

describe('FocusTrapDirective', () => {
  function configure(platform: 'browser' | 'server' = 'browser') {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: platform }],
    });
  }

  function trapEl(fixture: ComponentFixture<HostComponent>): HTMLElement {
    return fixture.debugElement.query(By.directive(FocusTrapDirective)).nativeElement;
  }

  it('focuses the first focusable element on init', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    makeVisible(fixture);
    // ngAfterViewInit a déjà tourné ; on relance via un nouveau cycle pour fiabilité.
    fixture.detectChanges();

    expect(document.activeElement?.id).toBe('first');
  });

  it('falls back to the host with tabindex=-1 when no focusable exists', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.withFocusables = false;
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    Object.defineProperty(host, 'offsetParent', { value: document.body, configurable: true });
    host.dispatchEvent(new Event('noop'));

    expect(host.getAttribute('tabindex')).toBe('-1');
  });

  it('wraps from first to last on Shift+Tab', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    const first = host.querySelector<HTMLElement>('#first')!;
    const last = host.querySelector<HTMLElement>('#last')!;
    first.focus();

    const event = dispatchTab(host, true);

    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(last);
  });

  it('wraps from last to first on Tab', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    const first = host.querySelector<HTMLElement>('#first')!;
    const last = host.querySelector<HTMLElement>('#last')!;
    last.focus();

    const event = dispatchTab(host, false);

    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(first);
  });

  it('does not interfere when focus is in the middle', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    const middle = host.querySelector<HTMLElement>('#middle')!;
    middle.focus();

    const event = dispatchTab(host, false);

    expect(event.defaultPrevented).toBeFalse();
    expect(document.activeElement).toBe(middle);
  });

  it('ignores non-Tab keys', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    host.dispatchEvent(event);

    expect(event.defaultPrevented).toBeFalse();
  });

  it('prevents default Tab when there is no focusable element', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.withFocusables = false;
    fixture.detectChanges();
    makeVisible(fixture);

    const host = trapEl(fixture);
    const event = dispatchTab(host, false);

    expect(event.defaultPrevented).toBeTrue();
  });

  it('restores focus to the previously active element on destroy', () => {
    configure();
    const fixture = TestBed.createComponent(HostComponent);
    const rootEl = fixture.nativeElement as HTMLElement;
    rootEl.style.position = 'relative';
    document.body.appendChild(rootEl);

    const outside = rootEl.querySelector<HTMLElement>('#outside')!;
    Object.defineProperty(outside, 'offsetParent', { value: document.body, configurable: true });
    outside.focus();
    expect(document.activeElement).toBe(outside);

    fixture.detectChanges();
    makeVisible(fixture);

    // La destruction du composant déclenche ngOnDestroy → restauration du focus.
    fixture.destroy();

    expect(document.activeElement).toBe(outside);
    rootEl.remove();
  });

  it('does nothing on the server platform', () => {
    configure('server');
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const host = trapEl(fixture);
    expect(host.getAttribute('tabindex')).toBeNull();
    // ngOnDestroy ne doit pas lever non plus.
    expect(() => fixture.destroy()).not.toThrow();
  });
});
