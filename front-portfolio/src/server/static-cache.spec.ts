import {
  CACHE_DEFAULT,
  CACHE_IMMUTABLE,
  CACHE_SHORT,
  cacheControlFor,
} from './static-cache';

describe('cacheControlFor', () => {
  it('marks build-hashed files as immutable', () => {
    expect(cacheControlFor('/main-W3ZAQXAT.js')).toBe(CACHE_IMMUTABLE);
    expect(cacheControlFor('/chunk-5KMSAAGH.js')).toBe(CACHE_IMMUTABLE);
    expect(cacheControlFor('/styles-BDWMDEKY.css')).toBe(CACHE_IMMUTABLE);
  });

  it('marks self-hosted fonts as immutable', () => {
    expect(cacheControlFor('/fonts/cinzel-8vIJ7ww63mVu7gt79mT7.woff2')).toBe(CACHE_IMMUTABLE);
  });

  it('keeps non-hashed living assets on a short cache', () => {
    expect(cacheControlFor('/lang/common/common.fr.json')).toBe(CACHE_SHORT);
    expect(cacheControlFor('/robots.txt')).toBe(CACHE_SHORT);
    expect(cacheControlFor('/sitemap.xml')).toBe(CACHE_SHORT);
    expect(cacheControlFor('/site.webmanifest')).toBe(CACHE_SHORT);
  });

  it('falls back to the default policy for stable media', () => {
    expect(cacheControlFor('/song/hunters_dream.mp3')).toBe(CACHE_DEFAULT);
    expect(cacheControlFor('/logo/40x40_logo_white.png')).toBe(CACHE_DEFAULT);
    expect(cacheControlFor('/favicon.ico')).toBe(CACHE_DEFAULT);
  });

  it('does not treat lookalike paths as hashed or short-lived', () => {
    // suffixe trop court ou minuscules : pas un hash esbuild
    expect(cacheControlFor('/logo/logo-white.png')).toBe(CACHE_DEFAULT);
    expect(cacheControlFor('/langues.json')).toBe(CACHE_DEFAULT);
  });
});
