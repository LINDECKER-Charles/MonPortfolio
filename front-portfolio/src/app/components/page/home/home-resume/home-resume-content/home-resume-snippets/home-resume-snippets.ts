import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {ResponsivePicture} from '../../../../../assets/responsive-picture/responsive-picture';
import {HomeResumeSnippetState} from '../../home-resume.state';

@Component({
  selector: 'app-home-resume-snippets',
  imports: [CommonModule, ResponsivePicture],
  templateUrl: './home-resume-snippets.html',
  styleUrl: './home-resume-snippets.css',
})
export class HomeResumeSnippets implements AfterViewInit {
  @Input({ required: true }) snippets: HomeResumeSnippetState[] = [];

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

    const targetIndex = this.snippets.findIndex((snippet) => snippet.id === id);
    if (targetIndex === -1) return;

    this.snippets.forEach((snippet, index) => {
      const contentEl = this.snippetContentRefs.get(index)?.nativeElement;
      if (!contentEl) return;

      const isTarget = snippet.id === id;

      if (isTarget && !snippet.isOpen) {
        snippet.isOpen = true;

        gsap.killTweensOf(contentEl);
        gsap.set(contentEl, {
          overflow: 'hidden',
          display: 'block',
        });

        gsap.fromTo(
          contentEl,
          {
            height: 0,
            autoAlpha: 0,
            y: -8,
            filter: 'blur(6px)',
          },
          {
            height: contentEl.scrollHeight,
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.42,
            ease: 'power3.out',
            onComplete: () => {
              gsap.set(contentEl, {
                height: 'auto',
                overflow: 'visible',
              });
            },
          }
        );

        return;
      }

      if ((!isTarget && snippet.isOpen) || (isTarget && snippet.isOpen)) {
        snippet.isOpen = false;

        gsap.killTweensOf(contentEl);
        gsap.set(contentEl, {
          overflow: 'hidden',
        });

        gsap.to(contentEl, {
          height: 0,
          autoAlpha: 0,
          y: -8,
          filter: 'blur(6px)',
          duration: 0.34,
          ease: 'power2.inOut',
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
        y: -8,
        filter: 'blur(6px)',
      });
    });
  }

  private animateIntro(): void {
    const cards = this.snippetCardRefs.map((ref) => ref.nativeElement);

    gsap.set(cards, {
      autoAlpha: 0,
      y: 24,
      filter: 'blur(10px)',
    });

    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.1,
      clearProps: 'filter',
    });
  }
}
