import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/Omnicard/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/Omnicard/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const OMNICARD_ADMIN_VIEW_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard admin view',
  fallbackSrc: '/project/Omnicard/admin_view.webp',
  sources: buildResponsiveImageSources('admin_view', [
    { width: 24, height: 28 },
    { width: 40, height: 47 },
    { width: 80, height: 94 },
    { width: 160, height: 188 },
    { width: 320, height: 376 },
    { width: 640, height: 752 },
    { width: 768, height: 902 },
    { width: 1024, height: 1203 },
    { width: 1280, height: 1504 },
  ]),
};

export const OMNICARD_COLLECTION_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard collection',
  fallbackSrc: '/project/Omnicard/collection.webp',
  sources: buildResponsiveImageSources('collection', [
    { width: 24, height: 22 },
    { width: 40, height: 37 },
    { width: 80, height: 75 },
    { width: 160, height: 150 },
    { width: 320, height: 300 },
    { width: 640, height: 600 },
    { width: 768, height: 720 },
    { width: 1024, height: 960 },
    { width: 1280, height: 1200 },
    { width: 1536, height: 1440 },
  ]),
};

export const OMNICARD_DECK_BUILDING_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard deck building',
  fallbackSrc: '/project/Omnicard/deck_building.webp',
  sources: buildResponsiveImageSources('deck_building', [
    { width: 24, height: 22 },
    { width: 40, height: 37 },
    { width: 80, height: 75 },
    { width: 160, height: 150 },
    { width: 320, height: 301 },
    { width: 640, height: 602 },
    { width: 768, height: 722 },
    { width: 1024, height: 963 },
    { width: 1280, height: 1204 },
    { width: 1536, height: 1444 },
  ]),
};

export const OMNICARD_FRIENDS_SYSTEM_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard friends system',
  fallbackSrc: '/project/Omnicard/friends-systeme.webp',
  sources: buildResponsiveImageSources('friends-systeme', [
    { width: 24, height: 13 },
    { width: 40, height: 22 },
    { width: 80, height: 44 },
    { width: 160, height: 88 },
    { width: 320, height: 177 },
    { width: 640, height: 354 },
    { width: 768, height: 425 },
    { width: 1024, height: 567 },
    { width: 1280, height: 708 },
    { width: 1536, height: 850 },
  ]),
};

export const OMNICARD_HOME_PAGE_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard home page',
  fallbackSrc: '/project/Omnicard/home_page.webp',
  sources: buildResponsiveImageSources('home_page', [
    { width: 24, height: 20 },
    { width: 40, height: 34 },
    { width: 80, height: 68 },
    { width: 160, height: 137 },
    { width: 320, height: 274 },
    { width: 640, height: 549 },
    { width: 768, height: 659 },
    { width: 1024, height: 878 },
    { width: 1280, height: 1098 },
    { width: 1536, height: 1318 },
  ]),
};

export const OMNICARD_PACKET_OPENING_1_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard packet opening 1',
  fallbackSrc: '/project/Omnicard/packet-opening-1.webp',
  sources: buildResponsiveImageSources('packet-opening-1', [
    { width: 24, height: 17 },
    { width: 40, height: 28 },
    { width: 80, height: 57 },
    { width: 160, height: 114 },
    { width: 320, height: 228 },
    { width: 640, height: 456 },
    { width: 768, height: 548 },
    { width: 1024, height: 730 },
    { width: 1280, height: 913 },
  ]),
};

export const OMNICARD_PACKET_OPENING_2_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard packet opening 2',
  fallbackSrc: '/project/Omnicard/packet-opening-2.webp',
  sources: buildResponsiveImageSources('packet-opening-2', [
    { width: 24, height: 19 },
    { width: 40, height: 33 },
    { width: 80, height: 66 },
    { width: 160, height: 132 },
    { width: 320, height: 264 },
    { width: 640, height: 528 },
    { width: 768, height: 634 },
    { width: 1024, height: 845 },
    { width: 1280, height: 1056 },
    { width: 1536, height: 1268 },
  ]),
};

export const OMNICARD_PROFILE_IMAGE: ProjectMediaImage = {
  alt: 'Omnicard profile',
  fallbackSrc: '/project/Omnicard/profil.webp',
  sources: buildResponsiveImageSources('profil', [
    { width: 24, height: 23 },
    { width: 40, height: 39 },
    { width: 80, height: 79 },
    { width: 160, height: 158 },
    { width: 320, height: 316 },
    { width: 640, height: 632 },
    { width: 768, height: 759 },
    { width: 1024, height: 1012 },
    { width: 1280, height: 1265 },
  ]),
};

export const OMNICARD_IMAGES: ProjectMediaImage[] = [
  OMNICARD_HOME_PAGE_IMAGE,
  OMNICARD_COLLECTION_IMAGE,
  OMNICARD_DECK_BUILDING_IMAGE,
  OMNICARD_PACKET_OPENING_1_IMAGE,
  OMNICARD_PACKET_OPENING_2_IMAGE,
  OMNICARD_ADMIN_VIEW_IMAGE,
  OMNICARD_FRIENDS_SYSTEM_IMAGE,
  OMNICARD_PROFILE_IMAGE,
];
