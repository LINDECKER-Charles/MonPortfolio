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
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';
import { TranslatePipe } from '../../../../../pipes/translate.pipe';

@Component({
  selector: 'app-home-resume-header',
  imports: [TranslatePipe, CommonModule, RouterLink, ResponsivePicture],
  templateUrl: './home-resume-header.html',
  styleUrl: './home-resume-header.css',
})
export class HomeResumeHeader implements AfterViewInit {
  @Input({ required: true }) luciditySources: ResponsiveSource[] = [];
  @Input({ required: true }) lucidityFallback = '';
  @Input({ required: true }) levelSources: ResponsiveSource[] = [];
  @Input({ required: true }) levelFallback = '';

  @ViewChild('hero') private heroRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.heroRef?.nativeElement) return;

    gsap.fromTo(
      this.heroRef.nativeElement,
      { autoAlpha: 0, y: 24, filter: 'blur(10px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );
  }
}
