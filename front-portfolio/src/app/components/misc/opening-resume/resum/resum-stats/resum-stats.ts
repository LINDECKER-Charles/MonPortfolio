import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import { animateResumRowHoverIn, animateResumRowHoverOut } from '../resum-row-hover.animations';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../../services/translation.service';
import { ResumImages } from '../../../../../img-sources/resum.sources';

@Component({
  selector: 'app-resum-stats',
  imports: [ResponsivePicture],
  templateUrl: './resum-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../resum-row.css',
})
export class ResumStats extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) images!: ResumImages;
  protected readonly animationSelectors = '.row';
  protected override animationDelay = 0.18;

  onRowHoverEnter(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverIn);
  }

  onRowHoverLeave(event: Event): void {
    this.animateOnEvent(event, animateResumRowHoverOut);
  }
}
