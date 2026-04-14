import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly meta: Meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly structuredDataId = 'app-structured-data';

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc });
  }

  updateCanonical(url: string) {
    let link = this.document.querySelector<HTMLLinkElement>(
      "link[rel='canonical']"
    );

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  updateRobots(robots: string) {
    this.meta.updateTag({ name: 'robots', content: robots });
  }

  updateOgTitle(title: string) {
    this.meta.updateTag({ property: 'og:title', content: title });
  }

  updateOgDescription(desc: string) {
    this.meta.updateTag({ property: 'og:description', content: desc });
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  updateOgImage(image: string) {
    this.meta.updateTag({ property: 'og:image', content: image });
  }

  updateOgType(type: string) {
    this.meta.updateTag({ property: 'og:type', content: type });
  }

  updateTwitterTitle(title: string) {
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  updateTwitterDescription(desc: string) {
    this.meta.updateTag({ name: 'twitter:description', content: desc });
  }

  updateTwitterCard(card: string) {
    this.meta.updateTag({ name: 'twitter:card', content: card });
  }

  updateTwitterImage(image: string) {
    this.meta.updateTag({ name: 'twitter:image', content: image });
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
