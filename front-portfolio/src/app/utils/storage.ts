/**
 * Accès `localStorage` tolérant aux environnements contraints (mode privé,
 * stockage désactivé par l'utilisateur, SSR sans `window`) : chaque
 * lecture/écriture est enveloppée d'un try/catch pour qu'une SecurityError
 * ne puisse jamais casser l'initialisation de l'app.
 */

/** Lit une clé — `null` si absente ou si le stockage est indisponible. */
export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Écrit une clé — best-effort, silencieux si le stockage est indisponible. */
export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Préférence non persistée : non bloquant. */
  }
}
