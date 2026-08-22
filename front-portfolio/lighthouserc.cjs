// Lighthouse CI — audite le build SSR (dist/) ; `npm run build` requis avant.
// Routes dérivées du manifeste unique src/app/seo/site-routes.json.
const PORT = Number(process.env.E2E_PORT ?? 4000);
// Propagé au serveur SSR lancé par startServerCommand (env hérité du process LHCI).
process.env.PORT = String(PORT);
const ORIGIN = `http://localhost:${PORT}`;

const ROUTES = require('./src/app/seo/site-routes.json')
  .routes.filter((route) => route.e2e)
  .map((route) => (route.path === '' ? '/' : `/${route.path}`));

module.exports = {
  ci: {
    collect: {
      // PORT transmis au serveur SSR pour s'aligner sur E2E_PORT.
      startServerCommand: `node dist/front-portfolio/server/server.mjs`,
      startServerReadyTimeout: 30000,
      startServerReadyPattern: 'listening on',
      url: ROUTES.map((r) => `${ORIGIN}${r}`),
      // 3 runs par route : les assertions portent sur le run médian, ce qui
      // absorbe le bruit de mesure (±100 ms observés sur FCP/LCP).
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        // Les assets lourds viennent d'images.charles-lindecker.com : la perf
        // mesurée en CI dépend du réseau, d'où le seuil en warn plus bas.
        skipAudits: ['uses-http2'],
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
};
