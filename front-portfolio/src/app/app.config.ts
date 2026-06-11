import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { TranslationService } from './services/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Routes chargées à la demande (loadComponent), sans préchargement eager :
    // avec la compression HTTP un chunk de route pèse 5-30 KiB et son fetch est
    // masqué par la page-transition. Le preload de toutes les routes au
    // bootstrap retardait le network-quiet et gonflait TTI/LCP (Lighthouse).
    provideRouter(routes),
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
