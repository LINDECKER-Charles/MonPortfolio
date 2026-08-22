import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../services/translation.service';
import { computeStats } from '../works.state';

@Component({
  selector: 'app-works-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './works-header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './works-header.css',
})
export class WorksHeader {
  protected readonly ts = inject(TranslationService);
  protected readonly stats = computeStats();
}
