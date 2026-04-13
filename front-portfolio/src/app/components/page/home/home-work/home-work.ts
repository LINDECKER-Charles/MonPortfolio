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

interface WorkIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-home-work',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-work.html',
  styleUrl: './home-work.css',
})
export class HomeWork implements AfterViewInit {
  @ViewChild('ctaBlock') private ctaBlockRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  protected readonly workIcon = this.buildMainIconSet('strenght', 'Parcours professionnel');
  protected readonly linkedinIcon = this.buildStackIconSet('linkedin', 'LinkedIn');

  protected readonly railIcons: WorkIconSet[] = [
    this.buildStackIconSet('symfony', 'Symfony'),
    this.buildStackIconSet('postgre', 'PostgreSQL'),
    this.buildStackIconSet('python', 'Python'),
    this.buildStackIconSet('github', 'GitHub'),
  ];

  private buildMainIconSet(name: string, alt: string): WorkIconSet {
    return {
      alt,
      sources: [
        { src: `/icon/24x24_${name}.webp`, maxWidth: 320, type: 'image/webp' },
        { src: `/icon/40x40_${name}.webp`, maxWidth: 480, type: 'image/webp' },
        { src: `/icon/80x80_${name}.webp`, maxWidth: 768, type: 'image/webp' },
        { src: `/icon/160x160_${name}.webp`, maxWidth: 1200, type: 'image/webp' },
        { src: `/icon/${name}.webp`, type: 'image/webp' },
      ],
      fallback: `/icon/${name}.webp`,
    };
  }

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
      '.home-work__intro, .home-work__actions, .home-work__rail-item'
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

  private buildStackIconSet(name: string, alt: string): WorkIconSet {
    return {
      alt,
      sources: [
        { src: `/icon/stack/24x24_${name}.webp`, maxWidth: 320, type: 'image/webp' },
        { src: `/icon/stack/40x40_${name}.webp`, maxWidth: 480, type: 'image/webp' },
        { src: `/icon/stack/80x80_${name}.webp`, maxWidth: 768, type: 'image/webp' },
        { src: `/icon/stack/160x160_${name}.webp`, maxWidth: 1200, type: 'image/webp' },
        { src: `/icon/stack/${name}.webp`, type: 'image/webp' },
      ],
      fallback: `/icon/stack/${name}.webp`,
    };
  }
}
