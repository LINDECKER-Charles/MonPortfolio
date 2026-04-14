import { Component, Input, computed, input } from '@angular/core';

export interface ResponsiveSource {
  src: string;
  width?: number;
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
  @Input() fetchPriority: 'high' | 'low' | 'auto' = 'auto';
  @Input() sizes?: string;
  @Input() objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() objectPosition = 'center';

  get sortedSources(): ResponsiveSource[] {
    return [...this.sources].sort((a, b) => {
      const aw = a.width ?? a.maxWidth ?? Number.MAX_SAFE_INTEGER;
      const bw = b.width ?? b.maxWidth ?? Number.MAX_SAFE_INTEGER;
      return aw - bw;
    });
  }

  get usesWidthDescriptors(): boolean {
    return this.sortedSources.length > 0 && this.sortedSources.every((source) => !!source.width);
  }

  get sourceTypes(): string[] {
    return [...new Set(this.sortedSources.map((source) => source.type).filter(Boolean) as string[])];
  }

  buildMedia(maxWidth?: number): string | null {
    return maxWidth ? `(max-width: ${maxWidth}px)` : null;
  }

  buildSrcSet(type?: string): string {
    return this.sortedSources
      .filter((source) => source.type === type)
      .map((source) => `${source.src} ${source.width}w`)
      .join(', ');
  }
}
