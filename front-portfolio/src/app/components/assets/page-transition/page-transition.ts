import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription, filter } from 'rxjs';
import gsap from 'gsap';

import { TRANSITION_EXCLUDED_PREFIXES } from '../../../seo/site-routes';
import { NavigationContextService } from '../../../services/navigation-context.service';

/**
 * Transitions de page ritualisées — fade-to-black + rune qui apparaît, puis
 * fade-in à l'arrivée sur la nouvelle route. Lié aux events Angular Router.
 *
 * Le rendu initial (HTML SSR hydraté) ne joue aucune transition :
 * `NavigationContextService.hasNavigated()` ne passe à `true` qu'à partir de
 * la première navigation client.
 *
 * Routes exclues : opening-home / opening-resume (elles ont leurs propres
 * séquences GSAP, pas besoin de double-animation).
 */
@Component({
  selector: 'app-page-transition',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-transition" #overlay aria-hidden="true">
      <svg class="page-transition__rune" viewBox="0 0 80 80" fill="none">
        <!-- Cercle rituel + croix gravée. Simple mais lisible à l'échelle. -->
        <circle cx="40" cy="40" r="32" stroke="#a49476" stroke-width="1" opacity="0.6" />
        <circle cx="40" cy="40" r="22" stroke="#a49476" stroke-width="0.6" opacity="0.4" />
        <path d="M40 12 L40 68 M12 40 L68 40" stroke="#a49476" stroke-width="0.6" opacity="0.35" />
        <circle cx="40" cy="40" r="3" fill="#a49476" opacity="0.8" />
      </svg>
    </div>
  `,
  styleUrl: './page-transition.css',
})
export class PageTransition implements AfterViewInit, OnDestroy {
  @ViewChild('overlay', { static: true }) private overlayRef!: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly navigationContext = inject(NavigationContextService);
  private readonly isBrowser: boolean;

  private subscription?: Subscription;

  /**
   * Garde-fou : si aucun événement terminal (End/Error/Cancel/Skipped) n'arrive
   * — chunk lazy disparu après un déploiement, promesse d'import jamais résolue —
   * l'overlay est rabattu de force après ce délai plutôt que de rester en écran noir.
   */
  private static readonly FAILSAFE_DELAY_S = 8;
  private failsafe?: gsap.core.Tween;

  /** Routes sans transition (séquences d'intro autonomes) — cf. site-routes.json. */
  private readonly EXCLUDED = TRANSITION_EXCLUDED_PREFIXES;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const overlay = this.overlayRef.nativeElement;
    const rune = overlay.querySelector('.page-transition__rune') as SVGElement;

    // État initial : overlay caché.
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(rune, { autoAlpha: 0, scale: 0.8, rotation: -10 });

    this.subscription = this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationError ||
            e instanceof NavigationCancel ||
            e instanceof NavigationSkipped,
        ),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.onNavigationStart(event.url, overlay, rune);
        } else if (event instanceof NavigationEnd) {
          this.onNavigationEnd(event.urlAfterRedirects, overlay, rune);
        } else {
          // Navigation avortée (NavigationError / Cancel / Skipped) : sans
          // NavigationEnd, l'overlay resterait affiché indéfiniment.
          this.onNavigationAborted(overlay, rune);
        }
      });
  }

  private onNavigationStart(url: string, overlay: HTMLElement, rune: SVGElement): void {
    if (!this.navigationContext.hasNavigated() || this.isExcluded(url)) return;

    this.armFailsafe(overlay, rune);
    gsap.to(overlay, { autoAlpha: 1, duration: 0.22, ease: 'power2.in' });
    gsap.to(rune, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  private onNavigationEnd(url: string, overlay: HTMLElement, rune: SVGElement): void {
    this.disarmFailsafe();

    if (!this.navigationContext.hasNavigated() || this.isExcluded(url)) return;

    /* Le son newLocation est joué par UiSoundService au clic sur le chip
       de nav (feedback immédiat). Ici on ne gère que le visuel pour
       éviter la double lecture à l'arrivée. */

    this.hideOverlay(overlay, rune);
  }

  private onNavigationAborted(overlay: HTMLElement, rune: SVGElement): void {
    this.disarmFailsafe();
    if (!this.navigationContext.hasNavigated()) return;
    this.hideOverlay(overlay, rune);
  }

  private hideOverlay(overlay: HTMLElement, rune: SVGElement): void {
    gsap.to(rune, {
      autoAlpha: 0,
      scale: 1.15,
      duration: 0.3,
      ease: 'power2.in',
    });
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.out',
      delay: 0.12,
    });
  }

  private armFailsafe(overlay: HTMLElement, rune: SVGElement): void {
    this.disarmFailsafe();
    this.failsafe = gsap.delayedCall(PageTransition.FAILSAFE_DELAY_S, () =>
      this.hideOverlay(overlay, rune),
    );
  }

  private disarmFailsafe(): void {
    this.failsafe?.kill();
    this.failsafe = undefined;
  }

  private isExcluded(url: string): boolean {
    return this.EXCLUDED.some((path) => url.startsWith(path));
  }

  ngOnDestroy(): void {
    this.disarmFailsafe();
    this.subscription?.unsubscribe();
  }
}
