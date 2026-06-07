import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';

import { MetaService } from './meta-service';

const STRUCTURED_DATA_ID = 'app-structured-data';

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

  describe('standard + OG + Twitter meta tags', () => {
    const cases: Array<{ method: keyof MetaService; selector: string; value: string }> = [
      { method: 'updateDescription', selector: "meta[name='description']", value: 'desc' },
      { method: 'updateRobots', selector: "meta[name='robots']", value: 'noindex' },
      { method: 'updateOgTitle', selector: "meta[property='og:title']", value: 'OG Title' },
      { method: 'updateOgDescription', selector: "meta[property='og:description']", value: 'OG D' },
      { method: 'updateOgUrl', selector: "meta[property='og:url']", value: 'https://x.test' },
      { method: 'updateOgImage', selector: "meta[property='og:image']", value: 'https://x/i.png' },
      { method: 'updateOgType', selector: "meta[property='og:type']", value: 'website' },
      { method: 'updateTwitterTitle', selector: "meta[name='twitter:title']", value: 'T Title' },
      { method: 'updateTwitterDescription', selector: "meta[name='twitter:description']", value: 'T D' },
      { method: 'updateTwitterCard', selector: "meta[name='twitter:card']", value: 'summary' },
      { method: 'updateTwitterImage', selector: "meta[name='twitter:image']", value: 'https://x/t.png' },
    ];

    for (const { method, selector, value } of cases) {
      it(`${method} injects ${selector}`, () => {
        (service[method] as (v: string) => void)(value);
        const el = document.head.querySelector<HTMLMetaElement>(selector);
        expect(el).withContext(selector).not.toBeNull();
        expect(el!.getAttribute('content')).toBe(value);
      });
    }

    it('updateDescription replaces the existing tag instead of duplicating', () => {
      service.updateDescription('first');
      service.updateDescription('second');
      const all = document.head.querySelectorAll("meta[name='description']");
      expect(all.length).toBe(1);
      expect(all[0].getAttribute('content')).toBe('second');
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
