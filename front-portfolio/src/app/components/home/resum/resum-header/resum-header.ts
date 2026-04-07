import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateResumRowHoverIn,
  animateResumRowHoverOut,
} from '../resum-row-hover.animations';

@Component({
  selector: 'app-resum-header',
  imports: [ResponsivePicture],
  templateUrl: './resum-header.html',
  styleUrl: './resum-header.css',
})
export class ResumHeader extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.title, .row';
  protected override animationDelay = 0.05;

  onRowHoverEnter(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateResumRowHoverIn(row);
  }

  onRowHoverLeave(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    animateResumRowHoverOut(row);
  }
}
