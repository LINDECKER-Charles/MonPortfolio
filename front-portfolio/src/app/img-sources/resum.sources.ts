import { imageServerUrl } from './image-server';
import { createWebpImageSet } from './shared.sources';

const ICON = imageServerUrl('/icon');
const ICON_STACK = imageServerUrl('/icon/stack');
const ICON_PROJECT = imageServerUrl('/icon/project');

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
    level: createWebpImageSet(ICON, 'level', STAT_SIZES, '160x160_'),
    bloodEcho: createWebpImageSet(ICON, 'blood_echo', STAT_SIZES, '160x160_'),
    strength: createWebpImageSet(ICON, 'strenght', STAT_SIZES, '160x160_'),
    dex: createWebpImageSet(ICON, 'dex', STAT_SIZES, '160x160_'),
    discover: createWebpImageSet(ICON, 'discover', STAT_SIZES, '160x160_'),
    bloodtinge: createWebpImageSet(ICON, 'bloodtig', STAT_SIZES, '160x160_'),
    eso: createWebpImageSet(ICON, 'eso', STAT_SIZES, '160x160_'),
  },
  stack: {
    dotnet: createWebpImageSet(ICON_STACK, 'dotnet', STACK_SIZES, '160x160_'),
    angular: createWebpImageSet(ICON_STACK, 'angular', STACK_SIZES, '160x160_'),
    symfony: createWebpImageSet(ICON_STACK, 'symfony', STACK_SIZES, '160x160_'),
    postgre: createWebpImageSet(ICON_STACK, 'postgre', STACK_SIZES, '160x160_'),
    action: createWebpImageSet(ICON_STACK, 'action', STACK_SIZES, '160x160_'),
    python: createWebpImageSet(ICON_STACK, 'python', STACK_SIZES, '160x160_'),
    github: createWebpImageSet(ICON_STACK, 'github', STACK_SIZES, '160x160_'),
    linkedin: createWebpImageSet(ICON_STACK, 'linkedin', STACK_SIZES, '160x160_'),
    mail: createWebpImageSet(ICON_STACK, 'mail', STACK_SIZES, '160x160_'),
  },
  runes: {
    gear: createWebpImageSet(ICON, 'blood_res', STAT_SIZES, '160x160_'),
    brain: createWebpImageSet(ICON, 'eso_resist', STAT_SIZES, '160x160_'),
    fire: createWebpImageSet(ICON, 'hearth', STAT_SIZES, '160x160_'),
    moon: createWebpImageSet(ICON, 'endurance', STAT_SIZES, '160x160_'),
  },
  projects: {
    mainW1: createWebpImageSet(ICON_PROJECT, 'main_w_1', PROJECT_SIZES, '160x160_'),
    mainW2: createWebpImageSet(ICON_PROJECT, 'main_w_2', PROJECT_SIZES, '160x160_'),
    secondW1: createWebpImageSet(ICON_PROJECT, 'second_w_1', PROJECT_SIZES, '160x160_'),
    secondW2: createWebpImageSet(ICON_PROJECT, 'second_w_2', PROJECT_SIZES, '160x160_'),
  },
} as const;

/** Forme complète du catalogue — consommée par les sous-composants du CV. */
export type ResumImages = typeof RESUM_IMAGES;
