import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/PVZF-Traduction/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/PVZF-Traduction/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const PVZF_TRADUCTION_GITHUB_IMAGE: ProjectMediaImage = {
  alt: 'PVZF Translation FR sur GitHub',
  fallbackSrc: '/project/PVZF-Traduction/github.webp',
  sources: buildResponsiveImageSources('github', [
    { width: 24, height: 17 },
    { width: 40, height: 28 },
    { width: 80, height: 56 },
    { width: 160, height: 113 },
    { width: 320, height: 225 },
    { width: 640, height: 451 },
    { width: 768, height: 541 },
    { width: 1024, height: 721 },
    { width: 1280, height: 902 },
    { width: 1536, height: 1082 },
  ]),
};

export const PVZF_TRADUCTION_CONTRIBUTION_IMAGE: ProjectMediaImage = {
  alt: 'PVZF Translation FR contribution',
  fallbackSrc: '/project/PVZF-Traduction/contribution.webp',
  sources: buildResponsiveImageSources('contribution', [
    { width: 24, height: 20 },
    { width: 40, height: 33 },
    { width: 80, height: 66 },
    { width: 160, height: 132 },
    { width: 320, height: 265 },
    { width: 640, height: 530 },
    { width: 768, height: 636 },
    { width: 1024, height: 848 },
    { width: 1280, height: 1059 },
    { width: 1536, height: 1271 },
  ]),
};

export const PVZF_TRADUCTION_P1_IMAGE: ProjectMediaImage = {
  alt: 'PVZF Translation FR aperçu en jeu',
  fallbackSrc: '/project/PVZF-Traduction/p1.webp',
  sources: buildResponsiveImageSources('p1', [
    { width: 24, height: 14 },
    { width: 40, height: 23 },
    { width: 80, height: 45 },
    { width: 160, height: 90 },
    { width: 320, height: 180 },
    { width: 640, height: 360 },
    { width: 768, height: 432 },
    { width: 1024, height: 576 },
  ]),
};

export const PVZF_TRADUCTION_IMAGES: ProjectMediaImage[] = [
  PVZF_TRADUCTION_P1_IMAGE,
  PVZF_TRADUCTION_GITHUB_IMAGE,
  PVZF_TRADUCTION_CONTRIBUTION_IMAGE,
];
