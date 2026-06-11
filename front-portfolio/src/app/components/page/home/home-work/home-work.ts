import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../img-sources/shared.sources';
import { TranslationService } from '../../../../services/translation.service';

interface WorkIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-home-work',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-work.html',
  styleUrl: './home-work.css',
})
export class HomeWork {
  protected readonly ts = inject(TranslationService);

  protected readonly workIcon: WorkIconSet = {
    alt: 'Parcours professionnel',
    sources: SHARED_IMAGES.icon.strenght.sources,
    fallback: SHARED_IMAGES.icon.strenght.fallbackSrc,
  };
  protected readonly linkedinIcon: WorkIconSet = {
    alt: 'LinkedIn',
    sources: SHARED_IMAGES.stack.linkedin.sources,
    fallback: SHARED_IMAGES.stack.linkedin.fallbackSrc,
  };

  protected readonly railIcons: WorkIconSet[] = [
    { alt: 'Symfony', sources: SHARED_IMAGES.stack.symfony.sources, fallback: SHARED_IMAGES.stack.symfony.fallbackSrc },
    { alt: 'PostgreSQL', sources: SHARED_IMAGES.stack.postgre.sources, fallback: SHARED_IMAGES.stack.postgre.fallbackSrc },
    { alt: 'Python', sources: SHARED_IMAGES.stack.python.sources, fallback: SHARED_IMAGES.stack.python.fallbackSrc },
    { alt: 'GitHub', sources: SHARED_IMAGES.stack.github.sources, fallback: SHARED_IMAGES.stack.github.fallbackSrc },
  ];
}
