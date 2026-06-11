import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SERVER_TRANSLATIONS } from './services/translation.service';
import { SERVER_FR_TRANSLATIONS } from './services/translation.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Baseline FR au rendu serveur : le HTML prerendu contient le texte final,
    // l'hydratation ne re-rend aucune chaîne → zéro layout shift (CLS).
    { provide: SERVER_TRANSLATIONS, useValue: SERVER_FR_TRANSLATIONS },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
