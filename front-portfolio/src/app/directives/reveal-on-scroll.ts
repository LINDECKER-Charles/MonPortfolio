import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { shouldSkipEntrance } from '../utils/motion';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { NavigationContextService } from '../services/navigation-context.service';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() revealDelay = 0;
  @Input() revealDuration = 0.7;
  @Input() revealY = 24;
  @Input() revealBlur = 8;
  @Input() revealOnce = true;
  @Input() revealStart = '0px 0px 25% 0px';

  /** Micro-zoom de 0.94 → 1 à l'apparition (subtil mais donne du poids). */
  @Input() revealScale = false;

  /** Flash ember bref (halo rouge-orangé qui pulse 1× puis s'éteint). */
  @Input() revealGlow = false;

  private observer?: IntersectionObserver;
  private readonly isBrowser: boolean;
  private readonly navigationContext = inject(NavigationContextService);

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const element = this.elementRef.nativeElement;

    // Politique d'entrance partagée (utils/motion.ts) : reduced-motion, ou
    // élément SSR déjà visible au rendu initial — ne jamais le re-masquer.
    if (shouldSkipEntrance(element, this.navigationContext)) return;

    const initialProps: gsap.TweenVars = {
      autoAlpha: 0,
      y: this.revealY,
      filter: `blur(${this.revealBlur}px)`,
    };

    if (this.revealScale) {
      initialProps['scale'] = 0.94;
    }

    gsap.set(element, initialProps);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const toProps: gsap.TweenVars = {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            delay: this.revealDelay,
            duration: this.revealDuration,
            ease: 'power3.out',
            clearProps: 'filter',
          };

          if (this.revealScale) {
            toProps['scale'] = 1;
          }

          gsap.to(element, toProps);

          if (this.revealGlow) {
            this.playEmberFlash(element);
          }

          if (this.revealOnce) {
            this.observer?.unobserve(element);
          }
        }
      },
      {
        root: null,
        rootMargin: this.revealStart,
        threshold: 0.01,
      },
    );

    this.observer.observe(element);
  }

  /** Flash ember : on pose temporairement une box-shadow chaude qui s'éteint. */
  private playEmberFlash(element: HTMLElement): void {
    const originalShadow = element.style.boxShadow;
    const flash = '0 0 48px rgb(255 147 77 / 0.28), 0 0 16px rgb(166 10 10 / 0.22)';

    gsap
      .timeline({ delay: this.revealDelay + 0.1 })
      .to(element, {
        duration: 0.4,
        boxShadow: flash,
        ease: 'power2.out',
      })
      .to(element, {
        duration: 0.8,
        boxShadow: originalShadow || 'none',
        ease: 'power2.in',
        clearProps: 'boxShadow',
      });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
