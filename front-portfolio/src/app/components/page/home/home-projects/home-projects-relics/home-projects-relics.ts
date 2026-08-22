import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ResponsivePicture,
  type ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';
import { TiltDirective } from '../../../../../directives/tilt.directive';
import { TranslationService } from '../../../../../services/translation.service';
import { PROJECTS_DATA } from '../../../projects/projects.data';
import type {
  ProjectCategory,
  ProjectItem,
  ProjectMediaImage,
  ProjectStatus,
} from '../../../projects/projects.types';

const RELIC_COUNT = 4;
const RELIC_STACK_COUNT = 3;
/** Plafond des candidats `w` : une vignette ≤ 280px (80vw mobile) est couverte jusqu'à DPR 3. */
const RELIC_MAX_SOURCE_WIDTH = 768;

/** Vue d'une relique : dérivée une fois, le template ne recalcule rien sous CD Eager. */
export interface Relic {
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly category: ProjectCategory;
  readonly status: ProjectStatus;
  readonly live: boolean;
  readonly stack: readonly string[];
  readonly image: ProjectMediaImage | null;
}

/** Les projets mis en avant d'abord, complétés par les suivants jusqu'à `RELIC_COUNT`. */
export function selectRelics(projects: readonly ProjectItem[]): ProjectItem[] {
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);
  return [...featured, ...others].slice(0, RELIC_COUNT);
}

/**
 * Convertit les déclinaisons `maxWidth` (sélection par viewport, `sizes` inerte) en
 * descripteurs `width` bornés à {@link RELIC_MAX_SOURCE_WIDTH} : `ResponsivePicture`
 * bascule alors en `srcset`+`sizes` et le navigateur choisit la vignette, pas l'original.
 */
export function toRelicImage(image: ProjectMediaImage | undefined): ProjectMediaImage | null {
  if (!image) return null;

  const sources = image.sources
    .filter(
      (source): source is ResponsiveSource & { maxWidth: number } =>
        !!source.maxWidth && source.maxWidth <= RELIC_MAX_SOURCE_WIDTH,
    )
    .map(({ src, maxWidth, type }) => ({ src, width: maxWidth, type }));

  return { ...image, sources };
}

function toRelic(project: ProjectItem): Relic {
  return {
    id: project.id,
    title: project.title,
    year: project.period.dateStart.getFullYear(),
    category: project.category,
    status: project.status,
    live: project.status === 'in_progress',
    stack: project.stack.slice(0, RELIC_STACK_COUNT),
    image: toRelicImage(project.detail?.images?.[0]),
  };
}

@Component({
  selector: 'app-home-projects-relics',
  imports: [RouterLink, ResponsivePicture, TiltDirective],
  templateUrl: './home-projects-relics.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-projects-relics.css',
})
export class HomeProjectsRelics {
  protected readonly ts = inject(TranslationService);

  protected readonly relics: readonly Relic[] = selectRelics(PROJECTS_DATA).map(toRelic);
}
