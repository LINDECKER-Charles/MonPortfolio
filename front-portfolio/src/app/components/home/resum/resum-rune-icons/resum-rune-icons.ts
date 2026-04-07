import { Component, Input } from '@angular/core';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { PlaySoundOnClickDirective } from '../../../../directives/play-sound-on-click.directive';
import { ResumEntryAnimation } from '../resum-entry-animation';
import {
  animateRuneHoverIn,
  animateRuneHoverOut,
  animateRunePress,
  animateRuneRelease,
} from './resum-rune-icons.animations';

@Component({
  selector: 'app-resum-rune-icons',
  imports: [ResponsivePicture, PlaySoundOnClickDirective],
  templateUrl: './resum-rune-icons.html',
  styleUrl: './resum-rune-icons.css',
})
export class ResumRuneIcons extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.rune';
  protected override animationDelay = 0.2;
  protected override animationStagger = 0.05;

  onHoverEnter(event: Event): void {
    if (!this.isBrowser) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneHoverIn(rune);
  }

  onHoverLeave(event: Event): void {
    if (!this.isBrowser) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneHoverOut(rune);
  }

  onPress(event: Event): void {
    if (!this.isBrowser) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRunePress(rune);
  }

  onRelease(event: Event): void {
    if (!this.isBrowser) return;

    const rune = event.currentTarget as HTMLElement | null;
    if (!rune) return;

    animateRuneRelease(rune);
  }
}
