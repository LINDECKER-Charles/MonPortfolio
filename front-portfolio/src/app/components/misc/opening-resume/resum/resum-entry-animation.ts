import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import gsap from 'gsap';

@Directive()
export abstract class ResumEntryAnimation implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly hostRef = inject(ElementRef<HTMLElement>);
  private ctx?: gsap.Context;
  private tween?: gsap.core.Tween;

  protected abstract readonly animationSelectors: string;
  protected animationDelay = 0;
  protected animationY = 12;
  protected animationDuration = 0.42;
  protected animationStagger = 0.04;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ctx = gsap.context(() => {
      const targets = this.hostRef.nativeElement.querySelectorAll(this.animationSelectors);
      if (!targets.length) return;

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
          this.tween?.kill();
          this.tween = undefined;
        },
      });
    }, this.hostRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.tween?.kill();
    this.ctx?.revert();
  }
}
