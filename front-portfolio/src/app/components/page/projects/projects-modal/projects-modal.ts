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
  SecurityContext,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageLightbox } from '../../../assets/image-lightbox/image-lightbox';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { labeled, SHARED_IMAGES } from '../../../../img-sources/shared.sources';
import type { ProjectItem } from '../projects.types';
import { formatProjectPeriod } from '../projects.utils';
import { TranslationService } from '../../../../services/translation.service';
import { FocusTrapDirective } from '../../../../directives/focus-trap.directive';
import { lockBodyScroll } from '../../../../utils/scroll-lock';

@Component({
  selector: 'app-projects-modal',
  imports: [ResponsivePicture, ImageLightbox, FocusTrapDirective],
  templateUrl: './projects-modal.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './projects-modal.css',
})
export class ProjectsModal implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private unlockBodyScroll: (() => void) | null = null;

  protected readonly ts = inject(TranslationService);

  @Input({ required: true }) project!: ProjectItem;
  @Input() currentImageIndex = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() nextImage = new EventEmitter<void>();
  @Output() previousImage = new EventEmitter<void>();
  protected isImageLightboxOpen = false;

  protected readonly githubIcon = labeled(SHARED_IMAGES.stack.github, 'GitHub');

  // Le modal possède son verrou de scroll : ouvert = monté, fermé = détruit.
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
    if (this.isImageLightboxOpen) {
      this.closeImageLightbox();
      return;
    }
    this.closed.emit();
  }

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
    return formatProjectPeriod(this.project, this.ts.lang(), this.ts.translate('projects.today'));
  }

  protected openImageLightbox(): void {
    if (!this.currentImage) return;
    this.isImageLightboxOpen = true;
  }

  protected closeImageLightbox(): void {
    this.isImageLightboxOpen = false;
  }
}
