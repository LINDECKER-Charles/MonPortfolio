import { Directive, HostListener, Input, inject } from '@angular/core';
import { AudioService } from '../services/audio-service';

type PlaySoundMode = 'once' | 'persistent';
type PlaySoundTrigger = 'click' | 'hover';

@Directive({
  selector: '[appPlaySoundOnClick]',
  standalone: true,
})
export class PlaySoundOnClickDirective {
  private readonly audioService = inject(AudioService);

  @Input({ required: true }) appPlaySoundOnClick!: string;
  @Input() appPlaySoundMode: PlaySoundMode = 'once';
  @Input() appPlaySoundTrigger: PlaySoundTrigger = 'click';
  @Input() appPlaySoundDisabled = false;

  @HostListener('click')
  onClick(): void {
    if (this.appPlaySoundTrigger !== 'click') {
      return;
    }

    this.playConfiguredSound();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.appPlaySoundTrigger !== 'hover') {
      return;
    }

    this.playConfiguredSound();
  }

  private playConfiguredSound(): void {
    if (this.appPlaySoundDisabled || !this.appPlaySoundOnClick) {
      return;
    }

    if (this.appPlaySoundMode === 'persistent') {
      this.audioService.play(this.appPlaySoundOnClick);
      return;
    }

    this.audioService.playOnce(this.appPlaySoundOnClick);
  }
}
