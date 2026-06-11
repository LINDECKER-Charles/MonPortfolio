import { Injectable, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Distingue le rendu initial (HTML SSR hydraté, déjà peint) des navigations
 * client. Les animations d'entrée ne doivent jouer que sur ces dernières :
 * re-masquer du contenu SSR déjà visible provoque un flash et repousse le
 * candidat LCP à l'hydratation.
 *
 * Doit être injecté par le composant racine (avant la navigation initiale)
 * pour que le comptage des NavigationStart soit fiable.
 */
@Injectable({ providedIn: 'root' })
export class NavigationContextService {
  /** false pendant le rendu initial, true dès la première navigation client. */
  readonly hasNavigated = signal(false);

  constructor() {
    // Optionnel : sans router (TestBed minimal), aucune navigation n'existe —
    // on reste en "rendu initial", ce qui est le comportement sûr.
    const router = inject(Router, { optional: true });
    if (!router) return;
    let initialNavigation = true;

    router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe(() => {
      if (initialNavigation) {
        initialNavigation = false;
        return;
      }
      this.hasNavigated.set(true);
    });
  }
}
