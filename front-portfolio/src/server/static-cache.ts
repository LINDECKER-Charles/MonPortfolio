/**
 * Politique de cache HTTP des assets statiques servis par le serveur SSR.
 *
 * Trois niveaux :
 * - fichiers hashés par le build (`main-W3ZAQXAT.js`, `chunk-…`, `styles-…`) et
 *   polices versionnées : immuables, 1 an ;
 * - assets « vivants » non hashés (JSON i18n, robots/sitemap, manifest) :
 *   5 min + stale-while-revalidate — un déploiement est visible en quelques
 *   minutes au lieu d'un an (l'ancien `maxAge: '1y'` global gelait les
 *   traductions non-FR jusqu'à expiration) ;
 * - le reste (logos, sons, images d'opening) : 1 jour + SWR 7 jours.
 */

/** Hash esbuild : ≥ 8 caractères [A-Z0-9] avant l'extension. */
const HASHED_FILE = /-[A-Z0-9]{8,}\.[a-z0-9]+$/;

/** Polices auto-hébergées : le nom de fichier change avec la version amont. */
const FONT_FILE = /^\/fonts\/[^/]+\.woff2?$/;

/** Assets non hashés susceptibles de changer à chaque déploiement. */
const SHORT_LIVED = /^\/(?:lang\/|robots\.txt$|sitemap\.xml$|site\.webmanifest$|build-info\.json$)/;

export const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable';
export const CACHE_SHORT = 'public, max-age=300, stale-while-revalidate=3600';
export const CACHE_DEFAULT = 'public, max-age=86400, stale-while-revalidate=604800';

/** @param urlPath chemin URL absolu (`/lang/common/common.fr.json`), séparateurs `/`. */
export function cacheControlFor(urlPath: string): string {
  if (HASHED_FILE.test(urlPath) || FONT_FILE.test(urlPath)) {
    return CACHE_IMMUTABLE;
  }
  if (SHORT_LIVED.test(urlPath)) {
    return CACHE_SHORT;
  }
  return CACHE_DEFAULT;
}
