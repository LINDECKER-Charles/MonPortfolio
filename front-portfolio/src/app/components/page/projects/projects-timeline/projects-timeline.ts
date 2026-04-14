import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../../directives/reveal-on-scroll';
import { ProjectItem } from '../projects.state';
import {
  formatProjectPeriod,
  getProjectCategoryKey,
  getProjectStatusKey,
} from '../projects.utils';
import { TranslatePipe } from '../../../../pipes/translate.pipe';
import { LanguageService } from '../../../../services/language-service';

@Component({
  selector: 'app-projects-timeline',
  imports: [RevealOnScrollDirective, TranslatePipe],
  templateUrl: './projects-timeline.html',
  styleUrl: './projects-timeline.css',
})
export class ProjectsTimeline {
  @Input({ required: true }) projects: ProjectItem[] = [];
  @Output() projectSelected = new EventEmitter<ProjectItem>();

  private readonly languageService = inject(LanguageService);

  protected trackByProjectId(_index: number, project: ProjectItem): string {
    return project.id;
  }

  protected formatPeriod(project: ProjectItem): string {
    return formatProjectPeriod(
      project,
      this.languageService.currentLanguage().code,
      this.languageService.t('projects.period.today')
    );
  }

  protected getStatusKey(status: ProjectItem['status']): string {
    return getProjectStatusKey(status);
  }

  protected getCategoryKey(category: ProjectItem['category']): string {
    return getProjectCategoryKey(category);
  }
}
