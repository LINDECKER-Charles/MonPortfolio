import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

@Component({
  selector: 'app-resum-contact-links',
  imports: [ResponsivePicture],
  templateUrl: './resum-contact-links.html',
  styleUrl: './resum-contact-links.css',
})
export class ResumContactLinks extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.contact-block, .contact-row';
  protected override animationDelay = 0.38;
  protected override animationStagger = 0.04;
}
