import {AfterViewInit, Component, ElementRef, inject} from '@angular/core';
import {AudioService} from '../../../services/audio-service';
import gsap from 'gsap';

@Component({
  selector: 'app-stop-all-sound',
  imports: [],
  templateUrl: './stop-all-sound.html',
  styleUrl: './stop-all-sound.css',
})
export class StopAllSound implements AfterViewInit {
  public readonly audioService: AudioService = inject(AudioService);
  private host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    gsap.fromTo(
      this.host.nativeElement,
      {
        autoAlpha: 0,
        y: -16,
        scale: 0.88,
        filter: 'blur(8px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power3.out',
      }
    );
  }

  public toggleSound(): void {
    if (this.audioService.muted()) {
      this.audioService.unmuteAll();
      return;
    }

    this.audioService.muteAll();
  }
}
