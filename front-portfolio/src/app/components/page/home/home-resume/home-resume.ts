import { Component, computed, inject } from '@angular/core';
import { HomeResumeBanner } from './home-resume-banner/home-resume-banner';
import { HomeResumeHeader } from './home-resume-header/home-resume-header';
import { HomeResumeContent } from './home-resume-content/home-resume-content';
import { PhotoCarouselSlide } from '../../../assets/photo-carousel/photo-carousel';
import { TranslationService } from '../../../../services/translation.service';
import { SHARED_IMAGES } from '../../../../img-sources/shared.sources';

@Component({
  selector: 'app-home-resume',
  imports: [HomeResumeBanner, HomeResumeHeader, HomeResumeContent],
  templateUrl: './home-resume.html',
  styleUrl: './home-resume.css',
})
export class HomeResume {
  private readonly ts = inject(TranslationService);

  protected readonly bannerIconsLeft = computed(() => [
    {
      sources: SHARED_IMAGES.icon.esoResist.sources,
      fallbackSrc: SHARED_IMAGES.icon.esoResist.fallbackSrc,
      alt: this.ts.translate('home-resume.banner.icon.eso-resist'),
    },
    {
      sources: SHARED_IMAGES.icon.fire.sources,
      fallbackSrc: SHARED_IMAGES.icon.fire.fallbackSrc,
      alt: this.ts.translate('home-resume.banner.icon.fire'),
    },
  ]);

  protected readonly bannerIconsRight = computed(() => [
    {
      sources: SHARED_IMAGES.icon.physique.sources,
      fallbackSrc: SHARED_IMAGES.icon.physique.fallbackSrc,
      alt: this.ts.translate('home-resume.banner.icon.physique'),
    },
    {
      sources: SHARED_IMAGES.icon.pousseRes.sources,
      fallbackSrc: SHARED_IMAGES.icon.pousseRes.fallbackSrc,
      alt: this.ts.translate('home-resume.banner.icon.pousse-res'),
    },
  ]);

  protected readonly photoSlides = computed<PhotoCarouselSlide[]>(() =>
    SHARED_IMAGES.photo.meCarousel.map((set, i) => ({
      sources: set.sources,
      fallbackSrc: set.fallbackSrc,
      alt: this.ts.translate('photo-carousel.slide_alt').replace('{index}', String(i + 1)),
    })),
  );

  protected readonly luciditySources = SHARED_IMAGES.icon.lucidity.sources;
  protected readonly lucidityFallback = SHARED_IMAGES.icon.lucidity.fallbackSrc;

  protected readonly levelSources = SHARED_IMAGES.icon.level.sources;
  protected readonly levelFallback = SHARED_IMAGES.icon.level.fallbackSrc;

  protected readonly bannerLabel = computed(() => this.ts.translate('home-resume.banner.label'));
}
