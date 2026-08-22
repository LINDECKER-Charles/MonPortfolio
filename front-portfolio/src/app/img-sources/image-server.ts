import { ENV } from '../../environments/env';

/**
 * Préfixe des images statiques du dossier racine `images/` (IMAGE_SERVER_URL du
 * `.env` racine). Production : `/img` — relatif, les images sont embarquées dans
 * l'image Docker et servies par le serveur SSR, chaque environnement sert les
 * siennes. Dev docker : origine absolue du nginx local. Les consommateurs n'ont
 * pas à savoir lequel des deux s'applique.
 */
export const IMAGE_SERVER_BASE_URL = ENV.imageServerUrl;

/** Vrai si les images sont servies par l'origine du site lui-même (préfixe relatif). */
export const IMAGE_SERVER_IS_SAME_ORIGIN = isSameOrigin(IMAGE_SERVER_BASE_URL);

export function isSameOrigin(baseUrl: string): boolean {
  return baseUrl.startsWith('/');
}

/** Préfixe un chemin d'asset absolu (`/project/...`) par l'origine du serveur d'images. */
export function imageServerUrl(path: string): string {
  return `${IMAGE_SERVER_BASE_URL}${path}`;
}

/**
 * URL absolue d'une image — pour tout ce qui sort du site (JSON-LD, Open Graph) :
 * un préfixe relatif est résolu contre l'origine canonique.
 */
export function resolveAbsoluteImageUrl(baseUrl: string, siteUrl: string, path: string): string {
  const url = `${baseUrl}${path}`;
  return isSameOrigin(baseUrl) ? `${siteUrl}${url}` : url;
}

export function absoluteImageServerUrl(path: string): string {
  return resolveAbsoluteImageUrl(IMAGE_SERVER_BASE_URL, ENV.siteUrl, path);
}
