import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../responsive-picture/responsive-picture';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-image-lightbox',
  imports: [ResponsivePicture],
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.css',
})
export class ImageLightbox {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) sources: ResponsiveSource[] = [];
  @Input({ required: true }) fallbackSrc = '';
  @Input({ required: true }) alt = '';
  @Input() currentIndex = 0;
  @Input() total = 1;
  @Output() close = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close.emit();
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
