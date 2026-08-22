import { SITE_ROUTES } from '../src/app/seo/site-routes';

/**
 * Routes publiques couvertes par les tests e2e / a11y — dérivées du manifeste
 * unique `src/app/seo/site-routes.json` (flag `e2e`). Les séquences d'ouverture
 * en sont exclues : transitoires, noindex et redirigeant après animation.
 */
export interface PublicRoute {
  path: string;
  /** Fragment attendu du <title> (généré depuis le titre du manifeste). */
  title: RegExp;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ALL_ROUTES: PublicRoute[] = SITE_ROUTES.filter((route) => route.e2e).map((route) => ({
  path: route.path === '' ? '/' : `/${route.path}`,
  title: new RegExp(`^${escapeRegex(route.title)}`),
}));

/**
 * Exclusion par environnement (CSV de paths, ex. `E2E_EXCLUDE_ROUTES="/,/linktree"`).
 * Utilisé par la CI : sur les runners GitHub, certaines routes n'émettent jamais
 * l'event `load` (assets eager du serveur d'images inaccessibles) et `page.goto`
 * timeout. En local, sans la variable, toutes les routes restent couvertes.
 */
const EXCLUDED_ROUTES = new Set(
  (process.env['E2E_EXCLUDE_ROUTES'] ?? '')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean),
);

export const PUBLIC_ROUTES: PublicRoute[] = ALL_ROUTES.filter(
  (route) => !EXCLUDED_ROUTES.has(route.path),
);
