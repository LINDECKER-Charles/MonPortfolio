import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { ResponsivePicture, ResponsiveSource } from '../responsive-picture/responsive-picture';
import { FocusTrapDirective } from '../../../directives/focus-trap.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-image-lightbox',
  imports: [ResponsivePicture, FocusTrapDirective],
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.css',
})
export class ImageLightbox implements OnInit, OnDestroy {
  protected readonly ts = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  // On capture/restaure la valeur précédente plutôt que de forcer '' : la
  // lightbox peut s'ouvrir au-dessus d'un modal qui a déjà verrouillé le scroll.
  private previousBodyOverflow = '';
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
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    document.body.style.overflow = this.previousBodyOverflow;
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
