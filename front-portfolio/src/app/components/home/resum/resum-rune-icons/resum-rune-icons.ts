import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

@Component({
  selector: 'app-resum-rune-icons',
  imports: [ResponsivePicture],
  templateUrl: './resum-rune-icons.html',
  styleUrl: './resum-rune-icons.css',
})
export class ResumRuneIcons extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.rune';
  protected override animationDelay = 0.2;
  protected override animationStagger = 0.05;
}
