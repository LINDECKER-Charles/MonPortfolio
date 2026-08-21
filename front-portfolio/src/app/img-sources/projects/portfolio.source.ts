import type { ProjectMediaImage } from '../../components/page/projects/projects.types';
import { buildProjectImage } from './project-image.builder';

export const PORTFOLIO_HOME_IMAGE = buildProjectImage('Portfolio', 'home', 'Portfolio home', [
  { width: 24, height: 26 },
  { width: 40, height: 43 },
  { width: 80, height: 87 },
  { width: 160, height: 174 },
  { width: 320, height: 347 },
  { width: 640, height: 695 },
  { width: 768, height: 834 },
  { width: 1024, height: 1111 },
  { width: 1280, height: 1389 },
]);

export const PORTFOLIO_OPENING_1_IMAGE = buildProjectImage(
  'Portfolio',
  'opening-1',
  'Portfolio séquence d’ouverture (1)',
  [
    { width: 24, height: 30 },
    { width: 40, height: 50 },
    { width: 80, height: 100 },
    { width: 160, height: 201 },
    { width: 320, height: 402 },
    { width: 640, height: 803 },
    { width: 768, height: 964 },
    { width: 1024, height: 1285 },
    { width: 1280, height: 1606 },
  ],
);

export const PORTFOLIO_OPENING_2_IMAGE = buildProjectImage(
  'Portfolio',
  'opening-2',
  'Portfolio séquence d’ouverture (2)',
  [
    { width: 24, height: 29 },
    { width: 40, height: 48 },
    { width: 80, height: 96 },
    { width: 160, height: 191 },
    { width: 320, height: 383 },
    { width: 640, height: 766 },
    { width: 768, height: 919 },
    { width: 1024, height: 1225 },
    { width: 1280, height: 1531 },
  ],
);

export const PORTFOLIO_PROJECT_IMAGE = buildProjectImage(
  'Portfolio',
  'project',
  'Portfolio page projets',
  [
    { width: 24, height: 29 },
    { width: 40, height: 48 },
    { width: 80, height: 96 },
    { width: 160, height: 192 },
    { width: 320, height: 385 },
    { width: 640, height: 769 },
    { width: 768, height: 923 },
    { width: 1024, height: 1231 },
    { width: 1280, height: 1539 },
  ],
);

export const PORTFOLIO_RESUME_IMAGE = buildProjectImage(
  'Portfolio',
  'resume',
  'Portfolio page CV',
  [
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
  ],
);

export const PORTFOLIO_WORK_IMAGE = buildProjectImage(
  'Portfolio',
  'work',
  'Portfolio page parcours',
  [
    { width: 24, height: 28 },
    { width: 40, height: 47 },
    { width: 80, height: 93 },
    { width: 160, height: 186 },
    { width: 320, height: 373 },
    { width: 640, height: 746 },
    { width: 768, height: 895 },
    { width: 1024, height: 1193 },
    { width: 1280, height: 1491 },
  ],
);

export const PORTFOLIO_IMAGES: ProjectMediaImage[] = [
  PORTFOLIO_HOME_IMAGE,
  PORTFOLIO_OPENING_1_IMAGE,
  PORTFOLIO_OPENING_2_IMAGE,
  PORTFOLIO_PROJECT_IMAGE,
  PORTFOLIO_WORK_IMAGE,
  PORTFOLIO_RESUME_IMAGE,
];
