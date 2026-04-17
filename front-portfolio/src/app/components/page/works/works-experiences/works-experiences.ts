import { Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../services/translation.service';
import {
  EXPERIENCES,
  ORGANISM_LOGOS,
  ORGANISM_MONOGRAMS,
  ORGANISM_NAMES,
  Experience,
  OrganismKey,
} from '../works.state';
import { formatDuration, formatPeriod } from '../works.utils';

@Component({
  selector: 'app-works-experiences',
  standalone: true,
  imports: [RevealOnScrollDirective, ResponsivePicture],
  templateUrl: './works-experiences.html',
  styleUrl: './works-experiences.css',
})
export class WorksExperiences {
  protected readonly ts = inject(TranslationService);

  protected readonly experiences = EXPERIENCES;

  protected hasLogo(key: OrganismKey): boolean {
    return Boolean(ORGANISM_LOGOS[key]);
  }

  protected logoSources(key: OrganismKey): ResponsiveSource[] {
    return ORGANISM_LOGOS[key]?.sources ?? [];
  }

  protected logoFallback(key: OrganismKey): string {
    return ORGANISM_LOGOS[key]?.fallbackSrc ?? '';
  }

  protected monogram(key: OrganismKey): string {
    return ORGANISM_MONOGRAMS[key] ?? ORGANISM_NAMES[key].slice(0, 2).toUpperCase();
  }

  protected organismName(key: OrganismKey): string {
    return ORGANISM_NAMES[key];
  }

  /** Titre + description de l'expérience via clés de traduction. */
  protected title(exp: Experience): string {
    return this.ts.translate(`works.xp.${exp.id}.title`);
  }

  protected description(exp: Experience): string {
    return this.ts.translate(`works.xp.${exp.id}.description`);
  }

  protected employmentLabel(exp: Experience): string {
    return this.ts.translate(`works.employment.${exp.employment}`);
  }

  protected sectorLabel(exp: Experience): string {
    return exp.sector ? this.ts.translate(`works.sector.${exp.sector}`) : '';
  }

  protected workModeLabel(exp: Experience): string {
    return this.ts.translate(`works.workMode.${exp.workMode}`);
  }

  /** Une location peut être soit une adresse littérale (ville), soit le slug
   *  `remote` — dans ce cas on utilise la même clé que workMode. */
  protected locationLabel(exp: Experience): string {
    return exp.location === 'remote'
      ? this.ts.translate('works.workMode.remote')
      : exp.location;
  }

  protected period(exp: Experience): string {
    return formatPeriod(
      exp.start,
      exp.end,
      this.ts.lang(),
      this.ts.translate('works.experiences.current')
    );
  }

  protected duration(exp: Experience): string {
    return formatDuration(exp.start, exp.end, this.ts.lang());
  }

  protected paragraphs(text: string): string[] {
    return text.split('\n\n').filter((p) => p.trim().length > 0);
  }

  protected trackById(_idx: number, exp: Experience): string {
    return exp.id;
  }
}
