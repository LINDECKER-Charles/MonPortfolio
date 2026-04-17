import { Component } from '@angular/core';
import { WorksHeader } from './works-header/works-header';
import { WorksExperiences } from './works-experiences/works-experiences';
import { WorksEducation } from './works-education/works-education';
import { WorksCertifications } from './works-certifications/works-certifications';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [WorksHeader, WorksExperiences, WorksEducation, WorksCertifications],
  templateUrl: './works.html',
  styleUrl: './works.css',
})
export class Works {}
