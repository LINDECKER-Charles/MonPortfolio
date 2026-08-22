import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateContactHoverIn,
  animateContactHoverOut,
  animateContactPress,
  animateContactRelease,
} from './resum-contact-links.animations';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../../directives/play-sound-on-click.directive';
import { TranslationService } from '../../../../../services/translation.service';
import { ResumImages } from '../../../../../img-sources/resum.sources';

@Component({
  selector: 'app-resum-contact-links',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-contact-links.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resum-contact-links.css',
})
export class ResumContactLinks extends ResumEntryAnimation {
  @Input({ required: true }) images!: ResumImages;
  protected readonly ts = inject(TranslationService);
  protected readonly animationSelectors = '.contact-block, .contact-row';
  protected override animationDelay = 0.38;
  protected override animationStagger = 0.04;

  onHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateContactHoverIn);
  }

  onHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateContactHoverOut);
  }

  onPress(event: Event): void {
    this.animateOnEvent(event, animateContactPress);
  }

  onRelease(event: Event): void {
    this.animateOnEvent(event, animateContactRelease);
  }
}
