/**
 * Génération de la configuration build-time depuis le `.env` racine.
 *
 * Écrit :
 *   - src/environments/env.generated.ts  (gitignoré — consommé par env.ts)
 *   - public/robots.txt                  (depuis SITE_URL)
 *   - public/sitemap.xml                 (depuis SITE_URL + src/app/seo/site-routes.json)
 *
 * Priorité des valeurs : process.env (CI) > .env racine > défauts (prod).
 * Branché sur les hooks npm postinstall/prebuild/prestart/pretest : un clone
 * frais ou un build sans `.env` produit exactement la configuration actuelle.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const frontDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const rootEnvPath = join(frontDir, '..', '.env');

/** Défauts = valeurs de production actuelles (bascule .env non-breaking). */
const DEFAULTS = {
  SITE_URL: 'https://charles-lindecker.com',
  // Relatif : images embarquées dans l'image Docker, servies par le serveur SSR (cf. server.ts).
  IMAGE_SERVER_URL: '/img',
};

/** Parseur .env minimaliste (KEY=VALUE, commentaires #, quotes optionnelles). */
function parseDotEnv(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const fileEnv = existsSync(rootEnvPath) ? parseDotEnv(readFileSync(rootEnvPath, 'utf8')) : {};

function resolve(key) {
  const value = process.env[key] ?? fileEnv[key] ?? DEFAULTS[key];
  if (value === undefined || value === '') {
    console.error(`[gen-env] Variable obligatoire absente ou vide : ${key}`);
    process.exit(1);
  }
  return value;
}

function isHttpOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return /^https?:$/.test(url.protocol) && url.pathname === '/' && !value.endsWith('/');
}

function assertHttpOrigin(key, value) {
  if (!isHttpOrigin(value)) {
    console.error(`[gen-env] ${key} doit être une origine http(s) sans slash final : ${value}`);
    process.exit(1);
  }
}

/** Origine http(s) (dev docker) OU chemin absolu sans slash final (`/img`, production). */
function assertHttpOriginOrAbsolutePath(key, value) {
  if (isHttpOrigin(value) || /^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(value)) {
    return;
  }
  console.error(
    `[gen-env] ${key} doit être une origine http(s) ou un chemin absolu, sans slash final : ${value}`,
  );
  process.exit(1);
}

const siteUrl = resolve('SITE_URL');
const imageServerUrl = resolve('IMAGE_SERVER_URL');
assertHttpOrigin('SITE_URL', siteUrl);
assertHttpOriginOrAbsolutePath('IMAGE_SERVER_URL', imageServerUrl);

// ── src/environments/env.generated.ts ────────────────────────────────────────
const generated = `// Généré par scripts/gen-env.mjs — NE PAS ÉDITER (gitignoré).
// Source : .env racine (ou défauts prod). Régénérer : npm run gen:env
export const GENERATED_ENV = {
  siteUrl: ${JSON.stringify(siteUrl)},
  imageServerUrl: ${JSON.stringify(imageServerUrl)},
} as const;
`;
writeFileSync(join(frontDir, 'src', 'environments', 'env.generated.ts'), generated);

// ── public/robots.txt + public/sitemap.xml ───────────────────────────────────
const { routes } = JSON.parse(
  readFileSync(join(frontDir, 'src', 'app', 'seo', 'site-routes.json'), 'utf8'),
);

const robots = `User-agent: *
Allow: /

Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
`;
writeFileSync(join(frontDir, 'public', 'robots.txt'), robots);

const urlEntries = routes
  .filter((route) => route.indexable && route.sitemap)
  .map((route) => {
    const loc = route.path === '' ? `${siteUrl}/` : `${siteUrl}/${route.path}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <changefreq>${route.sitemap.changefreq}</changefreq>`,
      `    <priority>${route.sitemap.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n');
  });
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`;
writeFileSync(join(frontDir, 'public', 'sitemap.xml'), sitemap);

console.log(
  `[gen-env] OK — SITE_URL=${siteUrl} IMAGE_SERVER_URL=${imageServerUrl} ` +
    `(${urlEntries.length} URLs sitemap${existsSync(rootEnvPath) ? ', .env racine lu' : ', défauts'})`,
);
