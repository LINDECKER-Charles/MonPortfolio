import { Component, inject, Input } from '@angular/core';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateRuneHoverIn,
  animateRuneHoverOut,
  animateRunePress,
  animateRuneRelease,
} from './resum-rune-icons.animations';
import {PlaySoundOnClickDirective} from '../../../../../directives/play-sound-on-click.directive';
import {ResponsivePicture} from '../../../../assets/responsive-picture/responsive-picture';
import { TranslationService } from '../../../../../services/translation.service';

@Component({
  selector: 'app-resum-rune-icons',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-rune-icons.html',
  styleUrl: './resum-rune-icons.css',
})
export class ResumRuneIcons extends ResumEntryAnimation {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.rune';
  protected override animationDelay = 0.2;
  protected override animationStagger = 0.05;

  onHoverEnter(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneHoverIn(rune);
  }

  onHoverLeave(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneHoverOut(rune);
  }

  onPress(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRunePress(rune);
  }

  onRelease(event: Event): void {
    if (!this.isBrowser || !this.isEntryAnimationComplete) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneRelease(rune);
  }
}
