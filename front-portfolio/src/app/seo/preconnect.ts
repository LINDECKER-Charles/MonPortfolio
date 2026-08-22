import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';

import { IMAGE_SERVER_BASE_URL } from '../img-sources/image-server';

/**
 * Pose le `<link rel="preconnect">` vers le serveur d'images dans le <head>.
 *
 * Historiquement en dur dans index.html — déplacé ici pour suivre
 * IMAGE_SERVER_URL (.env racine). Exécuté au bootstrap serveur ET navigateur :
 * les pages prérendues embarquent le lien dans leur HTML (aucune perte de
 * perf), et l'hydratation le retrouve sans le dupliquer.
 */
export function provideImageServerPreconnect(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const doc = inject(DOCUMENT);
    const head = doc.head;
    if (!head || head.querySelector(`link[rel="preconnect"][href="${IMAGE_SERVER_BASE_URL}"]`)) {
      return;
    }
    const link = doc.createElement('link');
    link.setAttribute('rel', 'preconnect');
    link.setAttribute('href', IMAGE_SERVER_BASE_URL);
    head.appendChild(link);
  });
}
