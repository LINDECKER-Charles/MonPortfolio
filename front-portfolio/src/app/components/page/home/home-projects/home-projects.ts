import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../img-sources/shared.sources';

interface CtaIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-home-projects',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-projects.html',
  styleUrl: './home-projects.css',
})
export class HomeProjects implements AfterViewInit {
  @ViewChild('ctaBlock') private ctaBlockRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  protected readonly projectsIcon: CtaIconSet = {
    alt: 'Explorer les projets',
    sources: SHARED_IMAGES.icon.discover.sources,
    fallback: SHARED_IMAGES.icon.discover.fallbackSrc,
  };
  protected readonly githubIcon: CtaIconSet = {
    alt: 'GitHub',
    sources: SHARED_IMAGES.stack.github.sources,
    fallback: SHARED_IMAGES.stack.github.fallbackSrc,
  };

  protected readonly stackIcons: CtaIconSet[] = [
    { alt: '.NET', sources: SHARED_IMAGES.stack.dotnet.sources, fallback: SHARED_IMAGES.stack.dotnet.fallbackSrc },
    { alt: 'Angular', sources: SHARED_IMAGES.stack.angular.sources, fallback: SHARED_IMAGES.stack.angular.fallbackSrc },
    { alt: 'Symfony', sources: SHARED_IMAGES.stack.symfony.sources, fallback: SHARED_IMAGES.stack.symfony.fallbackSrc },
    { alt: 'PostgreSQL', sources: SHARED_IMAGES.stack.postgre.sources, fallback: SHARED_IMAGES.stack.postgre.fallbackSrc },
    { alt: 'Python', sources: SHARED_IMAGES.stack.python.sources, fallback: SHARED_IMAGES.stack.python.fallbackSrc },
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.ctaBlockRef?.nativeElement) return;

    const root = this.ctaBlockRef.nativeElement;
    const targets = root.querySelectorAll(
      '.home-projects__intro, .home-projects__actions, .home-projects__stack-item'
    );

    gsap.set(targets, {
      autoAlpha: 0,
      y: 20,
      filter: 'blur(8px)',
    });

    gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.08,
      clearProps: 'filter',
    });
  }
}
