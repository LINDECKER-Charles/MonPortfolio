import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import {AudioService} from '../../../services/audio-service';
import {ResponsivePicture} from '../../assets/responsive-picture/responsive-picture';

export interface ResponsiveSource {
  src: string;
  maxWidth?: number;
  type?: string;
}

@Component({
  selector: 'app-opening',
  imports: [
    ResponsivePicture
  ],
  templateUrl: './opening.html',
  styleUrl: './opening.css',
})
export class Opening implements AfterViewInit, OnDestroy {

  private readonly audioService = inject(AudioService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @Output() finished = new EventEmitter<void>();

  @ViewChild('audioState') audioStateRef!: ElementRef<HTMLDivElement>;
  @ViewChild('openingState') openingStateRef!: ElementRef<HTMLDivElement>;

  @ViewChild('soundButton') soundButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('soundIcon') soundIconRef!: ElementRef<SVGElement>;
  @ViewChild('soundLabel') soundLabelRef!: ElementRef<HTMLParagraphElement>;

  @ViewChild('openingButton') openingButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('openingFigure') openingFigureRef!: ElementRef<HTMLElement>;

  public currentState: 1 | 2 | 3 = 1;
  public voiceHaveBeenPlayed = false;
  public isOpeningLeaving = false;

  private soundIdleTween?: gsap.core.Tween;
  private soundLabelIdleTween?: gsap.core.Tween;
  private openingIdleTween?: gsap.core.Tween;


  public openingSources = [
    {
      src: './opening/320x320_opening_base.webp',
      maxWidth: 320,
      type: 'image/webp',
    },
    {
      src: './opening/640x640_opening_base.webp',
      maxWidth: 640,
      type: 'image/webp',
    },
    {
      src: './opening/768x768_opening_base.webp',
      maxWidth: 768,
      type: 'image/webp',
    },
    {
      src: './opening/opening_base.webp',
      type: 'image/webp',
    },
  ];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.prepareInitialState();
    this.enterSoundState();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.stopAllTweens();
  }

  public launchBgMusic(): void {
    if (!this.isBrowser || this.currentState !== 1) return;

    this.audioService.play('getItem');
    this.audioService.play('bgMusic');
    this.stopSoundIdle();

    const tl = gsap.timeline({
      onComplete: () => {
        this.currentState = 2;
        this.enterOpeningState();
      },
    });

    tl.to(this.soundButtonRef.nativeElement, {
      scale: 0.9,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto',
    }).to(
      [this.audioStateRef.nativeElement, this.soundLabelRef.nativeElement],
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

  public playVoice(): void {
    if (!this.isBrowser || this.voiceHaveBeenPlayed || this.currentState !== 2) return;

    this.audioService.play('getItem');
    this.voiceHaveBeenPlayed = true;
    this.isOpeningLeaving = true;
    this.audioService.play('pouperVoice');
    this.stopOpeningIdle();

    gsap.killTweensOf(this.openingButtonRef.nativeElement);
    gsap.killTweensOf(this.openingStateRef.nativeElement);

    const tl = gsap.timeline({
      onComplete: () => {
        this.isOpeningLeaving = false;
        this.currentState = 3;

        gsap.set(this.openingStateRef.nativeElement, {
          autoAlpha: 0,
          clearProps: 'transform,filter',
        });

        this.finished.emit();
      },
    });

    tl.to(this.openingButtonRef.nativeElement, {
      scale: 0.965,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto',
    }).to(this.openingStateRef.nativeElement, {
      autoAlpha: 0,
      scale: 0.92,
      filter: 'blur(10px)',
      duration: 8,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  }

  public skipOpening(): void {
    if (!this.isBrowser) return;

    this.stopAllTweens();
    this.isOpeningLeaving = false;
    this.currentState = 3;
    this.finished.emit();
  }

  public onSoundHoverEnter(): void {
    if (!this.isBrowser || this.currentState !== 1) return;

    gsap.to(this.soundButtonRef.nativeElement, {
      scale: 1.06,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(this.soundIconRef.nativeElement, {
      scale: 1.05,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  public onSoundHoverLeave(): void {
    if (!this.isBrowser || this.currentState !== 1) return;

    gsap.to(this.soundButtonRef.nativeElement, {
      scale: 1,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    gsap.to(this.soundIconRef.nativeElement, {
      scale: 1,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  public onSoundPress(): void {
    if (!this.isBrowser || this.currentState !== 1) return;

    gsap.fromTo(
      this.soundButtonRef.nativeElement,
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

  public onOpeningHoverEnter(): void {
    if (!this.isBrowser || this.currentState !== 2 || this.isOpeningLeaving) return;

    gsap.to(this.openingButtonRef.nativeElement, {
      scale: 1.025,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  public onOpeningHoverLeave(): void {
    if (!this.isBrowser || this.currentState !== 2 || this.isOpeningLeaving) return;

    gsap.to(this.openingButtonRef.nativeElement, {
      scale: 1,
      duration: 0.26,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  public onOpeningPress(): void {
    if (!this.isBrowser || this.currentState !== 2 || this.isOpeningLeaving) return;

    gsap.fromTo(
      this.openingButtonRef.nativeElement,
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

  private prepareInitialState(): void {
    gsap.set(this.audioStateRef.nativeElement, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(this.openingStateRef.nativeElement, {
      autoAlpha: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(this.soundButtonRef.nativeElement, {
      autoAlpha: 0,
      scale: 0.72,
      rotate: -8,
      y: 0,
    });

    gsap.set(this.soundIconRef.nativeElement, {
      scale: 1,
    });

    gsap.set(this.soundLabelRef.nativeElement, {
      autoAlpha: 0,
      y: 10,
      opacity: 0.72,
    });

    gsap.set(this.openingButtonRef.nativeElement, {
      autoAlpha: 0,
      scale: 0.88,
      y: 0,
    });
  }

  private enterSoundState(): void {
    this.stopSoundIdle();

    gsap.killTweensOf([
      this.audioStateRef.nativeElement,
      this.soundButtonRef.nativeElement,
      this.soundLabelRef.nativeElement,
    ]);

    const tl = gsap.timeline();

    tl.fromTo(
      this.audioStateRef.nativeElement,
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
        this.soundButtonRef.nativeElement,
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
        this.soundLabelRef.nativeElement,
        {
          autoAlpha: 0.85,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.34'
      )
      .add(() => {
        this.startSoundIdle();
      });
  }

  private enterOpeningState(): void {
    this.stopOpeningIdle();

    gsap.killTweensOf([
      this.openingStateRef.nativeElement,
      this.openingButtonRef.nativeElement,
    ]);

    gsap.set(this.openingStateRef.nativeElement, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    });

    gsap.set(this.openingButtonRef.nativeElement, {
      autoAlpha: 0,
      scale: 0.88,
      y: 0,
    });

    const tl = gsap.timeline();

    tl.fromTo(
      this.openingStateRef.nativeElement,
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
        this.openingButtonRef.nativeElement,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.62'
      )
      .add(() => {
        this.startOpeningIdle();
      });
  }

  private startSoundIdle(): void {
    this.soundIdleTween = gsap.to(this.soundButtonRef.nativeElement, {
      y: -5,
      duration: 1.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    this.soundLabelIdleTween = gsap.to(this.soundLabelRef.nativeElement, {
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

  private startOpeningIdle(): void {
    this.openingIdleTween = gsap.to(this.openingButtonRef.nativeElement, {
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

  private stopAllTweens(): void {
    this.stopSoundIdle();
    this.stopOpeningIdle();

    gsap.killTweensOf([
      this.audioStateRef?.nativeElement,
      this.openingStateRef?.nativeElement,
      this.soundButtonRef?.nativeElement,
      this.soundIconRef?.nativeElement,
      this.soundLabelRef?.nativeElement,
      this.openingButtonRef?.nativeElement,
      this.openingFigureRef?.nativeElement,
    ]);
  }
}
