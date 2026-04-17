import { Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../services/translation.service';
import {
  EDUCATIONS,
  ORGANISM_LOGOS,
  ORGANISM_NAMES,
  Education,
  OrganismKey,
} from '../works.state';
import { formatPeriod } from '../works.utils';

@Component({
  selector: 'app-works-education',
  standalone: true,
  imports: [RevealOnScrollDirective, ResponsivePicture],
  templateUrl: './works-education.html',
  styleUrl: './works-education.css',
})
export class WorksEducation {
  protected readonly ts = inject(TranslationService);

  protected readonly educations = EDUCATIONS;

  protected logoSources(key: OrganismKey): ResponsiveSource[] {
    return ORGANISM_LOGOS[key]?.sources ?? [];
  }

  protected logoFallback(key: OrganismKey): string {
    return ORGANISM_LOGOS[key]?.fallbackSrc ?? '';
  }

  protected organismName(key: OrganismKey): string {
    return ORGANISM_NAMES[key];
  }

  protected title(edu: Education): string {
    return this.ts.translate(`works.edu.${edu.id}.title`);
  }

  protected subtitle(edu: Education): string {
    return this.ts.translate(`works.edu.${edu.id}.subtitle`);
  }

  protected period(edu: Education): string {
    return formatPeriod(edu.start, edu.end, this.ts.lang(), '');
  }

  protected endYear(edu: Education): string {
    return edu.end.slice(0, 4);
  }

  protected trackById(_idx: number, edu: Education): string {
    return edu.id;
  }
}
