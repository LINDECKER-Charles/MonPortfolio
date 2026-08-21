import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import compression from 'compression';
import express from 'express';
import { join, relative } from 'node:path';

import { cacheControlFor } from './server/static-cache';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Derrière Apache (X-Forwarded-For posé par le vhost) : req.ip = client réel.
app.set('trust proxy', true);
app.disable('x-powered-by');

// Compression gzip de toutes les réponses texte (HTML SSR, JS, CSS, JSON i18n).
// Sans elle, ~680 KiB transitent non compressés et plombent FCP/LCP.
app.use(compression());

/**
 * Health-check consommé par le déploiement (gate post-restart) et la supervision.
 * Avant tout le reste : jamais rendu par Angular, jamais mis en cache.
 */
app.get('/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ status: 'ok', uptime: process.uptime() });
});

/**
 * Assets statiques de /browser. Cache-Control par type d'asset (immutable pour
 * les fichiers hashés, court pour les JSON i18n non hashés) — cf. static-cache.ts.
 * robots.txt et sitemap.xml sont servis ici (présents dans public/).
 */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      const urlPath = `/${relative(browserDistFolder, filePath).replace(/\\/g, '/')}`;
      res.setHeader('Cache-Control', cacheControlFor(urlPath));
    },
  }),
);

/**
 * Garde d'extension : une requête de fichier qui n'a pas été résolue par
 * express.static ne doit JAMAIS tomber dans le rendu SSR — sinon un
 * `/chunk-OBSOLETE.js` reçoit la page 404 en text/html (~90 KiB), le
 * navigateur refuse le module et la page reste non hydratée (freeze).
 * Aucune route applicative ne contient de point.
 */
app.use((req, res, next) => {
  if (/\.[a-z0-9]+$/i.test(req.path)) {
    res.status(404).type('text/plain').send('Not Found');
    return;
  }
  next();
});

/**
 * Toutes les autres requêtes : rendu Angular (pages prérendues ou SSR à la volée).
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Gestionnaire d'erreurs final : sans lui, Express renvoie la stack et les
 * chemins absolus du serveur quand NODE_ENV n'est pas "production".
 */
app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ssr] unhandled error:', err);
    if (res.headersSent) return;
    res
      .status(500)
      .type('html')
      .send(
        '<!doctype html><html lang="fr"><meta charset="utf-8">' +
          '<title>Erreur temporaire</title>' +
          '<body style="background:#0d0b09;color:#d6c9a8;font-family:serif;display:grid;place-items:center;min-height:100vh;margin:0">' +
          '<p>Une erreur temporaire est survenue — rechargez la page.</p></body></html>',
      );
  },
);

/**
 * Démarrage direct (systemd, docker, `node server.mjs`). PORT et HOST viennent
 * de l'environnement (EnvironmentFile systemd / env_file compose / .env racine).
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] ?? 4000);
  const host = process.env['HOST'];

  const onListening = (error?: Error) => {
    if (error) {
      throw error;
    }
    // « listening on » est le ready-pattern de Lighthouse CI — ne pas reformuler.
    console.log(`Node Express server listening on http://${host ?? 'localhost'}:${port}`);
  };
  const server = host ? app.listen(port, host, onListening) : app.listen(port, onListening);

  // Arrêt gracieux : finir les requêtes en cours (deploy = systemctl restart),
  // avec un délai de grâce avant arrêt forcé.
  const shutdown = (signal: string) => {
    console.log(`[ssr] ${signal} reçu — arrêt gracieux`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
