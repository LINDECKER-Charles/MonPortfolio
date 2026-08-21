import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../img-sources/shared.sources';
import { TranslationService } from '../../../../services/translation.service';

interface CtaIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-home-projects',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-projects.html',
  styleUrl: './home-projects.css',
})
export class HomeProjects {
  protected readonly ts = inject(TranslationService);

  protected readonly projectsIcon: CtaIconSet = {
    alt: 'Explorer les projets',
    sources: SHARED_IMAGES.icon.discover.sources,
    fallback: SHARED_IMAGES.icon.discover.fallbackSrc,
  };
  protected readonly githubIcon: CtaIconSet = {
    alt: 'GitHub',
    sources: SHARED_IMAGES.stack.github.sources,
    fallback: SHARED_IMAGES.stack.github.fallbackSrc,
  };

  protected readonly stackIcons: CtaIconSet[] = [
    {
      alt: '.NET',
      sources: SHARED_IMAGES.stack.dotnet.sources,
      fallback: SHARED_IMAGES.stack.dotnet.fallbackSrc,
    },
    {
      alt: 'Angular',
      sources: SHARED_IMAGES.stack.angular.sources,
      fallback: SHARED_IMAGES.stack.angular.fallbackSrc,
    },
    {
      alt: 'Symfony',
      sources: SHARED_IMAGES.stack.symfony.sources,
      fallback: SHARED_IMAGES.stack.symfony.fallbackSrc,
    },
    {
      alt: 'PostgreSQL',
      sources: SHARED_IMAGES.stack.postgre.sources,
      fallback: SHARED_IMAGES.stack.postgre.fallbackSrc,
    },
    {
      alt: 'Python',
      sources: SHARED_IMAGES.stack.python.sources,
      fallback: SHARED_IMAGES.stack.python.fallbackSrc,
    },
  ];
}
