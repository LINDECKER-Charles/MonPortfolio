import {ResponsiveSource} from '../../components/assets/responsive-picture/responsive-picture';
import {ProjectMediaImage} from '../../components/page/projects/projects.state';

const buildResponsiveImageSources = (
  name: string,
  sizes: Array<{ width: number; height: number }>
): ResponsiveSource[] => {
  const sources: ResponsiveSource[] = [];

  for (const size of sizes) {
    const srcBase = `/project/Portfolio/${size.width}x${size.height}_${name}`;

    sources.push({
      src: `${srcBase}.webp`,
      maxWidth: size.width,
      type: 'image/webp',
    });
  }

  sources.push({
    src: `/project/Portfolio/${name}.webp`,
    type: 'image/webp',
  });

  return sources;
};

export const PORTFOLIO_HOME_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio home',
  fallbackSrc: '/project/Portfolio/home.webp',
  sources: buildResponsiveImageSources('home', [
    { width: 24, height: 26 },
    { width: 40, height: 43 },
    { width: 80, height: 87 },
    { width: 160, height: 174 },
    { width: 320, height: 347 },
    { width: 640, height: 695 },
    { width: 768, height: 834 },
    { width: 1024, height: 1111 },
    { width: 1280, height: 1389 },
  ]),
};

export const PORTFOLIO_OPENING_1_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio séquence d’ouverture (1)',
  fallbackSrc: '/project/Portfolio/opening-1.webp',
  sources: buildResponsiveImageSources('opening-1', [
    { width: 24, height: 30 },
    { width: 40, height: 50 },
    { width: 80, height: 100 },
    { width: 160, height: 201 },
    { width: 320, height: 402 },
    { width: 640, height: 803 },
    { width: 768, height: 964 },
    { width: 1024, height: 1285 },
    { width: 1280, height: 1606 },
  ]),
};

export const PORTFOLIO_OPENING_2_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio séquence d’ouverture (2)',
  fallbackSrc: '/project/Portfolio/opening-2.webp',
  sources: buildResponsiveImageSources('opening-2', [
    { width: 24, height: 29 },
    { width: 40, height: 48 },
    { width: 80, height: 96 },
    { width: 160, height: 191 },
    { width: 320, height: 383 },
    { width: 640, height: 766 },
    { width: 768, height: 919 },
    { width: 1024, height: 1225 },
    { width: 1280, height: 1531 },
  ]),
};

export const PORTFOLIO_PROJECT_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio page projets',
  fallbackSrc: '/project/Portfolio/project.webp',
  sources: buildResponsiveImageSources('project', [
    { width: 24, height: 29 },
    { width: 40, height: 48 },
    { width: 80, height: 96 },
    { width: 160, height: 192 },
    { width: 320, height: 385 },
    { width: 640, height: 769 },
    { width: 768, height: 923 },
    { width: 1024, height: 1231 },
    { width: 1280, height: 1539 },
  ]),
};

export const PORTFOLIO_RESUME_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio page CV',
  fallbackSrc: '/project/Portfolio/resume.webp',
  sources: buildResponsiveImageSources('resume', [
    { width: 24, height: 17 },
    { width: 40, height: 28 },
    { width: 80, height: 55 },
    { width: 160, height: 111 },
    { width: 320, height: 221 },
    { width: 640, height: 442 },
    { width: 768, height: 531 },
    { width: 1024, height: 708 },
    { width: 1280, height: 884 },
    { width: 1536, height: 1061 },
  ]),
};

export const PORTFOLIO_WORK_IMAGE: ProjectMediaImage = {
  alt: 'Portfolio page parcours',
  fallbackSrc: '/project/Portfolio/work.webp',
  sources: buildResponsiveImageSources('work', [
    { width: 24, height: 28 },
    { width: 40, height: 47 },
    { width: 80, height: 93 },
    { width: 160, height: 186 },
    { width: 320, height: 373 },
    { width: 640, height: 746 },
    { width: 768, height: 895 },
    { width: 1024, height: 1193 },
    { width: 1280, height: 1491 },
  ]),
};

export const PORTFOLIO_IMAGES: ProjectMediaImage[] = [
  PORTFOLIO_HOME_IMAGE,
  PORTFOLIO_OPENING_1_IMAGE,
  PORTFOLIO_OPENING_2_IMAGE,
  PORTFOLIO_PROJECT_IMAGE,
  PORTFOLIO_WORK_IMAGE,
  PORTFOLIO_RESUME_IMAGE,
];
