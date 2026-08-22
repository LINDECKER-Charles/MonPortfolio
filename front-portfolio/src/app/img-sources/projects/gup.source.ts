import type { ProjectMediaImage } from '../../components/page/projects/projects.types';
import { buildProjectImage } from './project-image.builder';

export const GUP_IMAGES: ProjectMediaImage[] = [
  buildProjectImage('gup', 'gup', 'Interface en ligne de commande de gup', [
    { width: 24, height: 14 },
    { width: 40, height: 24 },
    { width: 80, height: 48 },
    { width: 160, height: 95 },
    { width: 320, height: 190 },
    { width: 640, height: 381 },
    { width: 768, height: 457 },
    { width: 1024, height: 609 },
  ]),
];
