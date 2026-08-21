import {
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResponsivePicture } from '../responsive-picture/responsive-picture';
import type { LabeledImageSet } from '../../../img-sources/shared.sources';
import { TranslationService } from '../../../services/translation.service';
import { wrapIndex } from '../../../utils/math';

/** Alias sémantique : une diapositive est un set responsive étiqueté. */
export type PhotoCarouselSlide = LabeledImageSet;

@Component({
  selector: 'app-photo-carousel',
  imports: [ResponsivePicture],
  templateUrl: './photo-carousel.html',
  styleUrl: './photo-carousel.css',
})
export class PhotoCarousel implements OnInit, OnDestroy {
  protected readonly ts = inject(TranslationService);

  @Input({ required: true }) slides: PhotoCarouselSlide[] = [];
  @Input() interval = 5000;
  @Input() sizes = '(max-width: 640px) 80vw, (max-width: 1024px) 55vw, 420px';
  @Input() autoplay = true;
  /** En mode `bare`, le carrousel n'applique ni padding ni surface propre :
      il s'intègre dans un cadre fourni par le parent (ex. portrait-card). */
  @Input() bare = false;

  protected readonly currentIndex = signal(0);
  protected readonly running = signal(false);
  private readonly paused = signal(false);
  private timerId: ReturnType<typeof setInterval> | null = null;
  private readonly isBrowser: boolean;

  /** Renvoie [currentIndex()] : clé utilisée par le `@for` du progress bar,
      pour forcer sa recréation (et donc le redémarrage de l'animation CSS)
      à chaque changement de slide. */
  protected readonly progressKey = computed(() => [this.currentIndex()]);

  protected readonly label = computed(() => this.ts.translate('photo-carousel.label'));
  protected readonly previousLabel = computed(() => this.ts.translate('photo-carousel.previous'));
  protected readonly nextLabel = computed(() => this.ts.translate('photo-carousel.next'));
  protected readonly pauseLabel = computed(() => this.ts.translate('photo-carousel.pause'));
  protected readonly playLabel = computed(() => this.ts.translate('photo-carousel.play'));
  protected readonly goToTemplate = computed(() => this.ts.translate('photo-carousel.go_to'));

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  ngOnInit(): void {
    if (this.autoplay) this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  protected isActive(index: number): boolean {
    return this.currentIndex() === index;
  }

  protected isPaused(): boolean {
    return this.paused();
  }

  protected goTo(index: number): void {
    if (!this.slides.length) return;
    this.currentIndex.set(wrapIndex(index, this.slides.length));
    this.restart();
  }

  protected next(): void {
    this.goTo(this.currentIndex() + 1);
  }

  protected previous(): void {
    this.goTo(this.currentIndex() - 1);
  }

  protected togglePause(): void {
    this.paused.update((p) => !p);
    if (this.paused()) {
      this.stop();
    } else {
      this.start();
    }
  }

  protected onMouseEnter(): void {
    if (!this.paused()) this.stop();
  }

  protected onMouseLeave(): void {
    if (!this.paused() && this.autoplay) this.start();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  protected goToSlideLabel(index: number): string {
    return this.goToTemplate().replace('{index}', String(index + 1));
  }

  private start(): void {
    if (!this.isBrowser || !this.autoplay || this.slides.length <= 1) return;
    this.stop();
    this.timerId = setInterval(() => {
      this.currentIndex.update((i) => (i + 1) % this.slides.length);
    }, this.interval);
    this.running.set(true);
  }

  private stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.running.set(false);
  }

  private restart(): void {
    if (this.paused() || !this.autoplay) return;
    this.start();
  }
}
