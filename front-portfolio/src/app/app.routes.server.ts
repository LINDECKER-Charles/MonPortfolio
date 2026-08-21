import { RenderMode, ServerRoute } from '@angular/ssr';

import { PRERENDERED_PATHS } from './seo/site-routes';

/**
 * Routes connues prérendues au build (SSG) — dérivées du manifeste
 * `seo/site-routes.json`. Le wildcard reste en SSR à la volée : un `**` en
 * Prerender ne couvre pas les URL inconnues au build, le serveur renverrait
 * un 404 Express brut au lieu de la page introuvable thémée.
 */
export const serverRoutes: ServerRoute[] = [
  ...PRERENDERED_PATHS.map((path) => ({ path, renderMode: RenderMode.Prerender as const })),
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
  },
];
