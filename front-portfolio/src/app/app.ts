import {Component, inject, signal} from '@angular/core';
import {Loading} from './components/assets/loading/loading';
import {Home} from './components/home/home';
import {AudioService} from './services/audio-service';
import {StopAllSound} from './components/assets/stop-all-sound/stop-all-sound';

@Component({
  selector: 'app-root',
  imports: [Loading, Home, StopAllSound],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-portfolio');

  public audio = inject(AudioService);
  constructor() {
    this.audio.registerMany({
      bgMusic: {
        src: './opening/song/hunters_dream.mp3',
        loop: true,
        volume: 0.35,
        preload: 'auto'
      },
      pouperVoice: {
        src: './opening/song/pouper_welcome.mp3',
        loop: false,
        volume: 0.5,
        preload: 'auto'
      }
    });
  }

  protected readonly AudioService = AudioService;
}
