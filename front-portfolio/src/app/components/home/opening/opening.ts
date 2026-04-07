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
import { AudioService } from '../../../services/audio-service';
import { ResponsivePicture, ResponsiveSource } from '../../assets/responsive-picture/responsive-picture';
import {
  canEnableSound,
  canSkipOpening,
  canStartIntro,
  moveToFinished,
  moveToIntroLeaving,
  moveToIntroReady,
  OpeningState,
} from './opening.state';
import {
  OpeningAnimationRefs,
  OpeningAnimationService,
} from './opening-animation.service';

@Component({
  selector: 'app-opening',
  imports: [ResponsivePicture],
  templateUrl: './opening.html',
  styleUrl: './opening.css',
})
export class Opening implements AfterViewInit, OnDestroy {
  private readonly audioService = inject(AudioService);
  private readonly animationService = inject(OpeningAnimationService);
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

  public state: OpeningState = 'sound-gate';

  public readonly openingSources: ResponsiveSource[] = [
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

  get isSoundGateVisible(): boolean {
    return this.state === 'sound-gate';
  }

  get isOpeningVisible(): boolean {
    return this.state === 'intro-ready' || this.state === 'intro-leaving';
  }

  get isOpeningLeaving(): boolean {
    return this.state === 'intro-leaving';
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.animationService.prepareInitialState(this.refs);
    this.animationService.enterSoundState(this.refs);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.animationService.stopAllTweens(this.refs);
  }

  public launchBgMusic(): void {
    if (!this.isBrowser || !canEnableSound(this.state)) return;

    this.audioService.play('getItem');
    this.audioService.play('bgMusic');

    this.animationService.launchBgMusicTransition(this.refs, () => {
      this.state = moveToIntroReady(this.state);
      this.animationService.enterOpeningState(this.refs);
    });
  }

  public playVoice(): void {
    if (!this.isBrowser || !canStartIntro(this.state)) return;

    this.audioService.play('getItem');
    this.audioService.play('pouperVoice');
    this.state = moveToIntroLeaving(this.state);

    this.animationService.playVoiceTransition(this.refs, () => {
      this.state = moveToFinished();
      this.finished.emit();
    });
  }

  public skipOpening(): void {
    if (!this.isBrowser || !canSkipOpening(this.state)) return;

    this.animationService.stopAllTweens(this.refs);
    this.state = moveToFinished();
    this.finished.emit();
  }

  public onSoundHoverEnter(): void {
    if (!this.isBrowser || !canEnableSound(this.state)) return;
    this.animationService.onSoundHoverEnter(this.refs);
  }

  public onSoundHoverLeave(): void {
    if (!this.isBrowser || !canEnableSound(this.state)) return;
    this.animationService.onSoundHoverLeave(this.refs);
  }

  public onSoundPress(): void {
    if (!this.isBrowser || !canEnableSound(this.state)) return;
    this.animationService.onSoundPress(this.refs);
  }

  public onOpeningHoverEnter(): void {
    if (!this.isBrowser || !canStartIntro(this.state)) return;
    this.animationService.onOpeningHoverEnter(this.refs);
  }

  public onOpeningHoverLeave(): void {
    if (!this.isBrowser || !canStartIntro(this.state)) return;
    this.animationService.onOpeningHoverLeave(this.refs);
  }

  public onOpeningPress(): void {
    if (!this.isBrowser || !canStartIntro(this.state)) return;
    this.animationService.onOpeningPress(this.refs);
  }

  private get refs(): OpeningAnimationRefs {
    return {
      audioState: this.audioStateRef.nativeElement,
      openingState: this.openingStateRef.nativeElement,
      soundButton: this.soundButtonRef.nativeElement,
      soundIcon: this.soundIconRef.nativeElement,
      soundLabel: this.soundLabelRef.nativeElement,
      openingButton: this.openingButtonRef.nativeElement,
      openingFigure: this.openingFigureRef.nativeElement,
    };
  }
}
