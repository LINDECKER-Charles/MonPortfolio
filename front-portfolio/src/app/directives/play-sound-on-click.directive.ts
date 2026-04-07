import { Directive, HostListener, Input, inject } from '@angular/core';
import { AudioService } from '../services/audio-service';

type PlaySoundMode = 'once' | 'persistent';

@Directive({
  selector: '[appPlaySoundOnClick]',
  standalone: true,
})
export class PlaySoundOnClickDirective {
  private readonly audioService = inject(AudioService);

  @Input({ required: true }) appPlaySoundOnClick!: string;
  @Input() appPlaySoundMode: PlaySoundMode = 'once';
  @Input() appPlaySoundDisabled = false;

  @HostListener('click')
  onClick(): void {
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
