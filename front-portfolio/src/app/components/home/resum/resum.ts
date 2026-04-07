import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import gsap from 'gsap';
import { ResponsivePicture } from '../../assets/responsive-picture/responsive-picture';
import { RESUM_IMAGES } from '../../../imgSources/resum.sources';

@Component({
  selector: 'app-resum',
  imports: [ResponsivePicture],
  templateUrl: './resum.html',
  styleUrl: './resum.css',
})
export class Resum implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('panel', { static: true }) panelRef!: ElementRef<HTMLElement>;
  @ViewChild('leftCol', { static: true }) leftColRef!: ElementRef<HTMLElement>;
  @ViewChild('centerCol', { static: true }) centerColRef!: ElementRef<HTMLElement>;
  @ViewChild('rightCol', { static: true }) rightColRef!: ElementRef<HTMLElement>;
  @ViewChild('bottomBlock', { static: true }) bottomBlockRef!: ElementRef<HTMLElement>;

  public readonly images = RESUM_IMAGES;

  private ctx?: gsap.Context;
  private idleTweens: gsap.core.Tween[] = [];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ctx = gsap.context(() => {
      const panel = this.panelRef.nativeElement;
      const left = this.leftColRef.nativeElement;
      const center = this.centerColRef.nativeElement;
      const right = this.rightColRef.nativeElement;
      const bottom = this.bottomBlockRef.nativeElement;

      const frame = panel.querySelector('.panel-frame');
      const noise = panel.querySelector('.panel-noise');
      const scanlines = panel.querySelector('.panel-scanlines');
      const sheen = panel.querySelector('.panel-sheen');

      const leftItems = left.querySelectorAll('.title, .row, .separator');
      const centerItems = center.querySelectorAll('.row');
      const rightItems = right.querySelectorAll(
        '.runes, .section-title, .passives li, .separator, .contact-block'
      );
      const bottomItems = bottom.querySelectorAll('.section-title, .project-list li');

      gsap.set(panel, {
        opacity: 0,
        y: 22,
        scale: 0.988,
        filter: 'blur(8px)',
        transformOrigin: '50% 50%',
      });

      gsap.set([left, center, right, bottom], {
        opacity: 1,
      });

      gsap.set([leftItems, centerItems, rightItems, bottomItems], {
        opacity: 0,
        y: 12,
      });

      gsap.set([frame, noise, scanlines, sheen], {
        opacity: 0,
      });

      if (sheen) {
        gsap.set(sheen, {
          x: '-120%',
          rotate: 8,
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.to(panel, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.85,
      });

      if (frame) {
        tl.to(
          frame,
          {
            opacity: 1,
            duration: 0.45,
          },
          '-=0.5'
        );
      }

      if (noise) {
        tl.to(
          noise,
          {
            opacity: 0.08,
            duration: 0.55,
          },
          '-=0.4'
        );
      }

      if (scanlines) {
        tl.to(
          scanlines,
          {
            opacity: 0.11,
            duration: 0.55,
          },
          '-=0.5'
        );
      }

      tl.to(
        leftItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.04,
        },
        '-=0.3'
      )
        .to(
          centerItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.035,
          },
          '-=0.28'
        )
        .to(
          rightItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.05,
          },
          '-=0.24'
        )
        .to(
          bottomItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.045,
          },
          '-=0.2'
        )
        .add(() => {
          gsap.delayedCall(0.25, () => {
            this.startIdleAnimations(panel, left, center, right, bottom, noise, scanlines, sheen);
          });
        });
    }, this.panelRef.nativeElement);
  }

  private startIdleAnimations(
    panel: HTMLElement,
    left: HTMLElement,
    center: HTMLElement,
    right: HTMLElement,
    bottom: HTMLElement,
    noise: Element | null,
    scanlines: Element | null,
    sheen: Element | null
  ): void {
    this.killIdleTweens();

    gsap.set([left, center, right, bottom], {
      transformOrigin: '50% 50%',
      force3D: true,
    });

    this.idleTweens.push(
      gsap.to(left, {
        y: -2,
        x: -0.5,
        rotation: -0.08,
        duration: 5.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    this.idleTweens.push(
      gsap.to(center, {
        y: -1.5,
        x: 0.5,
        rotation: 0.06,
        duration: 6.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    this.idleTweens.push(
      gsap.to(right, {
        y: -2.5,
        x: 0.8,
        rotation: 0.08,
        duration: 5.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    this.idleTweens.push(
      gsap.to(bottom, {
        y: -1.5,
        x: 0.3,
        duration: 6.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    this.idleTweens.push(
      gsap.to(panel, {
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.05), 0 22px 90px rgba(0,0,0,0.5)',
        duration: 4.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    );

    if (noise) {
      this.idleTweens.push(
        gsap.to(noise, {
          x: 5,
          y: 3,
          duration: 6.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      );
    }

    if (scanlines) {
      this.idleTweens.push(
        gsap.to(scanlines, {
          backgroundPositionY: '12px',
          duration: 1.9,
          ease: 'none',
          repeat: -1,
        })
      );
    }

    if (sheen) {
      this.idleTweens.push(
        gsap.fromTo(
          sheen,
          {
            x: '-120%',
            opacity: 0,
          },
          {
            x: '220%',
            opacity: 0.28,
            duration: 5.5,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 1.5,
          }
        )
      );
    }
  }

  private killIdleTweens(): void {
    for (const tween of this.idleTweens) {
      tween.kill();
    }
    this.idleTweens = [];
  }

  ngOnDestroy(): void {
    this.killIdleTweens();
    this.ctx?.revert();
  }
}
