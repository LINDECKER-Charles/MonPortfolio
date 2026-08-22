import type { ProjectMediaImage } from '../../components/page/projects/projects.types';
import { buildProjectImage } from './project-image.builder';

// All LoDB captures are 16:10 hero shots (matching the modal carousel), so the
// five media images share a single responsive ladder.
const LODB_SIZES = [
  { width: 24, height: 15 },
  { width: 40, height: 25 },
  { width: 80, height: 50 },
  { width: 160, height: 100 },
  { width: 320, height: 200 },
  { width: 640, height: 400 },
  { width: 768, height: 480 },
  { width: 1024, height: 640 },
  { width: 1280, height: 800 },
  { width: 1536, height: 960 },
];

export const LODB_HOME_IMAGE = buildProjectImage(
  'lodb',
  'home',
  'League of Data Base home',
  LODB_SIZES,
);
export const LODB_CHAMP_IMAGE = buildProjectImage(
  'lodb',
  'champ',
  'League of Data Base champions',
  LODB_SIZES,
);
export const LODB_ITEMS_IMAGE = buildProjectImage(
  'lodb',
  'items',
  'League of Data Base items',
  LODB_SIZES,
);
export const LODB_RUNE_IMAGE = buildProjectImage(
  'lodb',
  'rune',
  'League of Data Base runes',
  LODB_SIZES,
);
export const LODB_SUMM_IMAGE = buildProjectImage(
  'lodb',
  'summ',
  'League of Data Base summoner spells',
  LODB_SIZES,
);

export const LODB_IMAGES: ProjectMediaImage[] = [
  LODB_HOME_IMAGE,
  LODB_CHAMP_IMAGE,
  LODB_ITEMS_IMAGE,
  LODB_RUNE_IMAGE,
  LODB_SUMM_IMAGE,
];
