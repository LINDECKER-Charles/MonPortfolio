import { ProjectMediaImage } from '../../components/page/projects/projects.state';
import { buildProjectImage } from './project-image.builder';

export const SHREK_HOME_IMAGE = buildProjectImage('Shrek', 'home', 'Shreksophone home', [
  { width: 24, height: 21 },
  { width: 40, height: 36 },
  { width: 80, height: 72 },
  { width: 160, height: 144 },
  { width: 320, height: 288 },
  { width: 640, height: 576 },
  { width: 768, height: 691 },
  { width: 1024, height: 922 },
  { width: 1280, height: 1153 },
  { width: 1536, height: 1383 },
]);

export const SHREK_HOME_2_IMAGE = buildProjectImage(
  'Shrek',
  'home-2',
  'Shreksophone home alternate',
  [
    { width: 24, height: 23 },
    { width: 40, height: 39 },
    { width: 80, height: 79 },
    { width: 160, height: 158 },
    { width: 320, height: 317 },
    { width: 640, height: 634 },
    { width: 768, height: 761 },
    { width: 1024, height: 1015 },
    { width: 1280, height: 1268 },
    { width: 1536, height: 1522 },
  ],
);

export const SHREK_HOME_3_IMAGE = buildProjectImage(
  'Shrek',
  'home-3',
  'Shreksophone fullscreen troll sequence',
  [
    { width: 24, height: 22 },
    { width: 40, height: 37 },
    { width: 80, height: 74 },
    { width: 160, height: 149 },
    { width: 320, height: 298 },
    { width: 640, height: 596 },
    { width: 768, height: 716 },
    { width: 1024, height: 954 },
    { width: 1280, height: 1193 },
    { width: 1536, height: 1432 },
  ],
);

export const SHREK_IMAGES: ProjectMediaImage[] = [
  SHREK_HOME_IMAGE,
  SHREK_HOME_2_IMAGE,
  SHREK_HOME_3_IMAGE,
];
