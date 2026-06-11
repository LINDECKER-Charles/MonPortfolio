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
import { TranslationService } from '../../../../services/translation.service';
import { revealHero } from '../../shared/hero-reveal';
import { computeStats } from '../works.state';

@Component({
  selector: 'app-works-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './works-header.html',
  styleUrl: './works-header.css',
})
export class WorksHeader implements AfterViewInit {
  protected readonly ts = inject(TranslationService);
  protected readonly stats = computeStats();
  @ViewChild('hero') private heroRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.heroRef?.nativeElement) return;

    revealHero(this.heroRef.nativeElement, 0.8);
  }
}
