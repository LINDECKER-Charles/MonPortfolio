import { ResponsiveSource } from '../components/assets/responsive-picture/responsive-picture';

export interface ResponsiveImageSet {
  fallbackSrc: string;
  sources: ResponsiveSource[];
}

const ICON_SIZES = [
  { filePrefix: '24x24_', width: 24 },
  { filePrefix: '40x40_', width: 40 },
  { filePrefix: '80x80_', width: 80 },
] as const;

const PHOTO_SIZES = [
  { filePrefix: '320x426_', width: 320 },
  { filePrefix: '480x640_', width: 480 },
  { filePrefix: '640x853_', width: 640 },
  { filePrefix: '768x1024_', width: 768 },
  { filePrefix: '1024x1365_', width: 1024 },
  { filePrefix: '1280x1706_', width: 1280 },
  { filePrefix: '1536x2048_', width: 1536 },
] as const;

function buildWebpSources(
  pathPrefix: string,
  baseName: string,
  sizes: ReadonlyArray<{ filePrefix: string; width?: number; maxWidth?: number }>
): ResponsiveSource[] {
  return sizes.map(({ filePrefix, width, maxWidth }) => ({
    src: `${pathPrefix}/${filePrefix}${baseName}.webp`,
    width,
    maxWidth,
    type: 'image/webp',
  }));
}

export function createWebpImageSet(
  pathPrefix: string,
  baseName: string,
  sizes: ReadonlyArray<{ filePrefix: string; width?: number; maxWidth?: number }>,
  fallbackPrefix: string
): ResponsiveImageSet {
  return {
    sources: buildWebpSources(pathPrefix, baseName, sizes),
    fallbackSrc: `${pathPrefix}/${fallbackPrefix}${baseName}.webp`,
  };
}

export function createIconSet(name: string): ResponsiveImageSet {
  return createWebpImageSet('/icon', name, ICON_SIZES, '80x80_');
}

export function createStackIconSet(name: string): ResponsiveImageSet {
  return createWebpImageSet('/icon/stack', name, ICON_SIZES, '80x80_');
}

export function createLogoSet(name: string): ResponsiveImageSet {
  return createWebpImageSet('/logo', name, ICON_SIZES, '80x80_');
}

export function createPhotoSet(name: string): ResponsiveImageSet {
  return createWebpImageSet('/photos', name, PHOTO_SIZES, '640x853_');
}

export const SHARED_IMAGES = {
  icon: {
    lucidity: createIconSet('lucidity'),
    discover: createIconSet('discover'),
    strenght: createIconSet('strenght'),
    level: createIconSet('level'),
    esoResist: createIconSet('eso_resist'),
    fire: createIconSet('fire'),
    physique: createIconSet('physique'),
    pousseRes: createIconSet('pousse_res'),
    dex: createIconSet('dex'),
    eso: createIconSet('eso'),
    hearth: createIconSet('hearth'),
  },
  stack: {
    action: createStackIconSet('action'),
    angular: createStackIconSet('angular'),
    dotnet: createStackIconSet('dotnet'),
    github: createStackIconSet('github'),
    linkedin: createStackIconSet('linkedin'),
    mail: createStackIconSet('mail'),
    postgre: createStackIconSet('postgre'),
    python: createStackIconSet('python'),
    symfony: createStackIconSet('symfony'),
  },
  logo: {
    white: createLogoSet('logo_white'),
  },
  photo: {
    me: createPhotoSet('me'),
  },
} as const;
