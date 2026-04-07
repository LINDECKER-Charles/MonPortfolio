import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../directives/play-sound-on-click.directive';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateContactHoverIn,
  animateContactHoverOut,
  animateContactPress,
  animateContactRelease,
} from './resum-contact-links.animations';

@Component({
  selector: 'app-resum-contact-links',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-contact-links.html',
  styleUrl: './resum-contact-links.css',
})
export class ResumContactLinks extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.contact-block, .contact-row';
  protected override animationDelay = 0.38;
  protected override animationStagger = 0.04;

  onHoverEnter(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateContactHoverIn(row);
  }

  onHoverLeave(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateContactHoverOut(row);
  }

  onPress(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateContactPress(row);
  }

  onRelease(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateContactRelease(row);
  }
}
