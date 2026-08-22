import { NavigationError } from '@angular/router';

/**
 * Récupération des échecs de navigation causés par un chunk lazy disparu
 * après un déploiement (`outputHashing: all` + suppression des anciens fichiers) :
 * l'import dynamique reçoit un 404 et le Router émet NavigationError sans
 * jamais atteindre NavigationEnd — l'app semble figée (cf.
 * docs/investigations/2026-08-21-freeze-prod-remise-en-prod.md, RC3).
 *
 * La parade : recharger la page vers l'URL cible — le serveur renvoie le HTML
 * de la nouvelle version, avec les nouveaux hashes. Anti-boucle : un seul
 * rechargement par URL par fenêtre glissante (sessionStorage).
 */

const RELOAD_STATE_KEY = 'ng-chunk-reload';
const RELOAD_LOOP_WINDOW_MS = 30_000;

/** Messages émis par Chromium / Firefox / Safari sur un import dynamique échoué. */
const STALE_CHUNK_PATTERN =
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

export function isStaleChunkError(error: unknown): boolean {
  return error instanceof TypeError && STALE_CHUNK_PATTERN.test(error.message);
}

/**
 * Handler pour `withNavigationErrorHandler`. `navigate` est injectable pour
 * les tests ; par défaut, rechargement complet vers l'URL cible.
 */
export function recoverFromStaleChunk(
  event: NavigationError,
  navigate: (url: string) => void = (url) => location.assign(url),
): void {
  if (!isStaleChunkError(event.error)) return;
  if (typeof location === 'undefined') return; // SSR : rien à recharger

  try {
    const previous = sessionStorage.getItem(RELOAD_STATE_KEY);
    if (previous) {
      const separator = previous.lastIndexOf('|');
      const lastUrl = previous.slice(0, separator);
      const lastAt = Number(previous.slice(separator + 1));
      if (lastUrl === event.url && Date.now() - lastAt < RELOAD_LOOP_WINDOW_MS) {
        return; // déjà rechargé pour cette URL il y a moins de 30 s : on ne boucle pas
      }
    }
    sessionStorage.setItem(RELOAD_STATE_KEY, `${event.url}|${Date.now()}`);
  } catch {
    /* stockage indisponible (navigation privée stricte) : recharger quand même */
  }

  navigate(event.url);
}
