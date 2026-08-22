import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { SOUND_CATALOG } from './audio/sound-catalog';
import { AudioService } from './services/audio-service';
import { NavigationContextService } from './services/navigation-context.service';
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
    provideClientHydration(withNoIncrementalHydration()),
    // Instancié avant la navigation initiale pour un comptage NavigationStart
    // fiable — consommé par les entrances (shouldSkipEntrance) et la page-transition.
    provideEnvironmentInitializer(() => void inject(NavigationContextService)),
    // Catalogue audio déclaré hors du composant racine — clés typées SoundKey.
    provideAppInitializer(() => {
      inject(AudioService).registerMany(SOUND_CATALOG);
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: TranslationService) => () => ts.initialize(),
      deps: [TranslationService],
      multi: true,
    },
  ],
};
