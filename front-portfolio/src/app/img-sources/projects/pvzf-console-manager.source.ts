import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/PVZF-Console-Manager/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/PVZF-Console-Manager/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const PVZF_CONSOLE_MANAGER_IMAGE: ProjectMediaImage = {
  alt: 'PVZ Fuzion Console Manager',
  fallbackSrc: '/project/PVZF-Console-Manager/pvzf-console.webp',
  sources: buildResponsiveImageSources('pvzf-console', [
    { width: 24, height: 18 },
    { width: 40, height: 30 },
    { width: 80, height: 61 },
    { width: 160, height: 121 },
    { width: 320, height: 242 },
    { width: 640, height: 484 },
    { width: 768, height: 581 },
    { width: 1024, height: 775 },
  ]),
};

export const PVZF_CONSOLE_MANAGER_IMAGES: ProjectMediaImage[] = [
  PVZF_CONSOLE_MANAGER_IMAGE,
];
