import { Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../services/translation.service';
import {
  CERTIFICATIONS,
  ORGANISM_LOGOS,
  ORGANISM_NAMES,
  Certification,
  OrganismKey,
} from '../works.state';
import { formatMonthYear } from '../works.utils';

@Component({
  selector: 'app-works-certifications',
  standalone: true,
  imports: [RevealOnScrollDirective, ResponsivePicture],
  templateUrl: './works-certifications.html',
  styleUrl: './works-certifications.css',
})
export class WorksCertifications {
  protected readonly ts = inject(TranslationService);

  protected readonly certifications = CERTIFICATIONS;

  protected logoSources(key: OrganismKey): ResponsiveSource[] {
    return ORGANISM_LOGOS[key]?.sources ?? [];
  }

  protected logoFallback(key: OrganismKey): string {
    return ORGANISM_LOGOS[key]?.fallbackSrc ?? '';
  }

  protected organismName(key: OrganismKey): string {
    return ORGANISM_NAMES[key];
  }

  protected issuedAt(cert: Certification): string {
    return formatMonthYear(cert.issuedAt, this.ts.lang());
  }

  protected trackById(_idx: number, cert: Certification): string {
    return cert.id;
  }
}
