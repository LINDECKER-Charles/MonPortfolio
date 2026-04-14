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
import {ResponsivePicture, ResponsiveSource} from '../../../../../assets/responsive-picture/responsive-picture';
import { TranslatePipe } from '../../../../../../pipes/translate.pipe';

@Component({
  selector: 'app-home-resume-photo',
  imports: [TranslatePipe, CommonModule, ResponsivePicture],
  templateUrl: './home-resume-photo.html',
  styleUrl: './home-resume-photo.css',
})
export class HomeResumePhoto implements AfterViewInit {
  @Input({ required: true }) photoSources: ResponsiveSource[] = [];
  @Input({ required: true }) photoFallback = '';

  @ViewChild('portraitBlock') private portraitBlockRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.portraitBlockRef?.nativeElement) return;

    gsap.fromTo(
      this.portraitBlockRef.nativeElement,
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