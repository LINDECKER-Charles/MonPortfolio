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
import { NavigationContextService } from '../../../services/navigation-context.service';
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
  private readonly navigationContext = inject(NavigationContextService);

  protected readonly sections: LinktreeSection[] = LINKTREE_SECTIONS;

  protected readonly photoSources = SHARED_IMAGES.photo.me.sources;
  protected readonly photoFallback = SHARED_IMAGES.photo.me.fallbackSrc;

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

    // L'entrance du hero est en CSS pur (.emerge-ritual) : ne jamais re-masquer
    // ici du contenu SSR déjà peint (flash + candidat LCP repoussé à l'hydratation).
    const sectionsNode = this.sectionsRef?.nativeElement;
    if (!sectionsNode) return;

    // Reduced motion : le contenu reste tel que rendu, sans masquage ni reveal.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const blocks = sectionsNode.querySelectorAll('.linktree-chapter');
    blocks.forEach((block) => {
      // Même règle que pour le hero : au rendu initial, un chapitre déjà
      // visible (peint en SSR) ne doit pas être re-masqué en attendant
      // l'IntersectionObserver. Après une navigation client, l'entrance joue.
      if (!this.navigationContext.hasNavigated()) {
        const rect = block.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) return;
      }

      const label = block.querySelector('.linktree-chapter__label');
      const intro = block.querySelector('.linktree-chapter__intro');
      const items = block.querySelectorAll('.linktree-row');
      const targets = [label, intro, ...Array.from(items)].filter(Boolean) as Element[];
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y: 16 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            gsap.to(targets, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.06,
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
