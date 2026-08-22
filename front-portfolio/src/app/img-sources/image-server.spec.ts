import { ENV } from '../../environments/env';
import {
  IMAGE_SERVER_BASE_URL,
  IMAGE_SERVER_IS_SAME_ORIGIN,
  absoluteImageServerUrl,
  imageServerUrl,
  isSameOrigin,
  resolveAbsoluteImageUrl,
} from './image-server';

/** Contrat de non-régression : le préfixe des images vient du `.env` racine
    (IMAGE_SERVER_URL) et préfixe les chemins sans les altérer. */
describe('image-server', () => {
  it("expose le préfixe injecté depuis l'environnement", () => {
    expect(IMAGE_SERVER_BASE_URL).toBe(ENV.imageServerUrl);
    expect(IMAGE_SERVER_IS_SAME_ORIGIN).toBe(isSameOrigin(ENV.imageServerUrl));
  });

  it("préfixe un chemin absolu par l'origine sans le modifier", () => {
    expect(imageServerUrl('/project/Omnicard/admin_view.webp')).toBe(
      `${ENV.imageServerUrl}/project/Omnicard/admin_view.webp`,
    );
  });

  it('préserve les chemins percent-encodés tels quels (contrat srcset)', () => {
    expect(imageServerUrl('/photos/480x720_me%20-%201.webp')).toBe(
      `${ENV.imageServerUrl}/photos/480x720_me%20-%201.webp`,
    );
  });

  it("ne produit pas de double slash entre l'origine et le chemin", () => {
    expect(imageServerUrl('/icon/rune.webp')).not.toContain('//icon');
  });

  describe('isSameOrigin', () => {
    it('reconnaît un préfixe relatif (production : /img) et une origine absolue (dev docker)', () => {
      expect(isSameOrigin('/img')).toBeTrue();
      expect(isSameOrigin('http://localhost:8081')).toBeFalse();
    });
  });

  describe('resolveAbsoluteImageUrl', () => {
    it("résout un préfixe relatif contre l'origine canonique (JSON-LD, Open Graph)", () => {
      expect(resolveAbsoluteImageUrl('/img', 'https://example.com', '/photos/me.webp')).toBe(
        'https://example.com/img/photos/me.webp',
      );
    });

    it('laisse une origine absolue inchangée', () => {
      expect(
        resolveAbsoluteImageUrl('http://localhost:8081', 'https://example.com', '/photos/me.webp'),
      ).toBe('http://localhost:8081/photos/me.webp');
    });
  });

  it("absoluteImageServerUrl produit toujours une URL absolue, quel que soit l'environnement", () => {
    const url = absoluteImageServerUrl('/photos/640x960_me-1.webp');

    expect(url).toMatch(/^https?:\/\//);
    expect(url.endsWith('/photos/640x960_me-1.webp')).toBeTrue();
  });
});
