// Lighthouse CI — audite le build SSR (dist/) ; `npm run build` requis avant.
// Le serveur Express écoute sur son port par défaut (4000).
const ORIGIN = 'http://localhost:4000';

const ROUTES = [
  '/',
  '/projects',
  '/works',
  '/resume',
  '/linktree',
  '/mentions-legales',
  '/politique-confidentialite',
  '/politique-cookies',
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node dist/front-portfolio/server/server.mjs',
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
      assertMatrix: [
        {
          // /works est volontairement noindex (page en construction, cf.
          // app.routes.ts) : l'audit is-crawlable plombe le score SEO.
          // Réintégrer la route dans le groupe standard au passage en index.
          matchingUrlPattern: '.*/works$',
          assertions: {
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
            'categories:performance': ['warn', { minScore: 0.95 }],
          },
        },
        {
          matchingUrlPattern: '^(?!.*/works$).*',
          assertions: {
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.9 }],
            'categories:seo': ['error', { minScore: 0.95 }],
            'categories:performance': ['warn', { minScore: 0.95 }],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
};
