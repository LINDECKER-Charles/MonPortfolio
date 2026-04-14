import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';

interface BannerIcon {
  sources: ResponsiveSource[];
  fallbackSrc: string;
  alt: string;
}

@Component({
  selector: 'app-home-resume-banner',
  imports: [CommonModule, ResponsivePicture],
  templateUrl: './home-resume-banner.html',
  styleUrl: './home-resume-banner.css',
})
export class HomeResumeBanner implements AfterViewInit {
  @Input({ required: true }) leftIcons: BannerIcon[] = [];
  @Input({ required: true }) rightIcons: BannerIcon[] = [];
  @Input({ required: true }) label = '';

  @ViewChild('banner') private bannerRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.bannerRef?.nativeElement) return;

    gsap.fromTo(
      this.bannerRef.nativeElement,
      { autoAlpha: 0, y: 20, filter: 'blur(10px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );
  }
}
