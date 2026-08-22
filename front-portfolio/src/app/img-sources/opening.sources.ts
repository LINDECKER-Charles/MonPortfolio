import { ResponsiveSource } from '../components/assets/responsive-picture/responsive-picture';

export const OPENING_SOURCES: ResponsiveSource[] = [
  {
    src: './opening/40x40_opening_base.webp',
    maxWidth: 40,
    type: 'image/webp',
  },
  {
    src: './opening/80x80_opening_base.webp',
    maxWidth: 80,
    type: 'image/webp',
  },
  {
    src: './opening/160x160_opening_base.webp',
    maxWidth: 160,
    type: 'image/webp',
  },
  {
    src: './opening/320x320_opening_base.webp',
    maxWidth: 320,
    type: 'image/webp',
  },
  {
    src: './opening/640x640_opening_base.webp',
    maxWidth: 640,
    type: 'image/webp',
  },
  {
    src: './opening/768x768_opening_base.webp',
    maxWidth: 768,
    type: 'image/webp',
  },
  {
    src: './opening/opening_base.webp',
    type: 'image/webp',
  },
];

export const OPENING_FALLBACK_SRC = './opening/opening_base.webp';

/**
 * Rune de l'autel (home) : descripteurs de largeur pour que `sizes` pilote la
 * sélection (150 px desktop / 110 px mobile, DPR inclus) au lieu du viewport.
 */
export const LANTERN_RUNE_SOURCES: ResponsiveSource[] = [
  { src: './opening/160x160_opening_base.webp', width: 160, type: 'image/webp' },
  { src: './opening/320x320_opening_base.webp', width: 320, type: 'image/webp' },
  { src: './opening/640x640_opening_base.webp', width: 640, type: 'image/webp' },
];

export const LANTERN_RUNE_FALLBACK_SRC = './opening/320x320_opening_base.webp';
