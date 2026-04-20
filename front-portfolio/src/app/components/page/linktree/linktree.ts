import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

import { ResponsivePicture } from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';
import { TranslationService } from '../../../services/translation.service';
import { LINKTREE_SECTIONS, LinktreeLink, LinktreeSection } from './linktree.state';

@Component({
  selector: 'app-linktree',
  standalone: true,
  imports: [CommonModule, ResponsivePicture],
  templateUrl: './linktree.html',
  styleUrl: './linktree.css',
})
export class Linktree implements AfterViewInit {
  protected readonly ts = inject(TranslationService);

  protected readonly sections: LinktreeSection[] = LINKTREE_SECTIONS;

  protected readonly photoSources = SHARED_IMAGES.photo.me.sources;
  protected readonly photoFallback = SHARED_IMAGES.photo.me.fallbackSrc;

  @ViewChild('heroRef') private heroRef?: ElementRef<HTMLElement>;
  @ViewChild('sectionsRef') private sectionsRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const heroNode = this.heroRef?.nativeElement;
    if (heroNode) {
      const heroTargets = heroNode.querySelectorAll(
        '.linktree__portrait, .linktree__eyebrow, .linktree__title, .linktree__role, .linktree__intro-text'
      );

      gsap.fromTo(
        heroTargets,
        { autoAlpha: 0, y: 22, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          clearProps: 'filter',
        }
      );
    }

    const sectionsNode = this.sectionsRef?.nativeElement;
    if (!sectionsNode) return;

    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const blocks = sectionsNode.querySelectorAll('.linktree-chapter');
    blocks.forEach((block) => {
      const label = block.querySelector('.linktree-chapter__label');
      const intro = block.querySelector('.linktree-chapter__intro');
      const items = block.querySelectorAll('.linktree-row');
      const targets = [label, intro, ...Array.from(items)].filter(Boolean) as Element[];
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y: prefersReduced ? 0 : 16 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.2 : 0.7,
              ease: 'power2.out',
              stagger: prefersReduced ? 0 : 0.06,
              overwrite: 'auto',
            });
            observer.disconnect();
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
      );

      observer.observe(block);
    });
  }

  protected trackLink = (_: number, link: LinktreeLink): string => link.id;
  protected trackSection = (_: number, section: LinktreeSection): string => section.id;
}
