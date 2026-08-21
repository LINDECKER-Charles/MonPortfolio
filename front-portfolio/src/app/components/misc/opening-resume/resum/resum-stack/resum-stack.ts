import { Component, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import { animateResumRowHoverIn, animateResumRowHoverOut } from '../resum-row-hover.animations';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { ResumImages } from '../../../../../img-sources/resum.sources';

@Component({
  selector: 'app-resum-stack',
  imports: [ResponsivePicture],
  templateUrl: './resum-stack.html',
  styleUrl: '../resum-row.css',
})
export class ResumStack extends ResumEntryAnimation {
  @Input({ required: true }) images!: ResumImages;
  protected readonly animationSelectors = '.row';
  protected override animationDelay = 0.12;

  onRowHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverIn);
  }

  onRowHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverOut);
  }
}
