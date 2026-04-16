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
