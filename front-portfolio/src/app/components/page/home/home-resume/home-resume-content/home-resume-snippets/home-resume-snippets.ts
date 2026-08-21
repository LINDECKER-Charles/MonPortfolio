import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { TranslationService } from '../../../../../../services/translation.service';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { ResponsivePicture } from '../../../../../assets/responsive-picture/responsive-picture';
import { ResponsiveImageSet, SHARED_IMAGES } from '../../../../../../img-sources/shared.sources';

/** Textes (title/content/icon_alt) résolus via i18n `home-resume.snippets.<id>.*`. */
interface HomeResumeSnippet {
  id: string;
  icon: ResponsiveImageSet;
}

@Component({
  selector: 'app-home-resume-snippets',
  imports: [ResponsivePicture],
  templateUrl: './home-resume-snippets.html',
  styleUrl: './home-resume-snippets.css',
})
export class HomeResumeSnippets implements AfterViewInit {
  protected readonly ts = inject(TranslationService);

  readonly snippets: HomeResumeSnippet[] = [
    { id: 'transmission', icon: SHARED_IMAGES.icon.pousseRes },
    { id: 'stack', icon: SHARED_IMAGES.icon.physique },
    { id: 'architecture', icon: SHARED_IMAGES.icon.esoResist },
    { id: 'opensource', icon: SHARED_IMAGES.icon.fire },
    { id: 'quality', icon: SHARED_IMAGES.icon.lucidity },
  ];

  /** Id du snippet ouvert (accordéon à ouverture unique), null si tout est replié. */
  protected readonly openId = signal<string | null>(null);

  @ViewChildren('snippetCard')
  private snippetCardRefs!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('snippetContent')
  private snippetContentRefs!: QueryList<ElementRef<HTMLElement>>;

  private readonly isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.initializeAccordionState();
    this.animateIntro();
  }

  protected toggleSnippet(id: string): void {
    if (!this.isBrowser) return;

    const previousId = this.openId();
    const nextId = previousId === id ? null : id;
    this.openId.set(nextId);

    this.snippets.forEach((snippet, index) => {
      const contentEl = this.snippetContentRefs.get(index)?.nativeElement;
      if (!contentEl) return;

      if (snippet.id === nextId) {
        this.expandContent(contentEl);
      } else if (snippet.id === previousId) {
        this.collapseContent(contentEl);
      }
    });
  }

  private expandContent(contentEl: HTMLElement): void {
    if (this.shouldUseSimpleMotion()) {
      this.setExpandedState(contentEl, true);
      return;
    }

    gsap.killTweensOf(contentEl);
    gsap.set(contentEl, {
      display: 'block',
      overflow: 'hidden',
    });

    gsap.fromTo(
      contentEl,
      {
        height: 0,
        autoAlpha: 0,
      },
      {
        height: contentEl.scrollHeight,
        autoAlpha: 1,
        duration: 0.22,
        ease: 'power1.out',
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(contentEl, {
            height: 'auto',
            overflow: 'visible',
            clearProps: 'opacity',
          });
        },
      },
    );
  }

  private collapseContent(contentEl: HTMLElement): void {
    if (this.shouldUseSimpleMotion()) {
      this.setExpandedState(contentEl, false);
      return;
    }

    gsap.killTweensOf(contentEl);
    gsap.set(contentEl, {
      overflow: 'hidden',
    });

    gsap.to(contentEl, {
      height: 0,
      autoAlpha: 0,
      duration: 0.18,
      ease: 'power1.inOut',
      overwrite: 'auto',
    });
  }

  private initializeAccordionState(): void {
    this.snippetContentRefs.forEach((ref) => {
      gsap.set(ref.nativeElement, {
        height: 0,
        autoAlpha: 0,
        overflow: 'hidden',
      });
    });
  }

  private animateIntro(): void {
    const cards = this.snippetCardRefs.map((ref) => ref.nativeElement);

    if (this.shouldUseSimpleMotion()) {
      gsap.set(cards, {
        autoAlpha: 1,
        clearProps: 'opacity',
      });
      return;
    }

    gsap.set(cards, {
      autoAlpha: 0,
    });

    gsap.to(cards, {
      autoAlpha: 1,
      duration: 0.3,
      ease: 'power1.out',
      overwrite: 'auto',
      clearProps: 'opacity',
    });
  }

  private setExpandedState(contentEl: HTMLElement, isExpanded: boolean): void {
    gsap.killTweensOf(contentEl);
    const state = isExpanded
      ? {
          height: 'auto',
          autoAlpha: 1,
          overflow: 'visible',
          clearProps: 'display',
        }
      : {
          height: 0,
          autoAlpha: 0,
          overflow: 'hidden',
        };

    gsap.set(contentEl, state);
  }

  private shouldUseSimpleMotion(): boolean {
    return window.matchMedia(
      '(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 767px)',
    ).matches;
  }
}
