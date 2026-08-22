import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../../services/translation.service';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';

@Component({
  selector: 'app-home-resume-header',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './home-resume-header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-resume-header.css',
})
export class HomeResumeHeader {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) luciditySources: ResponsiveSource[] = [];
  @Input({ required: true }) lucidityFallback = '';
  @Input({ required: true }) levelSources: ResponsiveSource[] = [];
  @Input({ required: true }) levelFallback = '';
}
