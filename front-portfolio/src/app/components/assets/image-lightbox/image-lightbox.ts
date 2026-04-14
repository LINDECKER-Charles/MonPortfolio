import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../responsive-picture/responsive-picture';

@Component({
  selector: 'app-image-lightbox',
  imports: [ResponsivePicture],
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.css',
})
export class ImageLightbox {
  @Input({ required: true }) sources: ResponsiveSource[] = [];
  @Input({ required: true }) fallbackSrc = '';
  @Input({ required: true }) alt = '';
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close.emit();
  }
}
