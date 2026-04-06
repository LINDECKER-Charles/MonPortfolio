import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sound',
  imports: [],
  templateUrl: './sound.html',
  styleUrl: './sound.css',
})
export class Sound {
  @Input() src!: string;
  @Input() loop = false;
  @Input() autoplay = false;
  @Input() controls = false;
  @Input() muted = false;
  @Input() volume = 1; // 0 → 1
  @Input() playbackRate = 1;
  @Input() preload: 'none' | 'metadata' | 'auto' = 'auto';
  @Input() currentTime = 0;
}
