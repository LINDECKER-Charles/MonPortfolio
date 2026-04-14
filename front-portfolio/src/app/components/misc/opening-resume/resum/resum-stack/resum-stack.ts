import { Component, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateResumRowHoverIn,
  animateResumRowHoverOut,
} from '../resum-row-hover.animations';
import {ResponsivePicture} from '../../../../assets/responsive-picture/responsive-picture';

@Component({
  selector: 'app-resum-stack',
  imports: [ResponsivePicture],
  templateUrl: './resum-stack.html',
  styleUrl: './resum-stack.css',
})
export class ResumStack extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.row';
  protected override animationDelay = 0.12;

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
