import { Component, Input } from '@angular/core';

export interface ResponsiveSource {
  src: string;
  width?: number;
  maxWidth?: number;
  type?: string;
}

/**
 * Contrat de rendu — à la charge du composant, ne pas redéclarer côté parent :
 *
 * - Dimensions : `:host`, `picture` et `img` posent déjà `display: block` et
 *   `width/height: 100%` (voir `responsive-picture.css`). Le parent dimensionne
 *   uniquement son conteneur (ou l'hôte `app-responsive-picture` lui-même) ;
 *   les triplets `X app-responsive-picture, X picture, X img { width/height... }`
 *   sont redondants — et leurs parties `picture`/`img` sont de toute façon
 *   inertes sous l'encapsulation émulée.
 * - Cadrage : `object-fit`/`object-position` sont posés en style inline sur
 *   l'`<img>` depuis les inputs `objectFit` (défaut `cover`) et
 *   `objectPosition` (défaut `center`). Tout `object-fit` déclaré par un
 *   parent sur l'image est écrasé : passer par les inputs.
 * - Sources : triées par largeur croissante ; descripteurs `w` groupés par
 *   `type` quand toutes les sources portent `width`, sinon une `<source>` par
 *   entrée avec `media="(max-width: …px)"` dérivé de `maxWidth`.
 */
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
    return [
      ...new Set(this.sortedSources.map((source) => source.type).filter(Boolean) as string[]),
    ];
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
