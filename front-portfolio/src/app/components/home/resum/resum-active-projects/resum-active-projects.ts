import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

@Component({
  selector: 'app-resum-active-projects',
  imports: [ResponsivePicture],
  templateUrl: './resum-active-projects.html',
  styleUrl: './resum-active-projects.css',
})
export class ResumActiveProjects extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.section-title, .project-list li';
  protected override animationDelay = 0.34;
  protected override animationStagger = 0.045;
}
