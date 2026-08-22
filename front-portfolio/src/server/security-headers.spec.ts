import { contentSecurityPolicy, imageServerOrigin, securityHeaders } from './security-headers';

describe('security-headers', () => {
  describe('imageServerOrigin', () => {
    it("extrait l'origine d'un préfixe absolu (dev docker)", () => {
      expect(imageServerOrigin('http://localhost:8081')).toBe('http://localhost:8081');
      expect(imageServerOrigin('https://images.example.com/base')).toBe(
        'https://images.example.com',
      );
    });

    it('est vide pour un préfixe relatif (production : /img)', () => {
      expect(imageServerOrigin('/img')).toBe('');
    });
  });

  describe('contentSecurityPolicy', () => {
    it('reste stricte : aucun script inline, pas de framing, objets interdits', () => {
      const csp = contentSecurityPolicy(true, '/img');

      expect(csp).toContain("script-src 'self'");
      expect(csp).not.toContain("script-src 'self' 'unsafe");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    });

    it("n'autorise que l'origine du site pour les images servies sous /img", () => {
      expect(contentSecurityPolicy(true, '/img')).toContain("img-src 'self' data: blob:;");
    });

    it("ajoute l'origine externe du serveur d'images quand le préfixe est absolu", () => {
      expect(contentSecurityPolicy(false, 'http://localhost:8081')).toContain(
        "img-src 'self' data: blob: http://localhost:8081;",
      );
    });

    it("n'upgrade les requêtes qu'en HTTPS", () => {
      expect(contentSecurityPolicy(true, '/img')).toContain('upgrade-insecure-requests');
      expect(contentSecurityPolicy(false, '/img')).not.toContain('upgrade-insecure-requests');
    });
  });

  describe('securityHeaders', () => {
    it('émet toujours les headers anti-sniff / anti-framing / referrer', () => {
      const headers = securityHeaders({ secure: false, noindex: false }, '/img');

      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
      expect(headers['X-XSS-Protection']).toBe('0');
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    });

    it("n'émet HSTS qu'en HTTPS (sinon un proxy HTTP local le verrait ignoré ou nuisible)", () => {
      expect(
        securityHeaders({ secure: false, noindex: false }, '/img')['Strict-Transport-Security'],
      ).toBeUndefined();
      expect(
        securityHeaders({ secure: true, noindex: false }, '/img')['Strict-Transport-Security'],
      ).toBe('max-age=31536000; includeSubDomains; preload');
    });

    it("marque l'environnement non indexable avec X-Robots-Tag", () => {
      expect(
        securityHeaders({ secure: true, noindex: false }, '/img')['X-Robots-Tag'],
      ).toBeUndefined();
      expect(securityHeaders({ secure: true, noindex: true }, '/img')['X-Robots-Tag']).toBe(
        'noindex, nofollow',
      );
    });

    it("suit IMAGE_SERVER_URL de l'environnement par défaut", () => {
      const headers = securityHeaders({ secure: true, noindex: false });

      expect(headers['Content-Security-Policy']).toContain("img-src 'self' data: blob:");
    });
  });
});
