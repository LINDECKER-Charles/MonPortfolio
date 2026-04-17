import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ProjectItem, ProjectMediaImage } from '../projects.state';
import { formatProjectPeriod } from '../projects.utils';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-projects-timeline',
  imports: [RevealOnScrollDirective, ResponsivePicture],
  templateUrl: './projects-timeline.html',
  styleUrl: './projects-timeline.css',
})
export class ProjectsTimeline {
  protected readonly ts = inject(TranslationService);

  @Input({ required: true }) projects: ProjectItem[] = [];
  @Output() projectSelected = new EventEmitter<ProjectItem>();

  protected trackByProjectId(_index: number, project: ProjectItem): string {
    return project.id;
  }

  protected formatPeriod(project: ProjectItem): string {
    return formatProjectPeriod(project, this.ts.lang(), this.ts.translate('projects.today'));
  }

  protected previewImage(project: ProjectItem): ProjectMediaImage | null {
    return project.detail?.images?.[0] ?? null;
  }

  protected previewCount(project: ProjectItem): number {
    return project.detail?.images?.length ?? 0;
  }
}
