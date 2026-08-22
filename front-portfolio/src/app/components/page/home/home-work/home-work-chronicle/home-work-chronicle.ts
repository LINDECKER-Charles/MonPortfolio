import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import type { ResponsiveImageSet } from '../../../../../img-sources/shared.sources';
import { TranslationService } from '../../../../../services/translation.service';
import {
  EXPERIENCES,
  ORGANISM_LOGOS,
  ORGANISM_MONOGRAMS,
  ORGANISM_NAMES,
} from '../../../works/works.data';
import type { Experience } from '../../../works/works.types';

const MILESTONE_COUNT = 4;

interface Milestone {
  id: string;
  year: string;
  isCurrent: boolean;
  employment: string;
  location: string;
  /** non traduit : nom propre */
  organismName: string;
  logo: ResponsiveImageSet | null;
  monogram: string;
}

function toMilestone(exp: Experience): Milestone {
  const organismName = ORGANISM_NAMES[exp.organism];
  return {
    id: exp.id,
    year: exp.start.slice(0, 4),
    isCurrent: exp.end === null,
    employment: exp.employment,
    location: exp.location,
    organismName,
    logo: ORGANISM_LOGOS[exp.organism] ?? null,
    monogram: ORGANISM_MONOGRAMS[exp.organism] ?? organismName.slice(0, 2).toUpperCase(),
  };
}

/**
 * Chronique : mini-frise des derniers jalons du parcours, lue de gauche à
 * droite (ancien → récent). La ligne d'or se remplit jusqu'au jalon survolé /
 * focalisé et revient au jalon courant au repos.
 */
@Component({
  selector: 'app-home-work-chronicle',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-work-chronicle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-work-chronicle.css',
})
export class HomeWorkChronicle {
  protected readonly ts = inject(TranslationService);

  protected readonly milestones: readonly Milestone[] = EXPERIENCES.slice(0, MILESTONE_COUNT)
    .reverse()
    .map(toMilestone);

  protected readonly activeIndex = signal(this.restIndex());

  protected readonly fill = computed(() => {
    const span = this.milestones.length - 1;
    const ratio = span > 0 ? this.activeIndex() / span : 1;
    return `${Number((ratio * 100).toFixed(2))}%`;
  });

  protected activate(index: number): void {
    this.activeIndex.set(index);
  }

  protected rest(): void {
    this.activeIndex.set(this.restIndex());
  }

  /** Le focus qui circule entre deux jalons ne doit pas faire retomber la ligne. */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && (event.currentTarget as HTMLElement).contains(next)) return;
    this.rest();
  }

  protected title(milestone: Milestone): string {
    return this.ts.translate(`works.xp.${milestone.id}.title`);
  }

  protected kind(milestone: Milestone): string {
    return this.ts.translate(`works.employment.${milestone.employment}`);
  }

  /** `remote` est un slug ⇒ même clé que workMode ; sinon adresse littérale. */
  protected location(milestone: Milestone): string {
    return milestone.location === 'remote'
      ? this.ts.translate('works.workMode.remote')
      : milestone.location;
  }

  private restIndex(): number {
    return Math.max(this.milestones.length - 1, 0);
  }
}
