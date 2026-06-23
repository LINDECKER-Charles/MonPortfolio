/** Helpers numériques partagés (bornage, indices circulaires). */

/** Borne `value` dans l'intervalle fermé [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Borne `value` dans [0, 1] — volumes, ratios, opacités. */
export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Indice circulaire : ramène `index` dans [0, length) en gérant les valeurs
 * négatives (ex. carousel qui recule depuis le premier élément).
 */
export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
