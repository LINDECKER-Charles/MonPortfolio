import { expect, test } from '@playwright/test';

import { PUBLIC_ROUTES } from './routes';

/**
 * Contrat du serveur SSR — vérifié en HTTP pur (fixture `request`, aucun
 * JavaScript exécuté) : l'hydratation d'un shell CSR peut faire passer un
 * smoke test navigateur alors que le prérendu est cassé (incident
 * allowedHosts, cf. mémoire projet). Ici, ce qui est asserté est ce que le
 * serveur émet réellement.
 */
test.describe('serveur SSR', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`sert le prérendu (ssg), pas le shell CSR — ${route.path}`, async ({ request }) => {
      const response = await request.get(route.path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      // Le shell CSR porte ng-server-context="csr" et pèse ~3 Ko.
      expect(html).toContain('ng-server-context="ssg"');
      expect(html.length).toBeGreaterThan(20_000);
    });
  }

  test('/health répond 200 sans mise en cache', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('no-store');
    expect((await response.json()).status).toBe('ok');
  });

  test('un asset hashé disparu renvoie 404 text/plain, jamais du HTML', async ({ request }) => {
    // RC2 du diagnostic freeze : un chunk obsolète servi en text/html (page 404
    // SSR) bloque le chargement de module et laisse la page non hydratée.
    const response = await request.get('/chunk-OBSOLETE0.js');
    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('les bundles hashés sont servis immutables', async ({ request }) => {
    const home = await (await request.get('/')).text();
    const main = home.match(/src="(main-[A-Z0-9]+\.js)"/)?.[1];
    expect(main).toBeTruthy();
    const response = await request.get(`/${main}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('immutable');
  });

  test('les JSON i18n non hashés ont un cache court', async ({ request }) => {
    const response = await request.get('/lang/common/common.fr.json');
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('max-age=300');
  });

  test('les images statiques sont servies sous /img avec le cache par défaut', async ({
    request,
  }) => {
    const response = await request.get('/img/photos/640x960_me-1.webp');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/webp');
    expect(response.headers()['cache-control']).toContain('max-age=86400');
  });

  test('une image absente renvoie 404 text/plain, jamais du HTML', async ({ request }) => {
    const response = await request.get('/img/photos/inexistante.webp');
    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('les headers de sécurité (ex-vhost Apache) sont émis par le serveur', async ({
    request,
  }) => {
    const headers = (await request.get('/')).headers();
    expect(headers['content-security-policy']).toContain("script-src 'self'");
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    // HTTP pur (aucun proxy TLS devant) : ni HSTS ni upgrade-insecure-requests, ni noindex.
    expect(headers['strict-transport-security']).toBeUndefined();
    expect(headers['content-security-policy']).not.toContain('upgrade-insecure-requests');
    expect(headers['x-robots-tag']).toBeUndefined();
  });

  test('robots.txt et sitemap.xml sont servis et cohérents avec l’origine', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()['content-type']).toContain('xml');
    expect(await sitemap.text()).toContain('<urlset');
  });
});
