import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealDuration = 0.7;
  @Input() revealY = 24;
  @Input() revealBlur = 8;
  @Input() revealOnce = true;
  @Input() revealStart = '0px 0px -10% 0px';

  private observer?: IntersectionObserver;
  private readonly isBrowser: boolean;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const element = this.elementRef.nativeElement;

    gsap.set(element, {
      autoAlpha: 0,
      y: this.revealY,
      filter: `blur(${this.revealBlur}px)`,
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            delay: this.revealDelay,
            duration: this.revealDuration,
            ease: 'power3.out',
            clearProps: 'filter',
          });

          if (this.revealOnce) {
            this.observer?.unobserve(element);
          }
        }
      },
      {
        root: null,
        rootMargin: this.revealStart,
        threshold: 0.12,
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
