import {ResponsiveSource} from '../../../assets/responsive-picture/responsive-picture';

export const HOME_RESUME_PHOTO_SOURCES: ResponsiveSource[] = [
  {
    src: '/photos/160x213_me.webp',
    maxWidth: 480,
    type: 'image/webp',
  },
  {
    src: '/photos/320x426_me.webp',
    maxWidth: 768,
    type: 'image/webp',
  },
  {
    src: '/photos/640x853_me.webp',
    type: 'image/webp',
  },
  {
    src: '/photos/160x213_me.jpg',
    maxWidth: 480,
    type: 'image/jpeg',
  },
  {
    src: '/photos/320x426_me.jpg',
    maxWidth: 768,
    type: 'image/jpeg',
  },
  {
    src: '/photos/640x853_me.jpg',
    type: 'image/jpeg',
  },
];

export const HOME_RESUME_PHOTO_FALLBACK = '/photos/me.webp';

export const HOME_RESUME_LUCIDITY_SOURCES: ResponsiveSource[] = [
  {
    src: '/icon/lucidity/24.png',
    maxWidth: 480,
    type: 'image/png',
  },
  {
    src: '/icon/lucidity/40.png',
    maxWidth: 768,
    type: 'image/png',
  },
  {
    src: '/icon/lucidity/80.png',
    maxWidth: 1200,
    type: 'image/png',
  },
  {
    src: '/icon/lucidity/160.png',
    type: 'image/png',
  },
];

export const HOME_RESUME_LUCIDITY_FALLBACK = '/icon/lucidity/160.png';
