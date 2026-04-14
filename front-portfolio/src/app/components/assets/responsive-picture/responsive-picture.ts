import { Component, Input, computed, input } from '@angular/core';

export interface ResponsiveSource {
  src: string;
  maxWidth?: number;
  type?: string;
}

@Component({
  selector: 'app-responsive-picture',
  imports: [],
  templateUrl: './responsive-picture.html',
  styleUrl: './responsive-picture.css',
})
export class ResponsivePicture {
  @Input({ required: true }) sources: ResponsiveSource[] = [];
  @Input({ required: true }) fallbackSrc!: string;
  @Input() alt = '';
  @Input() loading: 'eager' | 'lazy' = 'lazy';
  @Input() decoding: 'sync' | 'async' | 'auto' = 'async';
  @Input() objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() objectPosition = 'center';

  get sortedSources(): ResponsiveSource[] {
    return [...this.sources].sort((a, b) => {
      const aw = a.maxWidth ?? Number.MAX_SAFE_INTEGER;
      const bw = b.maxWidth ?? Number.MAX_SAFE_INTEGER;
      return aw - bw;
    });
  }

  buildMedia(maxWidth?: number): string | null {
    return maxWidth ? `(max-width: ${maxWidth}px)` : null;
  }
}
