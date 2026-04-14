import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageLightbox } from '../../../assets/image-lightbox/image-lightbox';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../../imgSources/shared.sources';
import { ProjectItem } from '../projects.state';
import { formatProjectPeriod } from '../projects.utils';

interface ProjectIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-projects-modal',
  imports: [CommonModule, ResponsivePicture, ImageLightbox],
  templateUrl: './projects-modal.html',
  styleUrl: './projects-modal.css',
})
export class ProjectsModal {
  @Input({ required: true }) project!: ProjectItem;
  @Input() currentImageIndex = 0;
  @Output() close = new EventEmitter<void>();
  @Output() nextImage = new EventEmitter<void>();
  @Output() previousImage = new EventEmitter<void>();
  protected isImageLightboxOpen = false;

  protected readonly githubIcon: ProjectIconSet = {
    alt: 'GitHub',
    sources: SHARED_IMAGES.stack.github.sources,
    fallback: SHARED_IMAGES.stack.github.fallbackSrc,
  };

  constructor(private readonly sanitizer: DomSanitizer) {}

  protected get currentImage() {
    const images = this.project.detail?.images ?? [];
    if (!images.length) return null;
    return images[this.currentImageIndex] ?? null;
  }

  protected get hasMedia(): boolean {
    return Boolean(this.currentImage || this.safeVideoUrl);
  }

  protected get safeVideoUrl(): SafeResourceUrl | null {
    const video = this.project.detail?.video?.trim();
    if (!video) return null;

    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, video);
    if (!sanitizedUrl) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  protected formatPeriod(): string {
    return formatProjectPeriod(this.project);
  }

  protected openImageLightbox(): void {
    if (!this.currentImage) return;
    this.isImageLightboxOpen = true;
  }

  protected closeImageLightbox(): void {
    this.isImageLightboxOpen = false;
  }
}
