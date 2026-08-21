import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { RouteMeta } from '../seo/route-meta';

/** Clés de RouteMeta rendues en `<meta>` — canonical/structuredData ont leur propre canal. */
type MetaTagKey = Exclude<keyof RouteMeta, 'canonical' | 'structuredData' | 'showFooter'>;

/**
 * Table déclarative clé RouteMeta → balise `<meta>`. Le `Record<MetaTagKey, …>`
 * garantit à la compilation qu'aucune clé du contrat n'est oubliée.
 */
const TAG_MAP: Record<MetaTagKey, { attr: 'name' | 'property'; tag: string }> = {
  description: { attr: 'name', tag: 'description' },
  robots: { attr: 'name', tag: 'robots' },
  ogTitle: { attr: 'property', tag: 'og:title' },
  ogDescription: { attr: 'property', tag: 'og:description' },
  ogImage: { attr: 'property', tag: 'og:image' },
  ogUrl: { attr: 'property', tag: 'og:url' },
  ogType: { attr: 'property', tag: 'og:type' },
  twitterCard: { attr: 'name', tag: 'twitter:card' },
  twitterTitle: { attr: 'name', tag: 'twitter:title' },
  twitterDescription: { attr: 'name', tag: 'twitter:description' },
  twitterImage: { attr: 'name', tag: 'twitter:image' },
};

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly meta: Meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly structuredDataId = 'app-structured-data';

  /** Applique d'un bloc l'intégralité des métas d'une route (balises `<meta>`, canonical, JSON-LD). */
  applyRouteMeta(meta: RouteMeta): void {
    for (const key of Object.keys(TAG_MAP) as MetaTagKey[]) {
      const { attr, tag } = TAG_MAP[key];
      this.meta.updateTag({ [attr]: tag, content: meta[key] });
    }

    this.updateCanonical(meta.canonical);
    this.updateStructuredData(meta.structuredData);
  }

  updateCanonical(url: string) {
    let link = this.document.querySelector<HTMLLinkElement>("link[rel='canonical']");

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  updateStructuredData(schema: Record<string, unknown> | Record<string, unknown>[] | undefined) {
    const existing = this.document.getElementById(this.structuredDataId);
    if (existing) {
      existing.remove();
    }

    if (!schema) {
      return;
    }

    const payload = Array.isArray(schema)
      ? { '@context': 'https://schema.org', '@graph': schema }
      : schema;

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = this.structuredDataId;
    script.text = JSON.stringify(payload);
    this.document.head.appendChild(script);
  }
}
