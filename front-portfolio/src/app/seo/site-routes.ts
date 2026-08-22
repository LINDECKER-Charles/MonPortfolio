import manifest from './site-routes.json';

/**
 * Accès typé au manifeste des routes publiques (`site-routes.json`) —
 * source unique consommée par le routing, le prerender, les e2e, Lighthouse,
 * la génération robots/sitemap et les transitions de page.
 */

export interface SiteRoute {
  /** Chemin sans slash initial ('' = accueil). */
  path: string;
  /** Titre exact du document (balise <title>). */
  title: string;
  /** false = noindex, nofollow (et absent du sitemap). */
  indexable: boolean;
  /** true = prérendu au build (SSG). */
  prerender: boolean;
  /** false = la page-transition est zappée (séquences d'intro autonomes). */
  transition: boolean;
  /** true = couvert par les smoke/a11y e2e et Lighthouse. */
  e2e: boolean;
  sitemap: { priority: number; changefreq: string } | null;
}

export const SITE_ROUTES: SiteRoute[] = manifest.routes;

/** Titre d'une route par chemin — lance si le chemin est absent du manifeste. */
export function routeTitle(path: string): string {
  const route = SITE_ROUTES.find((r) => r.path === path);
  if (!route) {
    throw new Error(`Route absente du manifeste site-routes.json : "${path}"`);
  }
  return route.title;
}

/** Chemins prérendus au build (consommé par app.routes.server.ts). */
export const PRERENDERED_PATHS: string[] = SITE_ROUTES.filter((r) => r.prerender).map(
  (r) => r.path,
);

/** Préfixes de routes sans transition de page (séquences d'intro autonomes). */
export const TRANSITION_EXCLUDED_PREFIXES: string[] = SITE_ROUTES.filter((r) => !r.transition).map(
  (r) => `/${r.path}`,
);
