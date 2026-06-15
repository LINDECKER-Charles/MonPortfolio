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
