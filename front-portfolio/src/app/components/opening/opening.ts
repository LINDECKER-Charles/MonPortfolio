import { Component, inject } from '@angular/core';
import { AudioService } from '../../services/audio-service';

@Component({
  selector: 'app-opening',
  imports: [],
  templateUrl: './opening.html',
  styleUrl: './opening.css',
})
export class Opening {
  private readonly audioService: AudioService = inject(AudioService);

  public currentState: 1 | 2 | 3 = 1;
  public voiceHaveBeenPlayed: boolean = false;
  public isOpeningLeaving: boolean = false;

  public launchBgMusic(): void {
    if (this.currentState !== 1) return;

    this.audioService.play('bgMusic');
    this.currentState = 2;
  }

  public playVoice(): void {
    if (this.voiceHaveBeenPlayed || this.currentState !== 2) return;

    this.audioService.play('pouperVoice');
    this.voiceHaveBeenPlayed = true;
    this.isOpeningLeaving = true;

    setTimeout(() => {
      this.isOpeningLeaving = false;
      this.currentState = 3;
    }, 8000);
  }
}
