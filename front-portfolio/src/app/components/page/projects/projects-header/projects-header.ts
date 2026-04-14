import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-projects-header',
  imports: [TranslatePipe],
  templateUrl: './projects-header.html',
  styleUrl: './projects-header.css',
})
export class ProjectsHeader implements AfterViewInit {
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
      { autoAlpha: 0, y: 28, filter: 'blur(12px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.72,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );
  }
}
