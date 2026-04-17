import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import gsap from 'gsap';

/**
 * Transitions de page ritualisées — fade-to-black + rune qui apparaît, puis
 * fade-in à l'arrivée sur la nouvelle route. Lié aux events Angular Router.
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
        <circle cx="40" cy="40" r="32" stroke="#a49476" stroke-width="1" opacity="0.6"/>
        <circle cx="40" cy="40" r="22" stroke="#a49476" stroke-width="0.6" opacity="0.4"/>
        <path d="M40 12 L40 68 M12 40 L68 40" stroke="#a49476" stroke-width="0.6" opacity="0.35"/>
        <circle cx="40" cy="40" r="3" fill="#a49476" opacity="0.8"/>
      </svg>
    </div>
  `,
  styleUrl: './page-transition.css',
})
export class PageTransition implements AfterViewInit, OnDestroy {
  @ViewChild('overlay', { static: true }) private overlayRef!: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly isBrowser: boolean;

  private subscription?: Subscription;
  private firstNavigation = true;

  /** Routes dont on zappe la transition (séquences d'intro autonomes). */
  private readonly EXCLUDED = ['/opening-home', '/opening-resume'];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
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
      .pipe(filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.onNavigationStart(event.url, overlay, rune);
        } else if (event instanceof NavigationEnd) {
          this.onNavigationEnd(event.urlAfterRedirects, overlay, rune);
        }
      });
  }

  private onNavigationStart(url: string, overlay: HTMLElement, rune: SVGElement): void {
    if (this.firstNavigation || this.isExcluded(url)) return;

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
    if (this.firstNavigation) {
      this.firstNavigation = false;
      return;
    }

    if (this.isExcluded(url)) return;

    /* Le son newLocation est joué par UiSoundService au clic sur le chip
       de nav (feedback immédiat). Ici on ne gère que le visuel pour
       éviter la double lecture à l'arrivée. */

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

  private isExcluded(url: string): boolean {
    return this.EXCLUDED.some((path) => url.startsWith(path));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
