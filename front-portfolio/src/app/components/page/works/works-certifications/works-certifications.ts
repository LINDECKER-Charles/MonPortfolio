import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../services/translation.service';
import {
  CERTIFICATIONS,
  CERT_CATEGORIES,
  CERT_CATEGORY_ORDER,
  CertCategory,
  Certification,
  ORGANISM_LOGOS,
  ORGANISM_NAMES,
  OrganismKey,
} from '../works.state';
import { formatMonthYear } from '../works.utils';

type Filter = CertCategory | 'all';

/**
 * Rail des sceaux (certifications) — liste compacte filtrable par catégorie.
 * Conçu pour être posé en colonne sticky à droite de la timeline.
 */
@Component({
  selector: 'app-works-certifications',
  standalone: true,
  imports: [RevealOnScrollDirective, ResponsivePicture, NgTemplateOutlet],
  templateUrl: './works-certifications.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './works-certifications.css',
})
export class WorksCertifications {
  protected readonly ts = inject(TranslationService);

  protected readonly categories = CERT_CATEGORY_ORDER;
  protected readonly total = CERTIFICATIONS.length;

  protected readonly activeFilter = signal<Filter>('all');

  /** Nombre de certifs par filtre (calculé une fois, données statiques). */
  private readonly counts = ((): Record<Filter, number> => {
    const map = { all: CERTIFICATIONS.length } as Record<Filter, number>;
    for (const cat of CERT_CATEGORY_ORDER) map[cat] = 0;
    for (const cert of CERTIFICATIONS) map[cert.category] += 1;
    return map;
  })();

  protected readonly visible = computed<Certification[]>(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((cert) => cert.category === filter);
  });

  protected setFilter(filter: Filter): void {
    this.activeFilter.set(filter);
  }

  protected count(filter: Filter): number {
    return this.counts[filter];
  }

  protected glyph(cat: CertCategory): string {
    return CERT_CATEGORIES[cat].glyph;
  }

  protected categoryLabel(cat: CertCategory): string {
    return this.ts.translate(`works.certifications.category.${cat}`);
  }

  protected logoSources(key: OrganismKey): ResponsiveSource[] {
    return ORGANISM_LOGOS[key]?.sources ?? [];
  }

  protected logoFallback(key: OrganismKey): string {
    return ORGANISM_LOGOS[key]?.fallbackSrc ?? '';
  }

  protected organismName(key: OrganismKey): string {
    return ORGANISM_NAMES[key];
  }

  protected issuedYear(cert: Certification): string {
    return cert.issuedAt.slice(0, 4);
  }

  protected issuedAt(cert: Certification): string {
    return formatMonthYear(cert.issuedAt, this.ts.lang());
  }

  protected trackById(_idx: number, cert: Certification): string {
    return cert.id;
  }
}
