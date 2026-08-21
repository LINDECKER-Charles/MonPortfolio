import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';

import { RouteMeta } from '../seo/route-meta';
import { MetaService } from './meta-service';

const STRUCTURED_DATA_ID = 'app-structured-data';

/** Bloc RouteMeta complet — chaque clé du contrat porte une valeur distincte. */
const FULL_META: RouteMeta = {
  description: 'desc',
  canonical: 'https://example.test/page',
  robots: 'noindex',
  ogTitle: 'OG Title',
  ogDescription: 'OG Desc',
  ogImage: 'https://x/i.png',
  ogUrl: 'https://x.test',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'T Title',
  twitterDescription: 'T Desc',
  twitterImage: 'https://x/t.png',
  structuredData: [{ '@type': 'WebPage', name: 'Page' }],
  showFooter: true,
};

describe('MetaService', () => {
  let service: MetaService;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(MetaService);
    meta = TestBed.inject(Meta);
  });

  afterEach(() => {
    // clean any tags/links/scripts we injected into the head
    document.querySelectorAll("link[rel='canonical']").forEach((n) => n.remove());
    document.getElementById(STRUCTURED_DATA_ID)?.remove();
    for (const sel of [
      'name="description"',
      'name="robots"',
      'property="og:title"',
      'property="og:description"',
      'property="og:url"',
      'property="og:image"',
      'property="og:type"',
      'name="twitter:title"',
      'name="twitter:description"',
      'name="twitter:card"',
      'name="twitter:image"',
    ]) {
      const [attr, raw] = sel.split('=');
      meta.removeTag(`${attr}='${raw.replace(/"/g, '')}'`);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('applyRouteMeta()', () => {
    /**
     * Table d'attendus couvrant l'intégralité du contrat RouteMeta rendu en
     * balises `<meta>` (canonical et structuredData vérifiés à part).
     */
    const expectedTags: { selector: string; value: string }[] = [
      { selector: "meta[name='description']", value: FULL_META.description },
      { selector: "meta[name='robots']", value: FULL_META.robots },
      { selector: "meta[property='og:title']", value: FULL_META.ogTitle },
      { selector: "meta[property='og:description']", value: FULL_META.ogDescription },
      { selector: "meta[property='og:image']", value: FULL_META.ogImage },
      { selector: "meta[property='og:url']", value: FULL_META.ogUrl },
      { selector: "meta[property='og:type']", value: FULL_META.ogType },
      { selector: "meta[name='twitter:card']", value: FULL_META.twitterCard },
      { selector: "meta[name='twitter:title']", value: FULL_META.twitterTitle },
      { selector: "meta[name='twitter:description']", value: FULL_META.twitterDescription },
      { selector: "meta[name='twitter:image']", value: FULL_META.twitterImage },
    ];

    it('renders every meta tag of the RouteMeta contract in one call', () => {
      service.applyRouteMeta(FULL_META);

      for (const { selector, value } of expectedTags) {
        const el = document.head.querySelector<HTMLMetaElement>(selector);
        expect(el).withContext(selector).not.toBeNull();
        expect(el!.getAttribute('content')).withContext(selector).toBe(value);
      }
    });

    it('sets the canonical link and the JSON-LD block through the same call', () => {
      service.applyRouteMeta(FULL_META);

      const link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
      expect(link).not.toBeNull();
      expect(link!.getAttribute('href')).toBe(FULL_META.canonical);

      const script = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(JSON.parse(script.text)).toEqual({
        '@context': 'https://schema.org',
        '@graph': FULL_META.structuredData,
      });
    });

    it('replaces existing tags on re-apply instead of duplicating them', () => {
      service.applyRouteMeta(FULL_META);
      service.applyRouteMeta({ ...FULL_META, description: 'second', ogTitle: 'OG 2' });

      const all = document.head.querySelectorAll("meta[name='description']");
      expect(all.length).toBe(1);
      expect(all[0].getAttribute('content')).toBe('second');
      expect(
        document.head.querySelector("meta[property='og:title']")!.getAttribute('content'),
      ).toBe('OG 2');
    });
  });

  describe('updateCanonical()', () => {
    it('creates the canonical link when none exists', () => {
      service.updateCanonical('https://example.test/');
      const link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
      expect(link).not.toBeNull();
      expect(link!.getAttribute('href')).toBe('https://example.test/');
    });

    it('reuses and updates the existing canonical link', () => {
      service.updateCanonical('https://a.test/');
      service.updateCanonical('https://b.test/');
      const links = document.head.querySelectorAll("link[rel='canonical']");
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe('https://b.test/');
    });
  });

  describe('updateStructuredData()', () => {
    it('injects a single JSON-LD object', () => {
      service.updateStructuredData({ '@type': 'Person', name: 'Charles' });
      const script = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement;
      expect(script).not.toBeNull();
      expect(script.type).toBe('application/ld+json');
      expect(JSON.parse(script.text)).toEqual({ '@type': 'Person', name: 'Charles' });
    });

    it('wraps an array in @context + @graph', () => {
      service.updateStructuredData([{ '@type': 'A' }, { '@type': 'B' }]);
      const script = document.getElementById(STRUCTURED_DATA_ID) as HTMLScriptElement;
      expect(JSON.parse(script.text)).toEqual({
        '@context': 'https://schema.org',
        '@graph': [{ '@type': 'A' }, { '@type': 'B' }],
      });
    });

    it('removes any previous block before injecting a new one', () => {
      service.updateStructuredData({ '@type': 'A' });
      service.updateStructuredData({ '@type': 'B' });
      const blocks = document.head.querySelectorAll(`#${STRUCTURED_DATA_ID}`);
      expect(blocks.length).toBe(1);
      expect(JSON.parse((blocks[0] as HTMLScriptElement).text)).toEqual({ '@type': 'B' });
    });

    it('removes the block and injects nothing when schema is undefined', () => {
      service.updateStructuredData({ '@type': 'A' });
      service.updateStructuredData(undefined);
      expect(document.getElementById(STRUCTURED_DATA_ID)).toBeNull();
    });
  });
});
