import { Injectable } from '@angular/core';
import gsap from 'gsap';

export interface OpeningAnimationRefs {
  audioState: HTMLDivElement;
  openingState: HTMLDivElement;
  soundButton: HTMLButtonElement;
  soundIcon: SVGElement;
  soundLabel: HTMLParagraphElement;
  openingButton: HTMLButtonElement;
  openingFigure: HTMLElement;
}

@Injectable({
  providedIn: 'root',
})
export class OpeningAnimationService {
  private soundIdleTween?: gsap.core.Tween;
  private soundLabelIdleTween?: gsap.core.Tween;
  private openingIdleTween?: gsap.core.Tween;

  prepareInitialState(refs: OpeningAnimationRefs): void {
    gsap.set(refs.audioState, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(refs.openingState, {
      autoAlpha: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(refs.soundButton, {
      autoAlpha: 0,
      scale: 0.72,
      rotate: -8,
      y: 0,
    });

    gsap.set(refs.soundIcon, {
      scale: 1,
    });

    gsap.set(refs.soundLabel, {
      autoAlpha: 0,
      y: 10,
      opacity: 0.72,
    });

    gsap.set(refs.openingButton, {
      autoAlpha: 0,
      scale: 0.88,
      y: 0,
    });
  }

  enterSoundState(refs: OpeningAnimationRefs): void {
    this.stopSoundIdle();

    gsap.killTweensOf([refs.audioState, refs.soundButton, refs.soundLabel]);

    const tl = gsap.timeline();

    tl.fromTo(
      refs.audioState,
      {
        y: 18,
        scale: 0.985,
        filter: 'blur(10px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
      }
    )
      .to(
        refs.soundButton,
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'back.out(1.8)',
        },
        '-=0.48'
      )
      .to(
        refs.soundLabel,
        {
          autoAlpha: 0.85,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.34'
      )
      .add(() => {
        this.startSoundIdle(refs);
      });
  }

  launchBgMusicTransition(refs: OpeningAnimationRefs, onComplete: () => void): void {
    this.stopSoundIdle();

    const tl = gsap.timeline({ onComplete });

    tl.to(refs.soundButton, {
      scale: 0.9,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto',
    }).to(
      [refs.audioState, refs.soundLabel],
      {
        autoAlpha: 0,
        y: -20,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power3.inOut',
        overwrite: 'auto',
      },
      0
    );
  }

  enterOpeningState(refs: OpeningAnimationRefs): void {
    this.stopOpeningIdle();

    gsap.killTweensOf([refs.openingState, refs.openingButton]);

    gsap.set(refs.openingState, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(refs.openingButton, {
      autoAlpha: 0,
      scale: 0.88,
      y: 0,
    });

    const tl = gsap.timeline();

    tl.fromTo(
      refs.openingState,
      {
        y: 24,
        scale: 0.98,
        filter: 'blur(12px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    )
      .to(
        refs.openingButton,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.62'
      )
      .add(() => {
        this.startOpeningIdle(refs);
      });
  }

  playVoiceTransition(refs: OpeningAnimationRefs, onComplete: () => void): void {
    this.stopOpeningIdle();

    gsap.killTweensOf(refs.openingButton);
    gsap.killTweensOf(refs.openingState);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(refs.openingState, {
          autoAlpha: 0,
          clearProps: 'transform,filter',
        });

        onComplete();
      },
    });

    tl.to(refs.openingButton, {
      scale: 0.965,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto',
    }).to(refs.openingState, {
      autoAlpha: 0,
      scale: 0.92,
      filter: 'blur(10px)',
      duration: 8,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  }

  onSoundHoverEnter(refs: OpeningAnimationRefs): void {
    gsap.to(refs.soundButton, {
      scale: 1.06,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(refs.soundIcon, {
      scale: 1.05,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  onSoundHoverLeave(refs: OpeningAnimationRefs): void {
    gsap.to(refs.soundButton, {
      scale: 1,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(refs.soundIcon, {
      scale: 1,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  onSoundPress(refs: OpeningAnimationRefs): void {
    gsap.fromTo(
      refs.soundButton,
      { scale: 1 },
      {
        scale: 0.92,
        duration: 0.09,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        overwrite: 'auto',
      }
    );
  }

  onOpeningHoverEnter(refs: OpeningAnimationRefs): void {
    gsap.to(refs.openingButton, {
      scale: 1.025,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  onOpeningHoverLeave(refs: OpeningAnimationRefs): void {
    gsap.to(refs.openingButton, {
      scale: 1,
      duration: 0.26,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  onOpeningPress(refs: OpeningAnimationRefs): void {
    gsap.fromTo(
      refs.openingButton,
      { scale: 1 },
      {
        scale: 0.97,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        overwrite: 'auto',
      }
    );
  }

  stopAllTweens(refs: Partial<OpeningAnimationRefs>): void {
    this.stopSoundIdle();
    this.stopOpeningIdle();

    gsap.killTweensOf([
      refs.audioState,
      refs.openingState,
      refs.soundButton,
      refs.soundIcon,
      refs.soundLabel,
      refs.openingButton,
      refs.openingFigure,
    ]);
  }

  private startSoundIdle(refs: OpeningAnimationRefs): void {
    this.soundIdleTween = gsap.to(refs.soundButton, {
      y: -5,
      duration: 1.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    this.soundLabelIdleTween = gsap.to(refs.soundLabel, {
      opacity: 1,
      duration: 1.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  private stopSoundIdle(): void {
    this.soundIdleTween?.kill();
    this.soundLabelIdleTween?.kill();
    this.soundIdleTween = undefined;
    this.soundLabelIdleTween = undefined;
  }

  private startOpeningIdle(refs: OpeningAnimationRefs): void {
    this.openingIdleTween = gsap.to(refs.openingButton, {
      y: -6,
      duration: 2.3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  private stopOpeningIdle(): void {
    this.openingIdleTween?.kill();
    this.openingIdleTween = undefined;
  }
}
