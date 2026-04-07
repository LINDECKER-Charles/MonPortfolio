import { ResponsiveSource } from '../components/assets/responsive-picture/responsive-picture';

interface ResponsiveImageSet {
  fallbackSrc: string;
  sources: ResponsiveSource[];
}

function createSources(
  pathPrefix: string,
  baseName: string,
  sizes: Array<{ filePrefix: string; maxWidth?: number }>
): ResponsiveSource[] {
  return sizes.flatMap(({ filePrefix, maxWidth }) => [
    {
      src: `${pathPrefix}/${filePrefix}${baseName}.webp`,
      maxWidth,
      type: 'image/webp',
    },
    {
      src: `${pathPrefix}/${filePrefix}${baseName}.png`,
      maxWidth,
      type: 'image/png',
    },
  ]);
}

function createImageSet(
  pathPrefix: string,
  baseName: string,
  sizes: Array<{ filePrefix: string; maxWidth?: number }>,
  fallbackPrefix: string
): ResponsiveImageSet {
  return {
    sources: createSources(pathPrefix, baseName, sizes),
    fallbackSrc: `${pathPrefix}/${fallbackPrefix}${baseName}.png`,
  };
}

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
  { filePrefix: '40x40_', maxWidth: 480 },
  { filePrefix: '80x80_', maxWidth: 1024 },
  { filePrefix: '160x160_' },
];

export const RESUM_IMAGES = {
  stats: {
    level: createImageSet('./icon', 'level', STAT_SIZES, '160x160_'),
    bloodEcho: createImageSet('./icon', 'blood_echo', STAT_SIZES, '160x160_'),
    strength: createImageSet('./icon', 'strenght', STAT_SIZES, '160x160_'),
    dex: createImageSet('./icon', 'dex', STAT_SIZES, '160x160_'),
    discover: createImageSet('./icon', 'discover', STAT_SIZES, '160x160_'),
    bloodtinge: createImageSet('./icon', 'bloodtig', STAT_SIZES, '160x160_'),
    eso: createImageSet('./icon', 'eso', STAT_SIZES, '160x160_'),
  },
  stack: {
    dotnet: createImageSet('./icon/stack', 'dotnet', STACK_SIZES, '160x160_'),
    angular: createImageSet('./icon/stack', 'angular', STACK_SIZES, '160x160_'),
    symfony: createImageSet('./icon/stack', 'symfony', STACK_SIZES, '160x160_'),
    postgre: createImageSet('./icon/stack', 'postgre', STACK_SIZES, '160x160_'),
    action: createImageSet('./icon/stack', 'action', STACK_SIZES, '160x160_'),
    python: createImageSet('./icon/stack', 'python', STACK_SIZES, '160x160_'),
    github: createImageSet('./icon/stack', 'github', STACK_SIZES, '160x160_'),
    linkedin: createImageSet('./icon/stack', 'linkedin', STACK_SIZES, '160x160_'),
    mail: createImageSet('./icon/stack', 'mail', STACK_SIZES, '160x160_'),
  },
  runes: {
    gear: createImageSet('./icon', 'blood_res', STAT_SIZES, '160x160_'),
    brain: createImageSet('./icon', 'eso_resist', STAT_SIZES, '160x160_'),
    fire: createImageSet('./icon', 'hearth', STAT_SIZES, '160x160_'),
    moon: createImageSet('./icon', 'endurance', STAT_SIZES, '160x160_'),
  },
  projects: {
    mainW1: createImageSet('./icon/project', 'main_w_1', PROJECT_SIZES, '160x160_'),
    mainW2: createImageSet('./icon/project', 'main_w_2', PROJECT_SIZES, '160x160_'),
    secondW1: createImageSet('./icon/project', 'second_w_1', PROJECT_SIZES, '160x160_'),
    secondW2: createImageSet('./icon/project', 'second_w_2', PROJECT_SIZES, '160x160_'),
  },
} as const;
