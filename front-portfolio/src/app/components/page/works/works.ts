import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WorksHeader } from './works-header/works-header';
import { WorksTimeline } from './works-timeline/works-timeline';
import { WorksCertifications } from './works-certifications/works-certifications';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [WorksHeader, WorksTimeline, WorksCertifications],
  templateUrl: './works.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './works.css',
})
export class Works {}
