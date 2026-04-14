import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/Dev-mates/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/Dev-mates/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const DEV_MATES_HOME_IMAGE: ProjectMediaImage = {
  alt: 'Dev-Mates home',
  fallbackSrc: '/project/Dev-mates/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 25 },
    { width: 40, height: 42 },
    { width: 80, height: 85 },
    { width: 160, height: 171 },
    { width: 320, height: 343 },
    { width: 640, height: 686 },
    { width: 768, height: 823 },
    { width: 1024, height: 1097 },
    { width: 1280, height: 1372 },
    { width: 1536, height: 1646 },
  ]),
};

export const DEV_MATES_CONTACT_IMAGE: ProjectMediaImage = {
  alt: 'Dev-Mates contact',
  fallbackSrc: '/project/Dev-mates/contact.webp',
  sources: buildResponsiveImageSources('contact', [
    { width: 24, height: 26 },
    { width: 40, height: 44 },
    { width: 80, height: 89 },
    { width: 160, height: 178 },
    { width: 320, height: 356 },
    { width: 640, height: 713 },
    { width: 768, height: 855 },
    { width: 1024, height: 1141 },
    { width: 1280, height: 1426 },
    { width: 1536, height: 1711 },
  ]),
};

export const DEV_MATES_SERVICE_IMAGE: ProjectMediaImage = {
  alt: 'Dev-Mates service',
  fallbackSrc: '/project/Dev-mates/service.webp',
  sources: buildResponsiveImageSources('service', [
    { width: 24, height: 19 },
    { width: 40, height: 32 },
    { width: 80, height: 65 },
    { width: 160, height: 131 },
    { width: 320, height: 263 },
    { width: 640, height: 527 },
    { width: 768, height: 633 },
    { width: 1024, height: 844 },
    { width: 1280, height: 1055 },
    { width: 1536, height: 1266 },
  ]),
};

export const DEV_MATES_APPLICATION_IMAGE: ProjectMediaImage = {
  alt: 'Dev-Mates application',
  fallbackSrc: '/project/Dev-mates/application.webp',
  sources: buildResponsiveImageSources('application', [
    { width: 24, height: 22 },
    { width: 40, height: 38 },
    { width: 80, height: 76 },
    { width: 160, height: 152 },
    { width: 320, height: 304 },
    { width: 640, height: 609 },
    { width: 768, height: 731 },
    { width: 1024, height: 975 },
    { width: 1280, height: 1219 },
    { width: 1536, height: 1463 },
  ]),
};

export const DEV_MATES_IMAGES: ProjectMediaImage[] = [
  DEV_MATES_HOME_IMAGE,
  DEV_MATES_SERVICE_IMAGE,
  DEV_MATES_APPLICATION_IMAGE,
  DEV_MATES_CONTACT_IMAGE,
];
