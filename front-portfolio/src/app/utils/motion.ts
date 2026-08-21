/**
 * Politique d'animation partagée.
 *
 * `true` si l'utilisateur a demandé une réduction des animations
 * (`prefers-reduced-motion: reduce`). SSR-safe : renvoie `false` côté serveur
 * (pas de `window`/`matchMedia`), comme avant la centralisation.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Garde d'entrance partagée (source unique de la politique LCP) : `true` si
 * l'animation d'entrée d'un élément doit être sautée —
 * - reduced-motion demandé : le contenu reste tel que rendu ;
 * - rendu initial (HTML SSR déjà peint, aucune navigation client) avec
 *   l'élément visible dans le viewport : le re-masquer provoquerait un flash
 *   et repousserait le candidat LCP à l'hydratation.
 * Après une navigation client (`ctx.hasNavigated()`), le contenu est neuf et
 * l'entrance reste légitime.
 */
export function shouldSkipEntrance(
  element: Element,
  ctx: { hasNavigated: () => boolean },
): boolean {
  if (prefersReducedMotion()) return true;

  if (!ctx.hasNavigated()) {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return true;
  }

  return false;
}
