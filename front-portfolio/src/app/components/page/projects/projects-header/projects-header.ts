import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../services/translation.service';
import { revealHero } from '../../shared/hero-reveal';

@Component({
  selector: 'app-projects-header',
  imports: [RouterLink],
  templateUrl: './projects-header.html',
  styleUrl: './projects-header.css',
})
export class ProjectsHeader implements AfterViewInit {
  protected readonly ts = inject(TranslationService);
  @ViewChild('hero') private heroRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.heroRef?.nativeElement) return;

    revealHero(this.heroRef.nativeElement, 0.72);
  }
}
