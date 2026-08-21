import { Component, inject, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateProjectHoverIn,
  animateProjectHoverOut,
  animateProjectPress,
  animateProjectRelease,
} from './resum-active-projects.animations';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../../directives/play-sound-on-click.directive';
import { TranslationService } from '../../../../../services/translation.service';
import { ResumImages } from '../../../../../img-sources/resum.sources';

@Component({
  selector: 'app-resum-active-projects',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-active-projects.html',
  styleUrl: './resum-active-projects.css',
})
export class ResumActiveProjects extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) images!: ResumImages;
  protected readonly animationSelectors = '.section-title, .project-list li';
  protected override animationDelay = 0.34;
  protected override animationStagger = 0.045;

  onProjectHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateProjectHoverIn);
  }

  onProjectHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateProjectHoverOut);
  }

  onProjectPress(event: Event): void {
    this.animateOnEvent(event, animateProjectPress);
  }

  onProjectRelease(event: Event): void {
    this.animateOnEvent(event, animateProjectRelease);
  }
}
