import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { TranslationService } from '../../../services/translation.service';

type PillarIcon = 'roadmap' | 'craft' | 'launch';

@Component({
  selector: 'app-construction-state',
  imports: [CommonModule, RouterLink],
  templateUrl: './construction-state.html',
  styleUrl: './construction-state.css',
})
export class ConstructionState implements AfterViewInit {
  protected readonly ts = inject(TranslationService);

  @ViewChild('panel') private panelRef?: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      gsap.registerPlugin(CSSPlugin);
    }
  }

  protected readonly pillarIcons: PillarIcon[] = ['roadmap', 'craft', 'launch'];

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.panelRef?.nativeElement) return;

    const root = this.panelRef.nativeElement;

    gsap.fromTo(
      root,
      { autoAlpha: 0, y: 36, filter: 'blur(14px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.78,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );

    gsap.fromTo(
      root.querySelectorAll(
        '.construction__badge, .construction__icon, .construction__copy, .construction__actions, .construction__card, .construction__status'
      ),
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.14,
      }
    );
  }
}
