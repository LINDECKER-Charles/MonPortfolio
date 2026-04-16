import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { AudioService } from './audio-service';

/**
 * Sons UI par délégation d'événements — hover + click sur les primitives
 * interactives (`.chip`, `.cta-tome`, `.sound-button`, …).
 *
 * On évite d'ajouter une directive sur chaque template : un seul listener
 * au niveau du document capture tout, y compris les éléments ajoutés
 * dynamiquement (modals, items de liste, chips de filtre).
 *
 * Les sons "hover" sont volontairement extrêmement bas (~5 %) pour suggérer
 * la présence sans parasiter. Les sons "click" sont plus marqués.
 */
@Injectable({ providedIn: 'root' })
export class UiSoundService {
  private readonly audio = inject(AudioService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /* Les sons de hover ont été retirés : ils deviennent rapidement agaçants
     sur un site qu'on parcourt longtemps. Seul le clic reste sonorisé — c'est
     le moment où l'utilisateur attend un feedback tactile/auditif. */

  private readonly CLICK_SELECTOR = [
    '.chip',
    '.cta-tome',
    '.nav-barre__lang-btn',
    '.hero__cta',
    '.lang-modal__item',
    '.projects-filters__chip',
    '.projects-filters__option',
    '.project-card__toggle',
  ].join(', ');

  private started = false;
  private registered = false;

  /** Installe les listeners globaux — à appeler depuis App.ngOnInit. */
  start(): void {
    if (!this.isBrowser || this.started) return;
    this.started = true;

    this.registerUiSounds();

    this.document.addEventListener('click', this.onClick, { passive: true, capture: true });
  }

  private registerUiSounds(): void {
    if (this.registered) return;
    this.registered = true;

    this.audio.register('uiClick', {
      src: './song/get_echo.mp3',
      loop: false,
      volume: 0.12,
      preload: 'auto',
    });
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    if (!target) return;

    const match = target.closest(this.CLICK_SELECTOR);
    if (!match) return;
    if (this.isDisabled(match)) return;

    this.audio.playOnce('uiClick');
  };

  private isDisabled(el: Element): boolean {
    if (el.getAttribute('aria-disabled') === 'true') return true;
    if ((el as HTMLButtonElement).disabled) return true;
    return false;
  }
}
