import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../assets/responsive-picture/responsive-picture';
import { ProjectItem } from '../../../page/projects/projects.state';
import { formatProjectPeriod } from '../../../page/projects/projects.utils';

interface ProjectIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-projects-modal',
  imports: [CommonModule, ResponsivePicture],
  templateUrl: './projects-modal.html',
  styleUrl: './projects-modal.css',
})
export class ProjectsModal {
  @Input({ required: true }) project!: ProjectItem;
  @Input() currentImageIndex = 0;
  @Output() close = new EventEmitter<void>();
  @Output() nextImage = new EventEmitter<void>();
  @Output() previousImage = new EventEmitter<void>();

  protected readonly githubIcon = this.buildStackIconSet('github', 'GitHub');

  constructor(private readonly sanitizer: DomSanitizer) {}

  protected get currentImage() {
    const images = this.project.detail?.images ?? [];
    if (!images.length) return null;
    return images[this.currentImageIndex] ?? null;
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

  private buildStackIconSet(name: string, alt: string): ProjectIconSet {
    return {
      alt,
      sources: [
        { src: `/icon/stack/24x24_${name}.webp`, maxWidth: 320, type: 'image/webp' },
        { src: `/icon/stack/40x40_${name}.webp`, maxWidth: 480, type: 'image/webp' },
        { src: `/icon/stack/80x80_${name}.webp`, maxWidth: 768, type: 'image/webp' },
        { src: `/icon/stack/160x160_${name}.webp`, maxWidth: 1200, type: 'image/webp' },
        { src: `/icon/stack/${name}.webp`, type: 'image/webp' },
      ],
      fallback: `/icon/stack/${name}.webp`,
    };
  }
}
