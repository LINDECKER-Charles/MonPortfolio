import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../services/translation.service';
import {
  Education,
  Experience,
  ORGANISM_LOGOS,
  ORGANISM_MONOGRAMS,
  ORGANISM_NAMES,
  OrganismKey,
  TimelineOrder,
  TimelineRow,
  TimelineScope,
  buildTimeline,
  timelineCounts,
} from '../works.state';
import { formatDuration, formatPeriod } from '../works.utils';

/**
 * Timeline unifiée : expériences + formations posées sur un même axe gravé,
 * regroupées par marqueurs d'année. Le tri (récent / ancien) est piloté par
 * un signal et recompose la liste de lignes via buildTimeline().
 */
@Component({
  selector: 'app-works-timeline',
  standalone: true,
  imports: [RevealOnScrollDirective, ResponsivePicture],
  templateUrl: './works-timeline.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './works-timeline.css',
})
export class WorksTimeline {
  protected readonly ts = inject(TranslationService);

  protected readonly order = signal<TimelineOrder>('recent');
  protected readonly scope = signal<TimelineScope>('all');
  protected readonly scopes: TimelineScope[] = ['all', 'pro', 'volunteer'];
  protected readonly counts = timelineCounts();

  protected readonly rows = computed<TimelineRow[]>(() =>
    buildTimeline(this.order(), this.scope()),
  );

  protected setOrder(order: TimelineOrder): void {
    this.order.set(order);
  }

  protected setScope(scope: TimelineScope): void {
    this.scope.set(scope);
  }

  protected scopeLabel(scope: TimelineScope): string {
    const key = scope === 'all' ? 'scopeAll' : scope === 'pro' ? 'scopePro' : 'scopeVolunteer';
    return this.ts.translate(`works.timeline.${key}`);
  }

  protected scopeCount(scope: TimelineScope): number {
    return this.counts[scope];
  }

  /* ── Organisme (logo / monogramme / nom) ──────────────────────────────── */

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

  /* ── Expérience ───────────────────────────────────────────────────────── */

  protected xpTitle(exp: Experience): string {
    return this.ts.translate(`works.xp.${exp.id}.title`);
  }

  protected xpDescription(exp: Experience): string {
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

  /** `remote` est un slug ⇒ même clé que workMode ; sinon adresse littérale. */
  protected locationLabel(exp: Experience): string {
    return exp.location === 'remote' ? this.ts.translate('works.workMode.remote') : exp.location;
  }

  protected xpPeriod(exp: Experience): string {
    return formatPeriod(
      exp.start,
      exp.end,
      this.ts.lang(),
      this.ts.translate('works.experiences.current'),
    );
  }

  protected xpDuration(exp: Experience): string {
    return formatDuration(exp.start, exp.end, this.ts.lang());
  }

  protected paragraphs(text: string): string[] {
    return text.split('\n\n').filter((p) => p.trim().length > 0);
  }

  /* ── Formation ────────────────────────────────────────────────────────── */

  protected eduTitle(edu: Education): string {
    return this.ts.translate(`works.edu.${edu.id}.title`);
  }

  protected eduSubtitle(edu: Education): string {
    return this.ts.translate(`works.edu.${edu.id}.subtitle`);
  }

  protected eduPeriod(edu: Education): string {
    return formatPeriod(edu.start, edu.end, this.ts.lang(), '');
  }

  protected trackRow(_idx: number, row: TimelineRow): string {
    if (row.type === 'year') return `y-${row.year}`;
    return row.node.kind === 'experience' ? `e-${row.node.exp.id}` : `f-${row.node.edu.id}`;
  }
}
