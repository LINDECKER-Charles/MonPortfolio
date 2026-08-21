import { Route } from '@angular/router';

import { routes } from './app.routes';
import { SITE_URL } from './seo/route-meta';
import { PRERENDERED_PATHS, SITE_ROUTES } from './seo/site-routes';

/** Champs SEO attendus dans `data` de chaque route. */
const SEO_KEYS = [
  'description',
  'canonical',
  'robots',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'ogUrl',
  'ogType',
  'twitterCard',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'structuredData',
  'showFooter',
] as const;

describe('app routes', () => {
  it('declares the expected set of paths including the wildcard', () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain('');
    expect(paths).toContain('projects');
    expect(paths).toContain('resume');
    expect(paths).toContain('linktree');
    expect(paths).toContain('mentions-legales');
    expect(paths).toContain('politique-confidentialite');
    expect(paths).toContain('politique-cookies');
    expect(paths).toContain('**');
  });

  it('has no duplicate paths', () => {
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('places the wildcard route last', () => {
    expect(routes[routes.length - 1].path).toBe('**');
  });

  it('lazy-loads every route via loadComponent (no eager component)', () => {
    routes.forEach((route: Route) => {
      expect(typeof route.loadComponent).toBe('function');
      expect(route.component).toBeUndefined();
    });
  });

  it('resolves every lazy import to a component class', async () => {
    for (const route of routes) {
      const component = await route.loadComponent!();
      expect(component)
        .withContext(`route '${route.path}' should lazy-load a component`)
        .toEqual(jasmine.any(Function));
    }
  });

  it('gives each route a non-empty title', () => {
    routes.forEach((route) => {
      expect(typeof route.title).toBe('string');
      expect((route.title as string).length).toBeGreaterThan(0);
    });
  });

  it('attaches the full SEO metadata block to every route', () => {
    routes.forEach((route) => {
      expect(route.data).withContext(`route "${route.path}"`).toBeDefined();
      const keys = Object.keys(route.data ?? {});
      SEO_KEYS.forEach((key) => {
        expect(keys).withContext(`route "${route.path}" missing ${key}`).toContain(key);
      });
    });
  });

  it('exposes structuredData as an array on every route', () => {
    routes.forEach((route) => {
      expect(Array.isArray(route.data!['structuredData']))
        .withContext(`route "${route.path}"`)
        .toBeTrue();
    });
  });

  it('marks opening and 404 routes as noindex', () => {
    const byPath = (p: string) => routes.find((r) => r.path === p)!;
    expect(byPath('opening-resume').data!['robots']).toContain('noindex');
    expect(byPath('opening-home').data!['robots']).toContain('noindex');
    // /works est indexable depuis que la timeline parcours est remplie (2026-08).
    expect(byPath('**').data!['robots']).toContain('noindex');
  });

  it('marks the public pages as indexable', () => {
    const byPath = (p: string) => routes.find((r) => r.path === p)!;
    expect(byPath('').data!['robots']).toContain('index');
    expect(byPath('projects').data!['robots']).toContain('index');
    expect(byPath('resume').data!['robots']).toContain('index');
  });

  it('hides the footer only on the opening sequences', () => {
    routes.forEach((route) => {
      const expectFooter = route.path !== 'opening-resume' && route.path !== 'opening-home';
      expect(route.data!['showFooter']).withContext(`route "${route.path}"`).toBe(expectFooter);
    });
  });

  it('uses canonical URLs under the configured site origin', () => {
    routes.forEach((route) => {
      expect((route.data!['canonical'] as string).startsWith(SITE_URL))
        .withContext(`route "${route.path}" : ${route.data!['canonical']}`)
        .toBeTrue();
    });
  });

  it('stays in sync with the site-routes manifest (paths and titles)', () => {
    const manifestByPath = new Map(SITE_ROUTES.map((route) => [route.path, route]));
    const concreteRoutes = routes.filter((route) => route.path !== '**');

    // Chaque route Angular concrète est déclarée dans le manifeste, avec le même titre.
    concreteRoutes.forEach((route) => {
      const manifest = manifestByPath.get(route.path!);
      expect(manifest).withContext(`route "${route.path}" absente du manifeste`).toBeDefined();
      expect(route.title).withContext(`titre de "${route.path}"`).toBe(manifest!.title);
      // Cohérence indexable <-> robots.
      const robots = (route.data?.['robots'] as string | undefined) ?? 'index, follow';
      expect(robots.includes('noindex'))
        .withContext(`robots de "${route.path}"`)
        .toBe(!manifest!.indexable);
    });

    // Et réciproquement : pas d'entrée fantôme dans le manifeste.
    SITE_ROUTES.forEach((manifest) => {
      expect(concreteRoutes.some((route) => route.path === manifest.path))
        .withContext(`entrée manifeste "${manifest.path}" sans route Angular`)
        .toBeTrue();
    });

    // Le prerender couvre exactement les routes du manifeste marquées prerender.
    expect(new Set(PRERENDERED_PATHS)).toEqual(
      new Set(SITE_ROUTES.filter((route) => route.prerender).map((route) => route.path)),
    );
  });
});
