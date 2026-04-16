import { Component, inject, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateResumRowHoverIn,
  animateResumRowHoverOut,
} from '../resum-row-hover.animations';
import {
  animateResumTitleHoverIn,
  animateResumTitleHoverOut,
  animateResumTitlePress,
  animateResumTitleRelease,
} from './resum-header.animations';
import {ResponsivePicture} from '../../../../assets/responsive-picture/responsive-picture';
import {PlaySoundOnClickDirective} from '../../../../../directives/play-sound-on-click.directive';
import { TranslationService } from '../../../../../services/translation.service';

@Component({
  selector: 'app-resum-header',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-header.html',
  styleUrl: './resum-header.css',
})
export class ResumHeader extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.title, .row';
  protected override animationDelay = 0.05;

  onRowHoverEnter(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateResumRowHoverIn(row);
  }

  onRowHoverLeave(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateResumRowHoverOut(row);
  }

  onTitleHoverEnter(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateResumTitleHoverIn(link);
  }

  onTitleHoverLeave(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateResumTitleHoverOut(link);
  }

  onTitlePress(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateResumTitlePress(link);
  }

  onTitleRelease(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const link = event.currentTarget as HTMLElement | null;
    if (!link) return;

    animateResumTitleRelease(link);
  }
}
