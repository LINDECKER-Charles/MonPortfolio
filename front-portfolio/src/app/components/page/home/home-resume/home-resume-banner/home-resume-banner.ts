import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import type { LabeledImageSet } from '../../../../../img-sources/shared.sources';

@Component({
  selector: 'app-home-resume-banner',
  imports: [ResponsivePicture],
  templateUrl: './home-resume-banner.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-resume-banner.css',
})
export class HomeResumeBanner {
  @Input({ required: true }) leftIcons: LabeledImageSet[] = [];
  @Input({ required: true }) rightIcons: LabeledImageSet[] = [];
  @Input({ required: true }) label = '';
}
