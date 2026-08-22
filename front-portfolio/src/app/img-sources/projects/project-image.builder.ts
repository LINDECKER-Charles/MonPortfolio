import { ResponsiveSource } from '../../components/assets/responsive-picture/responsive-picture';
// Import type vers projects.types (module de types purs) : garantit l'absence de
// cycle runtime projects.data → *.source(s) → builder, même sans élision esbuild.
import type { ProjectMediaImage } from '../../components/page/projects/projects.types';
import { imageServerUrl } from '../image-server';

interface ProjectImageSize {
  width: number;
  height: number;
}

/**
 * Construit un `ProjectMediaImage` servi depuis le serveur d'images.
 *
 * Convention des fichiers : déclinaisons responsives `<w>x<h>_<name>.webp` (descripteurs
 * `max-width`), source pleine résolution et fallback sur `<name>.webp`. Toutes les URL sont
 * préfixées par l'origine du serveur d'images via {@link imageServerUrl}.
 */
export function buildProjectImage(
  folder: string,
  name: string,
  alt: string,
  sizes: ProjectImageSize[],
): ProjectMediaImage {
  const dir = `/project/${folder}`;

  const sources: ResponsiveSource[] = sizes.map(({ width, height }) => ({
    src: imageServerUrl(`${dir}/${width}x${height}_${name}.webp`),
    maxWidth: width,
    type: 'image/webp',
  }));

  sources.push({
    src: imageServerUrl(`${dir}/${name}.webp`),
    type: 'image/webp',
  });

  return {
    alt,
    fallbackSrc: imageServerUrl(`${dir}/${name}.webp`),
    sources,
  };
}
