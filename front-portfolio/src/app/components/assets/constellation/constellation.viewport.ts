import { UNIVERSE, VIEWBOX } from './constellation.layout';

/**
 * Géométrie pure du pan / zoom de la carte « constellation » : clamp du centre
 * dans l'univers d'étoiles, conversion écran → viewBox, zoom vers un point
 * fixe et sérialisation de l'attribut `viewBox`. Aucune dépendance Angular —
 * le composant garde ses signals `scale` / `center` et délègue les calculs.
 */

/** Au scale mini, le viewBox couvre tout l'univers d'étoiles (vue galaxie). */
export const MIN_SCALE = VIEWBOX.w / UNIVERSE.w;
export const MAX_SCALE = 4.5;
/** En dessous de ce scale, on bascule en « vue galaxie » (labels masqués). */
export const GALAXY_SCALE = 0.8;

export interface ViewportPoint {
  x: number;
  y: number;
}

/** Sous-ensemble de DOMRect suffisant aux conversions (testable sans DOM). */
export type ViewportRect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Borne le centre pour que la fenêtre visible reste dans l'univers d'étoiles.
 * Gère le cas scale < 1 (fenêtre plus large que le contenu) en recentrant.
 */
export function clampCenter(x: number, y: number, scale: number): ViewportPoint {
  const halfW = VIEWBOX.w / scale / 2;
  const halfH = VIEWBOX.h / scale / 2;
  const cx = VIEWBOX.w / 2;
  const cy = VIEWBOX.h / 2;
  const minX = cx - UNIVERSE.w / 2 + halfW;
  const maxX = cx + UNIVERSE.w / 2 - halfW;
  const minY = cy - UNIVERSE.h / 2 + halfH;
  const maxY = cy + UNIVERSE.h / 2 - halfH;
  return {
    x: minX <= maxX ? clampNumber(x, minX, maxX) : cx,
    y: minY <= maxY ? clampNumber(y, minY, maxY) : cy,
  };
}

/** Convertit des coordonnées écran en coordonnées du viewBox courant. */
export function clientToViewBox(
  clientX: number,
  clientY: number,
  rect: ViewportRect,
  scale: number,
  center: ViewportPoint,
): ViewportPoint {
  const w = VIEWBOX.w / scale;
  const h = VIEWBOX.h / scale;
  const ratioX = (clientX - rect.left) / rect.width;
  const ratioY = (clientY - rect.top) / rect.height;
  return { x: center.x - w / 2 + ratioX * w, y: center.y - h / 2 + ratioY * h };
}

/** Zoom en gardant fixe le point sous le curseur. */
export function zoomTowardTarget(
  target: number,
  clientX: number,
  clientY: number,
  rect: ViewportRect,
  scale: number,
  center: ViewportPoint,
): { scale: number; center: ViewportPoint } {
  const ratioX = (clientX - rect.left) / rect.width;
  const ratioY = (clientY - rect.top) / rect.height;
  const pointer = clientToViewBox(clientX, clientY, rect, scale, center);

  const next = clampNumber(target, MIN_SCALE, MAX_SCALE);
  const newW = VIEWBOX.w / next;
  const newH = VIEWBOX.h / next;
  return {
    scale: next,
    center: clampCenter(pointer.x - (ratioX - 0.5) * newW, pointer.y - (ratioY - 0.5) * newH, next),
  };
}

/** Sérialise le couple scale / center en attribut SVG `viewBox`. */
export function viewBoxAttr(scale: number, center: ViewportPoint): string {
  const w = VIEWBOX.w / scale;
  const h = VIEWBOX.h / scale;
  const { x, y } = center;
  return `${(x - w / 2).toFixed(3)} ${(y - h / 2).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}`;
}
