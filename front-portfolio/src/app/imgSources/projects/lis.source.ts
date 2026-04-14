import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/LIS-Web/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/LIS-Web/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const LIS_HOME_IMAGE: ProjectMediaImage = {
  alt: 'LIS Web home',
  fallbackSrc: '/project/LIS-Web/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 22 },
    { width: 40, height: 38 },
    { width: 80, height: 76 },
    { width: 160, height: 152 },
    { width: 320, height: 304 },
    { width: 640, height: 608 },
    { width: 768, height: 730 },
    { width: 1024, height: 973 },
    { width: 1280, height: 1216 },
    { width: 1536, height: 1460 },
  ]),
};

export const LIS_HORAIRE_IMAGE: ProjectMediaImage = {
  alt: 'LIS Web horaire',
  fallbackSrc: '/project/LIS-Web/horaire.webp',
  sources: buildResponsiveImageSources('horaire', [
    { width: 24, height: 22 },
    { width: 40, height: 37 },
    { width: 80, height: 75 },
    { width: 160, height: 150 },
    { width: 320, height: 300 },
    { width: 640, height: 600 },
    { width: 768, height: 720 },
    { width: 1024, height: 960 },
    { width: 1280, height: 1200 },
    { width: 1536, height: 1441 },
  ]),
};

export const LIS_PARTENAIRES_IMAGE: ProjectMediaImage = {
  alt: 'LIS Web partenaires',
  fallbackSrc: '/project/LIS-Web/partenaires.webp',
  sources: buildResponsiveImageSources('partenaires', [
    { width: 24, height: 25 },
    { width: 40, height: 42 },
    { width: 80, height: 84 },
    { width: 160, height: 169 },
    { width: 320, height: 338 },
    { width: 640, height: 677 },
    { width: 768, height: 813 },
    { width: 1024, height: 1084 },
    { width: 1280, height: 1355 },
    { width: 1536, height: 1626 },
  ]),
};

export const LIS_SERVICE_IMAGE: ProjectMediaImage = {
  alt: 'LIS Web service',
  fallbackSrc: '/project/LIS-Web/service.webp',
  sources: buildResponsiveImageSources('service', [
    { width: 24, height: 18 },
    { width: 40, height: 31 },
    { width: 80, height: 62 },
    { width: 160, height: 125 },
    { width: 320, height: 250 },
    { width: 640, height: 500 },
    { width: 768, height: 600 },
    { width: 1024, height: 801 },
    { width: 1280, height: 1001 },
    { width: 1536, height: 1201 },
  ]),
};

export const LIS_WEB_IMAGES: ProjectMediaImage[] = [
  LIS_HOME_IMAGE,
  LIS_SERVICE_IMAGE,
  LIS_HORAIRE_IMAGE,
  LIS_PARTENAIRES_IMAGE,
];
