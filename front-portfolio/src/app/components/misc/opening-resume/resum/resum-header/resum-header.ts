import { Component, inject, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import { animateResumRowHoverIn, animateResumRowHoverOut } from '../resum-row-hover.animations';
import {
  animateResumTitleHoverIn,
  animateResumTitleHoverOut,
  animateResumTitlePress,
  animateResumTitleRelease,
} from './resum-header.animations';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../../directives/play-sound-on-click.directive';
import { TranslationService } from '../../../../../services/translation.service';
import { ResumImages } from '../../../../../img-sources/resum.sources';

@Component({
  selector: 'app-resum-header',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-header.html',
  styleUrls: ['../resum-row.css', './resum-header.css'],
})
export class ResumHeader extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) images!: ResumImages;
  protected readonly animationSelectors = '.title, .row';
  protected override animationDelay = 0.05;

  onRowHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverIn);
  }

  onRowHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverOut);
  }

  onTitleHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateResumTitleHoverIn);
  }

  onTitleHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateResumTitleHoverOut);
  }

  onTitlePress(event: Event): void {
    this.animateOnEvent(event, animateResumTitlePress);
  }

  onTitleRelease(event: Event): void {
    this.animateOnEvent(event, animateResumTitleRelease);
  }
}
