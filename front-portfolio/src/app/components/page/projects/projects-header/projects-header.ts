import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-projects-header',
  imports: [RouterLink],
  templateUrl: './projects-header.html',
  styleUrl: './projects-header.css',
})
export class ProjectsHeader {
  protected readonly ts = inject(TranslationService);
}
