import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/blendercollection/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/blendercollection/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const BLENDER_COLLECTION_HOME_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection home',
  fallbackSrc: '/project/blendercollection/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 26 },
    { width: 40, height: 44 },
    { width: 80, height: 89 },
    { width: 160, height: 178 },
    { width: 320, height: 357 },
    { width: 640, height: 714 },
    { width: 768, height: 857 },
    { width: 1024, height: 1142 },
    { width: 1280, height: 1428 },
    { width: 1536, height: 1714 },
  ]),
};

export const BLENDER_COLLECTION_COLLECTION_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection collections',
  fallbackSrc: '/project/blendercollection/collection.webp',
  sources: buildResponsiveImageSources('collection', [
    { width: 24, height: 29 },
    { width: 40, height: 48 },
    { width: 80, height: 97 },
    { width: 160, height: 194 },
    { width: 320, height: 389 },
    { width: 640, height: 779 },
    { width: 768, height: 935 },
    { width: 1024, height: 1246 },
    { width: 1280, height: 1558 },
  ]),
};

export const BLENDER_COLLECTION_CONTACT_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection contact and community',
  fallbackSrc: '/project/blendercollection/contact.webp',
  sources: buildResponsiveImageSources('contact', [
    { width: 24, height: 25 },
    { width: 40, height: 42 },
    { width: 80, height: 85 },
    { width: 160, height: 171 },
    { width: 320, height: 342 },
    { width: 640, height: 684 },
    { width: 768, height: 821 },
    { width: 1024, height: 1095 },
    { width: 1280, height: 1369 },
    { width: 1536, height: 1642 },
  ]),
};

export const BLENDER_COLLECTION_DETAIL_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection detail view',
  fallbackSrc: '/project/blendercollection/detail.webp',
  sources: buildResponsiveImageSources('detail', [
    { width: 24, height: 25 },
    { width: 40, height: 43 },
    { width: 80, height: 86 },
    { width: 160, height: 172 },
    { width: 320, height: 345 },
    { width: 640, height: 691 },
    { width: 768, height: 830 },
    { width: 1024, height: 1106 },
    { width: 1280, height: 1383 },
  ]),
};

export const BLENDER_COLLECTION_EXPLAIN_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection explain section',
  fallbackSrc: '/project/blendercollection/explain.webp',
  sources: buildResponsiveImageSources('explain', [
    { width: 24, height: 19 },
    { width: 40, height: 32 },
    { width: 80, height: 65 },
    { width: 160, height: 131 },
    { width: 320, height: 262 },
    { width: 640, height: 524 },
    { width: 768, height: 628 },
    { width: 1024, height: 838 },
    { width: 1280, height: 1048 },
    { width: 1536, height: 1257 },
  ]),
};

export const BLENDER_COLLECTION_PROFILE_IMAGE: ProjectMediaImage = {
  alt: 'Blender Collection profile',
  fallbackSrc: '/project/blendercollection/profil.webp',
  sources: buildResponsiveImageSources('profil', [
    { width: 24, height: 24 },
    { width: 40, height: 40 },
    { width: 80, height: 80 },
    { width: 160, height: 160 },
    { width: 320, height: 321 },
    { width: 640, height: 642 },
    { width: 768, height: 771 },
    { width: 1024, height: 1028 },
    { width: 1280, height: 1285 },
    { width: 1536, height: 1542 },
  ]),
};

export const BLENDER_COLLECTION_IMAGES: ProjectMediaImage[] = [
  BLENDER_COLLECTION_HOME_IMAGE,
  BLENDER_COLLECTION_COLLECTION_IMAGE,
  BLENDER_COLLECTION_DETAIL_IMAGE,
  BLENDER_COLLECTION_EXPLAIN_IMAGE,
  BLENDER_COLLECTION_CONTACT_IMAGE,
  BLENDER_COLLECTION_PROFILE_IMAGE,
];
