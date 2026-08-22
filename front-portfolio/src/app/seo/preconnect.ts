import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';

import { IMAGE_SERVER_BASE_URL, isSameOrigin } from '../img-sources/image-server';

/**
 * Pose le `<link rel="preconnect">` vers le serveur d'images dans le <head> —
 * uniquement quand il s'agit d'une origine distincte (dev docker : nginx local).
 * En production les images sont servies par l'origine du site (`/img`) : rien
 * à préconnecter.
 *
 * Exécuté au bootstrap serveur ET navigateur : les pages prérendues embarquent
 * le lien dans leur HTML, et l'hydratation le retrouve sans le dupliquer.
 */
export function provideImageServerPreconnect(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    appendPreconnect(inject(DOCUMENT), IMAGE_SERVER_BASE_URL);
  });
}

export function appendPreconnect(doc: Document, origin: string): void {
  if (isSameOrigin(origin)) {
    return;
  }
  const head = doc.head;
  if (!head || head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
    return;
  }
  const link = doc.createElement('link');
  link.setAttribute('rel', 'preconnect');
  link.setAttribute('href', origin);
  head.appendChild(link);
}
