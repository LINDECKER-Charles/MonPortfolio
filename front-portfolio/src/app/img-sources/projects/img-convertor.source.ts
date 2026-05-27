import { ProjectMediaImage } from '../../components/page/projects/projects.state';
import { buildProjectImage } from './project-image.builder';

export const IMG_CONVERTOR_IMAGES: ProjectMediaImage[] = [
  buildProjectImage('img-convertor', 'img-convertor', 'Interface en ligne de commande de img-convertor', [
    { width: 24, height: 11 },
    { width: 40, height: 19 },
    { width: 80, height: 37 },
    { width: 160, height: 75 },
    { width: 320, height: 149 },
    { width: 640, height: 299 },
  ]),
];
