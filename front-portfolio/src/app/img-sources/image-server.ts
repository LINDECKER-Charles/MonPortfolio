/**
 * Origine du serveur d'images statique (vhost Apache `images.charles-lindecker.com`,
 * docroot `/var/www/charles-lindecker-img`, alimenté par le dossier racine `images/`).
 * Domaine unique partagé test/prod : pas de variante par environnement.
 */
export const IMAGE_SERVER_BASE_URL = 'https://images.charles-lindecker.com';

/** Préfixe un chemin d'asset absolu (`/project/...`) par l'origine du serveur d'images. */
export function imageServerUrl(path: string): string {
  return `${IMAGE_SERVER_BASE_URL}${path}`;
}
