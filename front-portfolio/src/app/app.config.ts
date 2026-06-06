import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { TranslationService } from './services/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Routes chargées à la demande (loadComponent) puis préchargées en idle :
    // bundle initial allégé sans pénaliser les navigations suivantes.
    provideRouter(routes, withPreloading(PreloadAllModules)),
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
