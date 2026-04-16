import { Component, computed, inject } from '@angular/core';
import {
  HOME_RESUME_ESO_RESIST_FALLBACK,
  HOME_RESUME_ESO_RESIST_SOURCES,
  HOME_RESUME_FIRE_FALLBACK,
  HOME_RESUME_FIRE_SOURCES,
  HOME_RESUME_LEVEL_FALLBACK,
  HOME_RESUME_LEVEL_SOURCES,
  HOME_RESUME_LUCIDITY_FALLBACK,
  HOME_RESUME_LUCIDITY_SOURCES,
  HOME_RESUME_PHOTO_FALLBACK,
  HOME_RESUME_PHOTO_SOURCES,
  HOME_RESUME_PHYSIQUE_FALLBACK,
  HOME_RESUME_PHYSIQUE_SOURCES,
  HOME_RESUME_POUSSE_RES_FALLBACK,
  HOME_RESUME_POUSSE_RES_SOURCES,
  HOME_RESUME_SNIPPETS,
} from './home-resume.state';
import { HomeResumeBanner } from './home-resume-banner/home-resume-banner';
import { HomeResumeHeader } from './home-resume-header/home-resume-header';
import { HomeResumeContent } from './home-resume-content/home-resume-content';
import { TranslationService } from '../../../../services/translation.service';

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
      sources: HOME_RESUME_ESO_RESIST_SOURCES,
      fallbackSrc: HOME_RESUME_ESO_RESIST_FALLBACK,
      alt: this.ts.translate('home-resume.banner.icon.eso-resist'),
    },
    {
      sources: HOME_RESUME_FIRE_SOURCES,
      fallbackSrc: HOME_RESUME_FIRE_FALLBACK,
      alt: this.ts.translate('home-resume.banner.icon.fire'),
    },
  ]);

  protected readonly bannerIconsRight = computed(() => [
    {
      sources: HOME_RESUME_PHYSIQUE_SOURCES,
      fallbackSrc: HOME_RESUME_PHYSIQUE_FALLBACK,
      alt: this.ts.translate('home-resume.banner.icon.physique'),
    },
    {
      sources: HOME_RESUME_POUSSE_RES_SOURCES,
      fallbackSrc: HOME_RESUME_POUSSE_RES_FALLBACK,
      alt: this.ts.translate('home-resume.banner.icon.pousse-res'),
    },
  ]);

  protected readonly photoSources = HOME_RESUME_PHOTO_SOURCES;
  protected readonly photoFallback = HOME_RESUME_PHOTO_FALLBACK;

  protected readonly luciditySources = HOME_RESUME_LUCIDITY_SOURCES;
  protected readonly lucidityFallback = HOME_RESUME_LUCIDITY_FALLBACK;

  protected readonly levelSources = HOME_RESUME_LEVEL_SOURCES;
  protected readonly levelFallback = HOME_RESUME_LEVEL_FALLBACK;

  protected readonly bannerLabel = computed(() =>
    this.ts.translate('home-resume.banner.label')
  );

  protected readonly snippets = HOME_RESUME_SNIPPETS.map((snippet) => ({ ...snippet }));
}
