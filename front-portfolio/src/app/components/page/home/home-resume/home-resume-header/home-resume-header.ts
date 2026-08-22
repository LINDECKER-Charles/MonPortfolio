import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../../services/translation.service';
import { LanternLightDirective } from '../../../../../directives/lantern-light.directive';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';
import { HomeLantern } from '../home-lantern/home-lantern';

@Component({
  selector: 'app-home-resume-header',
  imports: [RouterLink, ResponsivePicture, LanternLightDirective, HomeLantern],
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
