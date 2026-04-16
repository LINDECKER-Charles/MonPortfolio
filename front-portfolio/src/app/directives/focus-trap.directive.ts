import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';

/**
 * Piège le focus clavier à l'intérieur de l'élément hôte — attendu sur les
 * modals / dialogs ouverts. Au montage, focus le premier élément tabbable
 * du host. À la destruction, restaure le focus sur l'élément qui l'avait
 * avant l'ouverture.
 *
 * Utilisation :
 *   <div appFocusTrap role="dialog" aria-modal="true">…</div>
 */
@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private readonly isBrowser: boolean;
  private previousActive: HTMLElement | null = null;

  private readonly FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.previousActive = document.activeElement as HTMLElement | null;

    const focusables = this.getFocusables();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      this.host.nativeElement.setAttribute('tabindex', '-1');
      this.host.nativeElement.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusables = this.getFocusables();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusables(): HTMLElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLElement>(this.FOCUSABLE_SELECTOR)
    ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.previousActive?.focus?.();
  }
}
