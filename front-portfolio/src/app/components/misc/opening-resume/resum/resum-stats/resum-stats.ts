import { Component, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateResumRowHoverIn,
  animateResumRowHoverOut,
} from '../resum-row-hover.animations';
import {ResponsivePicture} from '../../../../assets/responsive-picture/responsive-picture';

@Component({
  selector: 'app-resum-stats',
  imports: [ResponsivePicture],
  templateUrl: './resum-stats.html',
  styleUrl: './resum-stats.css',
})
export class ResumStats extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.row';
  protected override animationDelay = 0.18;

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
}
