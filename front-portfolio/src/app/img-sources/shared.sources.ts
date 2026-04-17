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

/** Logos d'organismes (entreprises, écoles, certificateurs) — ratios variables,
    on fournit les tailles disponibles par organisme via sizes spécifiques. */
export function createOrganismSet(
  name: string,
  sizes: ReadonlyArray<{ filePrefix: string; width?: number; maxWidth?: number }>,
  fallbackPrefix: string
): ResponsiveImageSet {
  return createWebpImageSet('/logo/organisme', name, sizes, fallbackPrefix);
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
  organism: {
    elanformation: createOrganismSet('elanformation', [
      { filePrefix: '24x19_', width: 24 },
      { filePrefix: '40x32_', width: 40 },
      { filePrefix: '80x64_', width: 80 },
      { filePrefix: '160x128_', width: 160 },
    ], '80x64_'),
    devmates: createOrganismSet('devmates', [
      { filePrefix: '24x26_', width: 24 },
      { filePrefix: '40x44_', width: 40 },
      { filePrefix: '80x88_', width: 80 },
      { filePrefix: '160x176_', width: 160 },
      { filePrefix: '320x353_', width: 320 },
    ], '80x88_'),
    atis: createOrganismSet('atis', [
      { filePrefix: '24x13_', width: 24 },
      { filePrefix: '40x23_', width: 40 },
      { filePrefix: '80x46_', width: 80 },
      { filePrefix: '160x92_', width: 160 },
    ], '80x46_'),
    microsoft: createOrganismSet('Microsoft', [
      { filePrefix: '24x24_', width: 24 },
      { filePrefix: '40x40_', width: 40 },
      { filePrefix: '80x80_', width: 80 },
      { filePrefix: '160x160_', width: 160 },
      { filePrefix: '320x320_', width: 320 },
    ], '80x80_'),
    freecodecamp: createOrganismSet('freecodecamp', [
      { filePrefix: '24x24_', width: 24 },
      { filePrefix: '40x40_', width: 40 },
      { filePrefix: '80x80_', width: 80 },
      { filePrefix: '160x160_', width: 160 },
      { filePrefix: '320x320_', width: 320 },
    ], '80x80_'),
  },
  photo: {
    me: createPhotoSet('me'),
  },
} as const;
