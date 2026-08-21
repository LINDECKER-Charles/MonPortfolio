import { ENV } from '../../environments/env';

/**
 * Origine du serveur d'images statique (vhost Apache dédié, alimenté par le
 * dossier racine `images/`). Injectée depuis le `.env` racine
 * (IMAGE_SERVER_URL) — en dev docker, un nginx local sert `./images`.
 */
export const IMAGE_SERVER_BASE_URL = ENV.imageServerUrl;

/** Préfixe un chemin d'asset absolu (`/project/...`) par l'origine du serveur d'images. */
export function imageServerUrl(path: string): string {
  return `${IMAGE_SERVER_BASE_URL}${path}`;
}
