import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../../../imgSources/shared.sources';
import { TranslatePipe } from '../../../../../../pipes/translate.pipe';

interface HomeResumeSnippetState {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  iconAlt: string;
  iconSources: ResponsiveSource[];
  iconFallback: string;
}

@Component({
  selector: 'app-home-resume-snippets',
  imports: [TranslatePipe, CommonModule, ResponsivePicture],
  templateUrl: './home-resume-snippets.html',
  styleUrl: './home-resume-snippets.css',
})
export class HomeResumeSnippets implements AfterViewInit {
  snippets: HomeResumeSnippetState[] = [
    {
      id: 'transmission',
      title: 'home.resume.snippet.transmission.title',
      content:
        'home.resume.snippet.transmission.content',
      isOpen: false,
      iconAlt: 'home.resume.snippet.transmission.iconAlt',
      iconSources: SHARED_IMAGES.icon.pousseRes.sources,
      iconFallback: SHARED_IMAGES.icon.pousseRes.fallbackSrc,
    },
    {
      id: 'stack',
      title: 'home.resume.snippet.stack.title',
      content:
        'home.resume.snippet.stack.content',
      isOpen: false,
      iconAlt: 'home.resume.snippet.stack.iconAlt',
      iconSources: SHARED_IMAGES.icon.physique.sources,
      iconFallback: SHARED_IMAGES.icon.physique.fallbackSrc,
    },
    {
      id: 'architecture',
      title: 'home.resume.snippet.architecture.title',
      content:
        'home.resume.snippet.architecture.content',
      isOpen: false,
      iconAlt: 'home.resume.snippet.architecture.iconAlt',
      iconSources: SHARED_IMAGES.icon.esoResist.sources,
      iconFallback: SHARED_IMAGES.icon.esoResist.fallbackSrc,
    },
    {
      id: 'opensource',
      title: 'home.resume.snippet.opensource.title',
      content:
        'home.resume.snippet.opensource.content',
      isOpen: false,
      iconAlt: 'home.resume.snippet.opensource.iconAlt',
      iconSources: SHARED_IMAGES.icon.fire.sources,
      iconFallback: SHARED_IMAGES.icon.fire.fallbackSrc,
    },
    {
      id: 'quality',
      title: 'home.resume.snippet.quality.title',
      content:
        'home.resume.snippet.quality.content',
      isOpen: false,
      iconAlt: 'home.resume.snippet.quality.iconAlt',
      iconSources: SHARED_IMAGES.icon.lucidity.sources,
      iconFallback: SHARED_IMAGES.icon.lucidity.fallbackSrc,
    },
  ];

  @ViewChildren('snippetCard')
  private snippetCardRefs!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('snippetContent')
  private snippetContentRefs!: QueryList<ElementRef<HTMLElement>>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
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

    this.snippets.forEach((snippet, index) => {
      const contentEl = this.snippetContentRefs.get(index)?.nativeElement;
      if (!contentEl) return;

      const isTarget = snippet.id === id;

      if (isTarget && !snippet.isOpen) {
        snippet.isOpen = true;

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
          }
        );

        return;
      }

      if ((!isTarget && snippet.isOpen) || (isTarget && snippet.isOpen)) {
        snippet.isOpen = false;

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

  private setExpandedState(
    contentEl: HTMLElement,
    isExpanded: boolean
  ): void {
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
      '(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 767px)'
    ).matches;
  }
}