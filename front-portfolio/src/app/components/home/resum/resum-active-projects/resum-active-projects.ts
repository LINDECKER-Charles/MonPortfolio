import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../directives/play-sound-on-click.directive';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateProjectHoverIn,
  animateProjectHoverOut,
  animateProjectPress,
  animateProjectRelease,
} from './resum-active-projects.animations';

@Component({
  selector: 'app-resum-active-projects',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-active-projects.html',
  styleUrl: './resum-active-projects.css',
})
export class ResumActiveProjects extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.section-title, .project-list li';
  protected override animationDelay = 0.34;
  protected override animationStagger = 0.045;

  onProjectHoverEnter(event: Event): void {
    if (!this.isBrowser) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateProjectHoverIn(link);
  }

  onProjectHoverLeave(event: Event): void {
    if (!this.isBrowser) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateProjectHoverOut(link);
  }

  onProjectPress(event: Event): void {
    if (!this.isBrowser) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateProjectPress(link);
  }

  onProjectRelease(event: Event): void {
    if (!this.isBrowser) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateProjectRelease(link);
  }
}
