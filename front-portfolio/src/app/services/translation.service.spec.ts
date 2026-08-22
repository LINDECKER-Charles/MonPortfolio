import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AVAILABLE_LANGUAGES, TranslationService } from './translation.service';

/** Build a fake Response for a given namespace/lang request. */
type FetchHandler = (url: string) => { ok: boolean; body: unknown; throws?: boolean };

function installFetch(handler: FetchHandler): jasmine.Spy {
  return spyOn(window, 'fetch').and.callFake(((input: RequestInfo | URL) => {
    const url = String(input);
    const { ok, body, throws } = handler(url);
    if (throws) return Promise.reject(new Error('network'));
    return Promise.resolve({
      ok,
      json: () => Promise.resolve(body),
    } as Response);
  }) as typeof fetch);
}

function createService(): TranslationService {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  return TestBed.inject(TranslationService);
}

/** Let all pending fetch microtasks settle (setLang fires a fire-and-forget async chain). */
function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('TranslationService', () => {
  const STORAGE_KEY = 'lang';

  afterEach(() => {
    localStorage.clear();
    // reset URL between tests so query-param logic is deterministic
    window.history.replaceState(null, '', '/');
  });

  it('should be created and default to fr', () => {
    const service = createService();
    expect(service).toBeTruthy();
    expect(service.lang()).toBe('fr');
  });

  it('reflects current lang onto document.documentElement.lang via effect', async () => {
    createService();
    TestBed.tick();
    expect(document.documentElement.lang).toBe('fr');
  });

  describe('translate()', () => {
    it('returns the raw key when there is no dot (no namespace)', () => {
      const service = createService();
      expect(service.translate('plainkey')).toBe('plainkey');
    });

    it('returns the key when the namespace is unknown / not yet merged', () => {
      const service = createService();
      expect(service.translate('unknown-ns.some-key')).toBe('unknown-ns.some-key');
    });

    it('returns the key when the key is missing inside a known namespace', async () => {
      installFetch((url) => {
        if (url.includes('/nav-barre/nav-barre.fr.json')) {
          return { ok: true, body: { title: 'Accueil' } };
        }
        return { ok: true, body: {} };
      });
      const service = createService();
      await service.initialize();

      expect(service.translate('nav-barre.title')).toBe('Accueil');
      expect(service.translate('nav-barre.missing')).toBe('nav-barre.missing');
    });
  });

  describe('initialize()', () => {
    it('loads fr baseline and stores DEFAULT_LANG when nothing is set', async () => {
      const fetchSpy = installFetch((url) => {
        if (url.includes('.fr.json')) return { ok: true, body: { greet: 'Bonjour' } };
        return { ok: true, body: {} };
      });
      const service = createService();
      await service.initialize();

      expect(service.lang()).toBe('fr');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
      // only fr namespaces fetched (no second lang load)
      expect(fetchSpy.calls.allArgs().every(([u]) => String(u).includes('.fr.json'))).toBeTrue();
    });

    it('uses a valid query-param lang over storage and merges fr + lang', async () => {
      window.history.replaceState(null, '', '/?lang=en');
      installFetch((url) => {
        if (url.includes('/nav-barre/nav-barre.fr.json')) {
          return { ok: true, body: { title: 'Accueil', only_fr: 'FR' } };
        }
        if (url.includes('/nav-barre/nav-barre.en.json')) {
          return { ok: true, body: { title: 'Home' } };
        }
        return { ok: true, body: {} };
      });
      const service = createService();
      await service.initialize();

      expect(service.lang()).toBe('en');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
      // merge: en overrides fr, fr-only key survives as fallback
      expect(service.translate('nav-barre.title')).toBe('Home');
      expect(service.translate('nav-barre.only_fr')).toBe('FR');
    });

    it('falls back to stored lang when no query param', async () => {
      localStorage.setItem(STORAGE_KEY, 'es');
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();
      await service.initialize();

      expect(service.lang()).toBe('es');
    });

    it('ignores an invalid query-param lang and falls back to stored', async () => {
      window.history.replaceState(null, '', '/?lang=zzz');
      localStorage.setItem(STORAGE_KEY, 'de');
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();
      await service.initialize();

      expect(service.lang()).toBe('de');
    });

    it('ignores an invalid stored lang and falls back to DEFAULT_LANG', async () => {
      localStorage.setItem(STORAGE_KEY, 'not-a-lang');
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();
      await service.initialize();

      expect(service.lang()).toBe('fr');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
    });

    it('updates documentElement.lang to the resolved language', async () => {
      window.history.replaceState(null, '', '/?lang=it');
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();
      await service.initialize();
      TestBed.tick();

      expect(document.documentElement.lang).toBe('it');
    });

    it('survives a throwing localStorage (stockage refusé) and falls back to fr', async () => {
      installFetch(() => ({ ok: true, body: {} }));
      spyOn(Storage.prototype, 'getItem').and.throwError('SecurityError');
      spyOn(Storage.prototype, 'setItem').and.throwError('SecurityError');
      const service = createService();

      await expectAsync(service.initialize()).toBeResolved();
      expect(service.lang()).toBe('fr');
    });
  });

  describe('setLang()', () => {
    it('ignores an invalid code (no storage, no fetch)', () => {
      const fetchSpy = installFetch(() => ({ ok: true, body: {} }));
      const service = createService();

      service.setLang('nope');

      expect(service.lang()).toBe('fr');
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('sets a valid code, persists it and adds the URL query param', async () => {
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();

      service.setLang('en');
      // synchronous side-effects happen immediately
      expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
      expect(new URL(window.location.href).searchParams.get('lang')).toBe('en');

      await flush();
      TestBed.tick();
      expect(service.lang()).toBe('en');
    });

    it('removes the URL query param when switching back to DEFAULT_LANG', async () => {
      window.history.replaceState(null, '', '/?lang=en');
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();

      service.setLang('fr');

      expect(new URL(window.location.href).searchParams.has('lang')).toBeFalse();
      expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
    });

    it('still applies the language when localStorage.setItem throws', async () => {
      installFetch(() => ({ ok: true, body: {} }));
      const service = createService();
      spyOn(Storage.prototype, 'setItem').and.throwError('SecurityError');

      service.setLang('en');
      await flush();
      TestBed.tick();

      expect(service.lang()).toBe('en');
    });
  });

  describe('loadLang cache + error handling', () => {
    it('does not refetch a language already in cache', async () => {
      const fetchSpy = installFetch(() => ({ ok: true, body: {} }));
      const service = createService();

      await service.initialize(); // loads fr
      const callsAfterInit = fetchSpy.calls.count();

      // switching to fr again must hit the cache (no extra fetch for fr)
      service.setLang('fr');
      await flush();

      expect(fetchSpy.calls.count()).toBe(callsAfterInit);
    });

    it('treats a non-ok response as an empty namespace', async () => {
      installFetch((url) => {
        if (url.includes('/nav-barre/nav-barre.fr.json')) {
          return { ok: false, body: { title: 'should-be-ignored' } };
        }
        return { ok: true, body: {} };
      });
      const service = createService();
      await service.initialize();

      expect(service.translate('nav-barre.title')).toBe('nav-barre.title');
    });

    it('treats a thrown fetch as an empty namespace', async () => {
      installFetch((url) => {
        if (url.includes('/nav-barre/nav-barre.fr.json')) {
          return { ok: true, body: {}, throws: true };
        }
        return { ok: true, body: {} };
      });
      const service = createService();
      await service.initialize();

      expect(service.translate('nav-barre.title')).toBe('nav-barre.title');
    });
  });

  it('exposes the full AVAILABLE_LANGUAGES list', () => {
    const service = createService();
    expect(service.languages).toBe(AVAILABLE_LANGUAGES);
    expect(service.languages.length).toBeGreaterThan(10);
  });
});
