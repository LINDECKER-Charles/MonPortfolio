import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { TranslationService } from './services/translation.service';
import { recoverFromStaleChunk } from './utils/navigation-recovery';
import { provideImageServerPreconnect } from './seo/preconnect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Preconnect vers le serveur d'images — suit IMAGE_SERVER_URL (.env racine).
    provideImageServerPreconnect(),
    provideZonelessChangeDetection(),
    // Routes chargées à la demande (loadComponent), sans préchargement eager :
    // avec la compression HTTP un chunk de route pèse 5-30 KiB et son fetch est
    // masqué par la page-transition. Le preload de toutes les routes au
    // bootstrap retardait le network-quiet et gonflait TTI/LCP (Lighthouse).
    // withNavigationErrorHandler : un chunk lazy disparu après un déploiement
    // (404 sur l'import dynamique) déclenche un rechargement complet vers la
    // cible au lieu de laisser la navigation échouer en silence (freeze).
    provideRouter(routes, withNavigationErrorHandler(recoverFromStaleChunk)),
    // Pas de withEventReplay() : contrainte CSP stricte (aucun script inline / replay).
    provideClientHydration(),
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: TranslationService) => () => ts.initialize(),
      deps: [TranslationService],
      multi: true,
    },
  ],
};
