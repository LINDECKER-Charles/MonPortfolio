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
import { SHARED_IMAGES } from '../../../../../../img-sources/shared.sources';

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
  imports: [CommonModule, ResponsivePicture],
  templateUrl: './home-resume-snippets.html',
  styleUrl: './home-resume-snippets.css',
})
export class HomeResumeSnippets implements AfterViewInit {
  snippets: HomeResumeSnippetState[] = [
    {
      id: 'transmission',
      title: 'Transmission & Enseignement',
      content:
        'Il n’existe pas de meilleur exercice que le partage de connaissance : il permet d’éprouver nos raisonnements, de clarifier notre conception des choses et d’élever notre niveau d’exigence. Développeur depuis 9 ans, j’accorde une grande importance à la transmission auprès des futurs développeurs.',
      isOpen: false,
      iconAlt: 'Transmission et enseignement',
      iconSources: SHARED_IMAGES.icon.pousseRes.sources,
      iconFallback: SHARED_IMAGES.icon.pousseRes.fallbackSrc,
    },
    {
      id: 'stack',
      title: 'Stack & Excellence Technique',
      content:
        'Mes choix technologiques sont en accord avec mes ambitions. Angular et .NET représentent aujourd’hui des solutions modernes, robustes et scalables. Mon objectif reste constant : concevoir pour mes clients des applications maintenables, solides et pérennes.',
      isOpen: false,
      iconAlt: 'Stack et excellence technique',
      iconSources: SHARED_IMAGES.icon.physique.sources,
      iconFallback: SHARED_IMAGES.icon.physique.fallbackSrc,
    },
    {
      id: 'architecture',
      title: 'Sécurité Applicative & Architecture',
      content:
        'Monolithe, microservices, architecture hexagonale ou serverless : chaque projet possède des contraintes et des besoins spécifiques. Mon rôle n’est pas seulement de proposer une solution, mais d’identifier la solution la plus adaptée, la plus cohérente et la plus fiable.',
      isOpen: false,
      iconAlt: 'Sécurité applicative et architecture',
      iconSources: SHARED_IMAGES.icon.esoResist.sources,
      iconFallback: SHARED_IMAGES.icon.esoResist.fallbackSrc,
    },
    {
      id: 'opensource',
      title: 'Open Source & Bénévolat',
      content:
        'Plus qu’un métier, le développement est une passion que j’exprime à travers mes contributions open source ainsi que par l’accompagnement de jeunes dans le cadre de missions bénévoles. J’y vois une manière concrète de rendre la technique utile et accessible.',
      isOpen: false,
      iconAlt: 'Open source et bénévolat',
      iconSources: SHARED_IMAGES.icon.fire.sources,
      iconFallback: SHARED_IMAGES.icon.fire.fallbackSrc,
    },
    {
      id: 'quality',
      title: 'Qualité & Responsabilité',
      content:
        'Je m’appuie sur des standards de code rigoureux, une veille technique active et une exigence constante sur la qualité. Cette discipline me permet de rester à jour, de prendre de meilleures décisions techniques et de produire un code propre, fiable et responsable.',
      isOpen: false,
      iconAlt: 'Qualité et responsabilité',
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
