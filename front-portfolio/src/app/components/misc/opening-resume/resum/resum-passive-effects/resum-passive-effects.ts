import { Component } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import { TranslatePipe } from '../../../../../pipes/translate.pipe';

@Component({
  selector: 'app-resum-passive-effects',
  imports: [TranslatePipe],
  templateUrl: './resum-passive-effects.html',
  styleUrl: './resum-passive-effects.css',
})
export class ResumPassiveEffects extends ResumEntryAnimation {
  protected readonly animationSelectors = '.section-title, .passives li';
  protected override animationDelay = 0.28;
  protected override animationStagger = 0.05;
}
