import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-works-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './works-header.html',
  styleUrl: './works-header.css',
})
export class WorksHeader implements AfterViewInit {
  protected readonly ts = inject(TranslationService);
  @ViewChild('hero') private heroRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) gsap.registerPlugin(CSSPlugin);
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
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );
  }
}
