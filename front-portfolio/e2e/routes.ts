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

export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: '/', title: /Portfolio Developpeur Full Stack/ },
  { path: '/projects', title: /^Projets - Charles Lindecker/ },
  { path: '/works', title: /^Parcours - Charles Lindecker/ },
  { path: '/resume', title: /CV & Parcours Developpeur Web/ },
  { path: '/linktree', title: /^Linktree - Charles Lindecker/ },
  { path: '/mentions-legales', title: /^Mentions legales/ },
  { path: '/politique-confidentialite', title: /^Politique de confidentialite/ },
  { path: '/politique-cookies', title: /^Politique de cookies/ },
];
