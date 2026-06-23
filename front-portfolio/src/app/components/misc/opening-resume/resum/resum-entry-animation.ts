import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import gsap from 'gsap';
import { NavigationContextService } from '../../../../services/navigation-context.service';
import { prefersReducedMotion } from '../../../../utils/motion';

@Directive()
export abstract class ResumEntryAnimation implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly navigationContext = inject(NavigationContextService);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly hostRef = inject(ElementRef<HTMLElement>);
  protected isEntryAnimationComplete = !this.isBrowser;
  private ctx?: gsap.Context;
  private tween?: gsap.core.Tween;

  protected abstract readonly animationSelectors: string;
  protected animationDelay = 0;
  protected animationY = 12;
  protected animationDuration = 0.42;
  protected animationStagger = 0.04;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Rendu initial (SSR déjà peint) ou reduced-motion : ne pas re-masquer le
    // contenu — flash visuel + candidat LCP repoussé à l'hydratation. L'entrée
    // staggerée ne joue que sur les navigations client.
    if (!this.navigationContext.hasNavigated() || prefersReducedMotion()) {
      this.isEntryAnimationComplete = true;
      return;
    }

    this.ctx = gsap.context(() => {
      const targets = this.hostRef.nativeElement.querySelectorAll(this.animationSelectors);
      if (!targets.length) {
        this.isEntryAnimationComplete = true;
        return;
      }

      gsap.set(targets, {
        opacity: 0,
        y: this.animationY,
      });

      this.tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: this.animationDuration,
        delay: this.animationDelay,
        stagger: this.animationStagger,
        ease: 'power3.out',
        onComplete: () => {
          this.isEntryAnimationComplete = true;
          this.tween?.kill();
          this.tween = undefined;
        },
      });
    }, this.hostRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.isEntryAnimationComplete = true;
    this.tween?.kill();
    this.ctx?.revert();
  }

  /**
   * Garde commune aux interactions hover/press des sous-composants : ne joue
   * l'animation que côté navigateur et une fois l'entrée terminée, sur la cible
   * courante de l'événement.
   */
  protected animateOnEvent(event: Event, animate: (element: HTMLElement) => void): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;
    const element = event.currentTarget as HTMLElement | null;
    if (element) animate(element);
  }
}
