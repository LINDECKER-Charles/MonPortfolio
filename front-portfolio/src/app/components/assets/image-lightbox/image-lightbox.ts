import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DOCUMENT,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ResponsivePicture, ResponsiveSource } from '../responsive-picture/responsive-picture';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';
import { TranslationService } from '../../../services/translation.service';
import { lockBodyScroll } from '../../../utils/scroll-lock';

@Component({
  selector: 'app-image-lightbox',
  imports: [ResponsivePicture, FocusTrapDirective],
  templateUrl: './image-lightbox.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './image-lightbox.css',
})
export class ImageLightbox implements OnInit, OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  // Sauvegarde/restauration : la lightbox peut s'ouvrir au-dessus d'un modal
  // qui a déjà verrouillé le scroll (déverrouillage LIFO, cf. scroll-lock.ts).
  private unlockBodyScroll: (() => void) | null = null;
  @Input({ required: true }) sources: ResponsiveSource[] = [];
  @Input({ required: true }) fallbackSrc = '';
  @Input({ required: true }) alt = '';
  @Input() currentIndex = 0;
  @Input() total = 1;
  @Output() closed = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.unlockBodyScroll = lockBodyScroll(this.document);
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll?.();
    this.unlockBodyScroll = null;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (!this.canNavigate) return;
    this.previous.emit();
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (!this.canNavigate) return;
    this.next.emit();
  }

  protected get canNavigate(): boolean {
    return this.total > 1;
  }
}
