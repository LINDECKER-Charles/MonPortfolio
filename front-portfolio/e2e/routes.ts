/**
 * Routes publiques couvertes par les tests e2e / a11y / Lighthouse.
 * Les séquences d'ouverture (opening-home, opening-resume) sont exclues :
 * transitoires, noindex et redirigeant après animation.
 */
export interface PublicRoute {
  path: string;
  /** Fragment attendu du <title> (cf. app.routes.ts). */
  title: RegExp;
}

const ALL_ROUTES: PublicRoute[] = [
  { path: '/', title: /Portfolio Developpeur Full Stack/ },
  { path: '/projects', title: /^Projets - Charles Lindecker/ },
  { path: '/works', title: /^Parcours - Charles Lindecker/ },
  { path: '/resume', title: /CV & Parcours Developpeur Web/ },
  { path: '/linktree', title: /^Linktree - Charles Lindecker/ },
  { path: '/mentions-legales', title: /^Mentions legales/ },
  { path: '/politique-confidentialite', title: /^Politique de confidentialite/ },
  { path: '/politique-cookies', title: /^Politique de cookies/ },
];

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
    .filter(Boolean)
);

export const PUBLIC_ROUTES: PublicRoute[] = ALL_ROUTES.filter(
  (route) => !EXCLUDED_ROUTES.has(route.path)
);
