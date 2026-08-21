import {
  ConstellationAction,
  ConstellationCategory,
  ConstellationItem,
  ConstellationLabels,
  ConstellationStatusTone,
} from '../../assets/constellation/constellation.model';
import { TranslationService } from '../../../services/translation.service';
import { ProjectItem, ProjectStatus } from './projects.state';
import { formatProjectPeriod } from './projects.utils';

/**
 * Adaptateur portfolio → composant générique `Constellation`. Toutes les
 * fonctions lisent `TranslationService` ; appelées dans un `computed()`, elles
 * se recalculent au changement de langue. Les seeds reproduisent à l'identique
 * la carte historique (3 clusters réglés à la main).
 */

const STATUS_TONE: Record<ProjectStatus, ConstellationStatusTone> = {
  in_progress: 'active',
  done: 'done',
  archived: 'muted',
};

export function buildConstellationCategories(ts: TranslationService): ConstellationCategory[] {
  return [
    {
      id: 'personal',
      label: ts.translate('projects.filter.personal'),
      color: 'var(--color-ember)',
      glyph: '◆',
      seed: { cx: 31, cy: 38, spread: 22, angle: -0.4 },
    },
    {
      id: 'open_source',
      label: ts.translate('projects.filter.open_source'),
      color: 'var(--color-moonlight)',
      glyph: '✦',
      seed: { cx: 74, cy: 20, spread: 13, angle: 0.8 },
    },
    {
      id: 'client',
      label: ts.translate('projects.filter.client'),
      color: 'var(--color-gold)',
      glyph: '◈',
      seed: { cx: 73, cy: 55, spread: 13, angle: 0.2 },
    },
  ];
}

export function buildConstellationLabels(ts: TranslationService): ConstellationLabels {
  return {
    region: ts.translate('projects.constellation.aria'),
    search: ts.translate('projects.constellation.search'),
    zoomIn: ts.translate('projects.constellation.zoom_in'),
    zoomOut: ts.translate('projects.constellation.zoom_out'),
    reset: ts.translate('projects.constellation.reset'),
    legend: ts.translate('projects.constellation.legend'),
    related: ts.translate('projects.constellation.related'),
    detail: ts.translate('projects.timeline.detail'),
    emptyTitle: ts.translate('projects.constellation.empty_title'),
    emptyText: ts.translate('projects.constellation.empty_text'),
    meta:
      `{count} ${ts.translate('projects.constellation.projects')}` +
      ` · {links} ${ts.translate('projects.constellation.links')}`,
  };
}

export function toConstellationItems(
  projects: readonly ProjectItem[],
  ts: TranslationService,
): ConstellationItem[] {
  const lang = ts.lang();
  const today = ts.translate('projects.today');

  return projects.map((project) => {
    const actions: ConstellationAction[] = [];
    if (project.links.demo) {
      actions.push({
        label: ts.translate('projects.modal.demo'),
        href: project.links.demo,
        icon: 'external',
      });
    }
    if (project.links.github) {
      actions.push({ label: 'GitHub', href: project.links.github, icon: 'github' });
    }
    if (project.links.website) {
      actions.push({
        label: ts.translate('projects.modal.site'),
        href: project.links.website,
        icon: 'website',
      });
    }

    return {
      id: project.id,
      title: project.title,
      category: project.category,
      // Liens dérivés de stack + tags partagés (graphe inchangé vs. version d'origine).
      tags: [...project.stack, ...project.tags],
      chips: project.stack,
      description: ts.translate(`projects.${project.id}.shortDescription`),
      period: formatProjectPeriod(project, lang, today),
      statusLabel: ts.translate(`projects.status.${project.status}`),
      statusTone: STATUS_TONE[project.status],
      actions,
    };
  });
}
