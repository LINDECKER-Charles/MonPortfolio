import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import { ProjectItem } from '../../../page/projects/projects.state';
import {
  formatProjectPeriod,
  getProjectCategoryLabel,
  getProjectStatusLabel,
} from '../../../page/projects/projects.utils';

@Component({
  selector: 'app-projects-timeline',
  imports: [RevealOnScrollDirective],
  templateUrl: './projects-timeline.html',
  styleUrl: './projects-timeline.css',
})
export class ProjectsTimeline {
  @Input({ required: true }) projects: ProjectItem[] = [];
  @Output() projectSelected = new EventEmitter<ProjectItem>();

  protected trackByProjectId(_index: number, project: ProjectItem): string {
    return project.id;
  }

  protected formatPeriod(project: ProjectItem): string {
    return formatProjectPeriod(project);
  }

  protected getStatusLabel(status: ProjectItem['status']): string {
    return getProjectStatusLabel(status);
  }

  protected getCategoryLabel(category: ProjectItem['category']): string {
    return getProjectCategoryLabel(category);
  }
}
