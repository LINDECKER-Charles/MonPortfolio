import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

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
}
