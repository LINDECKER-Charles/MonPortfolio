import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { labeled, LabeledImageSet, SHARED_IMAGES } from '../../../../img-sources/shared.sources';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-home-work',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-work.html',
  styleUrl: './home-work.css',
})
export class HomeWork {
  protected readonly ts = inject(TranslationService);

  protected readonly workIcon = labeled(SHARED_IMAGES.icon.strenght, 'Parcours professionnel');
  protected readonly linkedinIcon = labeled(SHARED_IMAGES.stack.linkedin, 'LinkedIn');

  protected readonly railIcons: LabeledImageSet[] = [
    labeled(SHARED_IMAGES.stack.symfony, 'Symfony'),
    labeled(SHARED_IMAGES.stack.postgre, 'PostgreSQL'),
    labeled(SHARED_IMAGES.stack.python, 'Python'),
    labeled(SHARED_IMAGES.stack.github, 'GitHub'),
  ];
}
