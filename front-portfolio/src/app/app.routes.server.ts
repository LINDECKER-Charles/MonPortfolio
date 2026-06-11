import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Routes connues prérendues au build (SSG). Le wildcard reste en SSR à la
 * volée : un `**` en Prerender ne couvre pas les URL inconnues au build, le
 * serveur renverrait un 404 Express brut au lieu de la page introuvable thémée.
 */
const PRERENDERED_PATHS = [
  '',
  'opening-home',
  'opening-resume',
  'resume',
  'projects',
  'works',
  'linktree',
  'mentions-legales',
  'politique-confidentialite',
  'politique-cookies',
] as const;

export const serverRoutes: ServerRoute[] = [
  ...PRERENDERED_PATHS.map((path) => ({ path, renderMode: RenderMode.Prerender as const })),
  {
    path: '**',
    renderMode: RenderMode.Server,
    status: 404,
  },
];
