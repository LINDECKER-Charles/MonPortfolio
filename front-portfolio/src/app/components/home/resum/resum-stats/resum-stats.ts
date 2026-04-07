import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

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
}
