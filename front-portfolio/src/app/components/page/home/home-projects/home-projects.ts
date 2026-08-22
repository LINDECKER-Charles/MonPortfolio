import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { LanternLightDirective } from '../../../../directives/lantern-light.directive';
import { labeled, LabeledImageSet, SHARED_IMAGES } from '../../../../img-sources/shared.sources';
import { TranslationService } from '../../../../services/translation.service';
import { HomeProjectsRelics } from './home-projects-relics/home-projects-relics';

@Component({
  selector: 'app-home-projects',
  imports: [RouterLink, ResponsivePicture, LanternLightDirective, HomeProjectsRelics],
  templateUrl: './home-projects.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-projects.css',
})
export class HomeProjects {
  protected readonly ts = inject(TranslationService);

  protected readonly projectsIcon = labeled(SHARED_IMAGES.icon.discover, 'Explorer les projets');
  protected readonly githubIcon = labeled(SHARED_IMAGES.stack.github, 'GitHub');

  protected readonly stackIcons: LabeledImageSet[] = [
    labeled(SHARED_IMAGES.stack.dotnet, '.NET'),
    labeled(SHARED_IMAGES.stack.angular, 'Angular'),
    labeled(SHARED_IMAGES.stack.symfony, 'Symfony'),
    labeled(SHARED_IMAGES.stack.postgre, 'PostgreSQL'),
    labeled(SHARED_IMAGES.stack.python, 'Python'),
  ];
}
