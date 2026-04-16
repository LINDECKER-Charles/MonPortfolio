import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/lodb/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/lodb/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const LODB_HOME_IMAGE: ProjectMediaImage = {
  alt: 'League of Data Base home',
  fallbackSrc: '/project/lodb/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 24 },
    { width: 40, height: 41 },
    { width: 80, height: 82 },
    { width: 160, height: 165 },
    { width: 320, height: 330 },
    { width: 640, height: 660 },
    { width: 768, height: 792 },
    { width: 1024, height: 1056 },
    { width: 1280, height: 1320 },
    { width: 1536, height: 1584 },
  ]),
};

export const LODB_CHAMP_IMAGE: ProjectMediaImage = {
  alt: 'League of Data Base champions',
  fallbackSrc: '/project/lodb/champ.webp',
  sources: buildResponsiveImageSources('champ', [
    { width: 24, height: 19 },
    { width: 40, height: 32 },
    { width: 80, height: 65 },
    { width: 160, height: 130 },
    { width: 320, height: 260 },
    { width: 640, height: 520 },
    { width: 768, height: 624 },
    { width: 1024, height: 833 },
    { width: 1280, height: 1041 },
    { width: 1536, height: 1249 },
  ]),
};

export const LODB_ITEMS_IMAGE: ProjectMediaImage = {
  alt: 'League of Data Base items',
  fallbackSrc: '/project/lodb/items.webp',
  sources: buildResponsiveImageSources('items', [
    { width: 24, height: 20 },
    { width: 40, height: 34 },
    { width: 80, height: 68 },
    { width: 160, height: 137 },
    { width: 320, height: 274 },
    { width: 640, height: 548 },
    { width: 768, height: 658 },
    { width: 1024, height: 877 },
    { width: 1280, height: 1096 },
  ]),
};

export const LODB_RUNE_IMAGE: ProjectMediaImage = {
  alt: 'League of Data Base runes',
  fallbackSrc: '/project/lodb/rune.webp',
  sources: buildResponsiveImageSources('rune', [
    { width: 24, height: 18 },
    { width: 40, height: 30 },
    { width: 80, height: 60 },
    { width: 160, height: 121 },
    { width: 320, height: 243 },
    { width: 640, height: 487 },
    { width: 768, height: 584 },
    { width: 1024, height: 779 },
    { width: 1280, height: 974 },
    { width: 1536, height: 1168 },
  ]),
};

export const LODB_SUMM_IMAGE: ProjectMediaImage = {
  alt: 'League of Data Base summoner spells',
  fallbackSrc: '/project/lodb/summ.webp',
  sources: buildResponsiveImageSources('summ', [
    { width: 24, height: 20 },
    { width: 40, height: 34 },
    { width: 80, height: 69 },
    { width: 160, height: 138 },
    { width: 320, height: 276 },
    { width: 640, height: 553 },
    { width: 768, height: 664 },
    { width: 1024, height: 886 },
    { width: 1280, height: 1107 },
  ]),
};

export const LODB_IMAGES: ProjectMediaImage[] = [
  LODB_HOME_IMAGE,
  LODB_CHAMP_IMAGE,
  LODB_ITEMS_IMAGE,
  LODB_RUNE_IMAGE,
  LODB_SUMM_IMAGE,
];
