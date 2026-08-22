import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';

import { ResponsivePicture } from '../../../../assets/responsive-picture/responsive-picture';
import { LanternLightDirective } from '../../../../../directives/lantern-light.directive';
import { TiltDirective } from '../../../../../directives/tilt.directive';
import {
  LANTERN_RUNE_FALLBACK_SRC,
  LANTERN_RUNE_SOURCES,
} from '../../../../../img-sources/opening.sources';
import {
  OPENING_REPLAY_PARAM,
  OPENING_SEEN_KEY,
} from '../../../../misc/opening-resume/opening/opening.state';
import { AudioService } from '../../../../../services/audio-service';
import { TranslationService } from '../../../../../services/translation.service';
import { prefersReducedMotion } from '../../../../../utils/motion';
import { safeGet } from '../../../../../utils/storage';

/**
 * Autel de la cinématique : invitation à (re)jouer la séquence d'ouverture
 * depuis le hero. Toute la tuile est un lien `/opening-home?replay=1` —
 * fonctionnel sans JS, au clavier et au tactile. Le lien ne porte pas de
 * `routerLink` (il naviguerait avant l'ignition) : le clic principal est
 * intercepté ici et, avec animations actives, déclenche une ignition (rune qui
 * s'embrase, voile plein écran) avant la navigation programmatique, garantie
 * par un garde-fou `delayedCall`. Les clics modifiés (nouvel onglet) restent
 * au navigateur.
 */
@Component({
  selector: 'app-home-lantern',
  imports: [ResponsivePicture, LanternLightDirective, TiltDirective],
  templateUrl: './home-lantern.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-lantern.css',
})
export class HomeLantern implements OnDestroy {
  private static readonly FAILSAFE_DELAY_S = 1.2;

  protected readonly ts = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly audio = inject(AudioService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('runeFrame', { static: true }) private runeFrame!: ElementRef<HTMLElement>;
  @ViewChild('halo', { static: true }) private halo!: ElementRef<HTMLElement>;
  @ViewChild('veil', { static: true }) private veil!: ElementRef<HTMLElement>;

  protected readonly runeSources = LANTERN_RUNE_SOURCES;
  protected readonly runeFallback = LANTERN_RUNE_FALLBACK_SRC;
  protected readonly replayParams = { [OPENING_REPLAY_PARAM]: 1 };

  /** Résolu après le premier rendu : le HTML SSR ne connaît pas localStorage. */
  protected readonly seen = signal(false);
  protected readonly igniting = signal(false);

  private timeline?: gsap.core.Timeline;
  private failsafe?: gsap.core.Tween;
  private veilDetached = false;

  constructor() {
    afterNextRender(() => {
      this.seen.set(safeGet(OPENING_SEEN_KEY) === '1');
      this.detachVeil();
    });
  }

  protected ignite(event: MouseEvent): void {
    if (isModifiedClick(event)) return;

    event.preventDefault();
    if (!this.isBrowser) return;

    if (prefersReducedMotion()) {
      void this.navigateToOpening();
      return;
    }
    if (this.igniting()) return;

    this.igniting.set(true);
    this.audio.playOnce('smallBell');

    let navigated = false;
    const go = (): void => {
      if (navigated) return;
      navigated = true;
      this.navigateToOpening().then(
        (ok) => {
          if (!ok) this.abortIgnition();
        },
        () => this.abortIgnition(),
      );
    };

    this.timeline = gsap
      .timeline({ onComplete: go })
      .to(this.runeFrame.nativeElement, { scale: 1.14, duration: 0.3, ease: 'power2.out' })
      .to(this.halo.nativeElement, { scale: 1.3, duration: 0.3, ease: 'power2.out' }, '<')
      .to(this.veil.nativeElement, { autoAlpha: 1, duration: 0.35, ease: 'power3.inOut' }, '-=0.1');
    this.failsafe = gsap.delayedCall(HomeLantern.FAILSAFE_DELAY_S, go);
  }

  private navigateToOpening(): Promise<boolean> {
    return this.router.navigate(['/opening-home'], { queryParams: this.replayParams });
  }

  /**
   * Navigation annulée (supersédée, garde de route) ou en erreur : on rembobine
   * rune, halo et voile via la timeline (`reverse` ne rejoue pas `onComplete`,
   * donc pas de double navigation), puis on réarme le CTA.
   */
  private abortIgnition(): void {
    this.failsafe?.kill();

    const timeline = this.timeline;
    if (!timeline) {
      this.igniting.set(false);
      return;
    }
    timeline.eventCallback('onReverseComplete', () => this.igniting.set(false)).reverse();
  }

  /**
   * Le voile est `position: fixed` : tout ancêtre transformé (tilt), filtré
   * (`backdrop-filter` du hero) ou en `will-change` le confinerait à sa boîte.
   * On le sort du flux vers `<body>` une fois l'hydratation terminée.
   */
  private detachVeil(): void {
    const veil = this.veil?.nativeElement;
    if (!veil || !document.body) return;

    document.body.appendChild(veil);
    this.veilDetached = true;
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
    this.failsafe?.kill();

    if (this.veilDetached) {
      this.veil.nativeElement.remove();
    }
  }
}

/** Bouton secondaire ou modificateur (nouvel onglet / fenêtre) : le navigateur suit le `href`. */
function isModifiedClick(event: MouseEvent): boolean {
  return event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}
