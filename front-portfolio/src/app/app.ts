import {Component, inject, signal} from '@angular/core';
import {Loading} from './components/assets/loading/loading';
import {AudioService} from './services/audio-service';
import {StopAllSound} from './components/assets/stop-all-sound/stop-all-sound';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MetaService} from './services/meta-service';
import {filter, map, mergeMap} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [Loading, StopAllSound, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-portfolio');

  public audio = inject(AudioService);
  constructor() {
    this.audio.registerMany({
      bgMusic: {
        src: './song/hunters_dream.mp3',
        loop: true,
        volume: 0.7,
        preload: 'auto'
      },
      pouperVoice: {
        src: './song/pouper_welcome.mp3',
        loop: false,
        volume: 0.9,
        preload: 'auto'
      },
      getItem: {
        src: './song/get_item.mp3',
        loop: false,
        volume: 0.4,
        preload: 'auto'
      },
      bloodVial: {
        src: './song/blood_vial.mp3',
        loop: false,
        volume: 0.15,
        preload: 'auto'
      },
      getEcho: {
        src: './song/get_echo.mp3',
        loop: false,
        volume: 0.15,
        preload: 'auto'
      },
      getbackEcho: {
        src: './song/getback_echo.mp3',
        loop: false,
        volume: 0.15,
        preload: 'auto'
      },
      messagerLaught: {
        src: './song/messager_laught.mp3',
        loop: false,
        volume: 0.15,
        preload: 'auto'
      },
      smallBell: {
        src: './song/small_bell.mp3',
        loop: false,
        volume: 0.15,
        preload: 'auto'
      },
      newLocation: {
        src: './song/new_location.mp3',
        loop: false,
        volume: 0.5,
        preload: 'auto'
      }
    });
  }

  private readonly metaService = inject(MetaService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  async ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
      .subscribe((event) => {
        this.metaService.updateDescription(event['description']);
        this.metaService.updateCanonical(event['canonical']);
        this.metaService.updateRobots(event['robots']);

        this.metaService.updateOgTitle(event['ogTitle']);
        this.metaService.updateOgDescription(event['ogDescription']);
        this.metaService.updateOgImage(event['ogImage']);
        this.metaService.updateOgUrl(event['ogUrl']);
        this.metaService.updateOgType(event['ogType']);

        this.metaService.updateTwitterTitle(event['twitterTitle']);
        this.metaService.updateTwitterDescription(event['twitterDescription']);
        this.metaService.updateTwitterCard(event['twitterCard']);
        this.metaService.updateTwitterImage(event['twitterImage']);
      });

  }
}
