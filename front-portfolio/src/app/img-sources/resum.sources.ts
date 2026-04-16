import { createWebpImageSet } from './shared.sources';

const STAT_SIZES = [
  { filePrefix: '40x40_', maxWidth: 480 },
  { filePrefix: '80x80_', maxWidth: 1024 },
  { filePrefix: '160x160_' },
];

const STACK_SIZES = [
  { filePrefix: '24x24_', maxWidth: 340 },
  { filePrefix: '40x40_', maxWidth: 480 },
  { filePrefix: '80x80_', maxWidth: 1024 },
  { filePrefix: '160x160_' },
];

const PROJECT_SIZES = [
  { filePrefix: '24x24_', maxWidth: 340 },
  { filePrefix: '40x40_', maxWidth: 480 },
  { filePrefix: '80x80_', maxWidth: 1024 },
  { filePrefix: '160x160_' },
];

export const RESUM_IMAGES = {
  stats: {
    level: createWebpImageSet('./icon', 'level', STAT_SIZES, '160x160_'),
    bloodEcho: createWebpImageSet('./icon', 'blood_echo', STAT_SIZES, '160x160_'),
    strength: createWebpImageSet('./icon', 'strenght', STAT_SIZES, '160x160_'),
    dex: createWebpImageSet('./icon', 'dex', STAT_SIZES, '160x160_'),
    discover: createWebpImageSet('./icon', 'discover', STAT_SIZES, '160x160_'),
    bloodtinge: createWebpImageSet('./icon', 'bloodtig', STAT_SIZES, '160x160_'),
    eso: createWebpImageSet('./icon', 'eso', STAT_SIZES, '160x160_'),
  },
  stack: {
    dotnet: createWebpImageSet('./icon/stack', 'dotnet', STACK_SIZES, '160x160_'),
    angular: createWebpImageSet('./icon/stack', 'angular', STACK_SIZES, '160x160_'),
    symfony: createWebpImageSet('./icon/stack', 'symfony', STACK_SIZES, '160x160_'),
    postgre: createWebpImageSet('./icon/stack', 'postgre', STACK_SIZES, '160x160_'),
    action: createWebpImageSet('./icon/stack', 'action', STACK_SIZES, '160x160_'),
    python: createWebpImageSet('./icon/stack', 'python', STACK_SIZES, '160x160_'),
    github: createWebpImageSet('./icon/stack', 'github', STACK_SIZES, '160x160_'),
    linkedin: createWebpImageSet('./icon/stack', 'linkedin', STACK_SIZES, '160x160_'),
    mail: createWebpImageSet('./icon/stack', 'mail', STACK_SIZES, '160x160_'),
  },
  runes: {
    gear: createWebpImageSet('./icon', 'blood_res', STAT_SIZES, '160x160_'),
    brain: createWebpImageSet('./icon', 'eso_resist', STAT_SIZES, '160x160_'),
    fire: createWebpImageSet('./icon', 'hearth', STAT_SIZES, '160x160_'),
    moon: createWebpImageSet('./icon', 'endurance', STAT_SIZES, '160x160_'),
  },
  projects: {
    mainW1: createWebpImageSet('./icon/project', 'main_w_1', PROJECT_SIZES, '160x160_'),
    mainW2: createWebpImageSet('./icon/project', 'main_w_2', PROJECT_SIZES, '160x160_'),
    secondW1: createWebpImageSet('./icon/project', 'second_w_1', PROJECT_SIZES, '160x160_'),
    secondW2: createWebpImageSet('./icon/project', 'second_w_2', PROJECT_SIZES, '160x160_'),
  },
} as const;
