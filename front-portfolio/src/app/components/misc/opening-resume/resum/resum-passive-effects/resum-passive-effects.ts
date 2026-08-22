import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import { TranslationService } from '../../../../../services/translation.service';

@Component({
  selector: 'app-resum-passive-effects',
  templateUrl: './resum-passive-effects.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './resum-passive-effects.css',
})
export class ResumPassiveEffects extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  protected readonly animationSelectors = '.section-title, .passives li';
  protected override animationDelay = 0.28;
  protected override animationStagger = 0.05;
}
