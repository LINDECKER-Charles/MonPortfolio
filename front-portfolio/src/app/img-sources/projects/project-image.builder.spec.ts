import { ENV } from '../../../environments/env';
import { buildProjectImage } from './project-image.builder';

/** Contrat de non-régression des URL générées pour les images de projets :
    déclinaisons `<w>x<h>_<name>.webp` + pleine résolution `<name>.webp`,
    toutes préfixées par l'origine du serveur d'images. */
describe('buildProjectImage', () => {
  const ORIGIN = ENV.imageServerUrl;

  const image = buildProjectImage('Omnicard', 'admin_view', 'Vue admin Omnicard', [
    { width: 24, height: 28 },
    { width: 160, height: 188 },
    { width: 640, height: 752 },
  ]);

  it("transmet l'alt tel quel", () => {
    expect(image.alt).toBe('Vue admin Omnicard');
  });

  it('génère une déclinaison <w>x<h>_<name>.webp par taille, avec descripteur max-width', () => {
    expect(image.sources.slice(0, 3)).toEqual([
      {
        src: `${ORIGIN}/project/Omnicard/24x28_admin_view.webp`,
        maxWidth: 24,
        type: 'image/webp',
      },
      {
        src: `${ORIGIN}/project/Omnicard/160x188_admin_view.webp`,
        maxWidth: 160,
        type: 'image/webp',
      },
      {
        src: `${ORIGIN}/project/Omnicard/640x752_admin_view.webp`,
        maxWidth: 640,
        type: 'image/webp',
      },
    ]);
  });

  it('termine par la source pleine résolution <name>.webp sans descripteur', () => {
    expect(image.sources.length).toBe(4);
    expect(image.sources[3]).toEqual({
      src: `${ORIGIN}/project/Omnicard/admin_view.webp`,
      type: 'image/webp',
    });
  });

  it('utilise la pleine résolution comme fallback', () => {
    expect(image.fallbackSrc).toBe(`${ORIGIN}/project/Omnicard/admin_view.webp`);
  });

  it("préfixe toutes les URL par l'origine du serveur d'images", () => {
    for (const source of image.sources) {
      expect(source.src.startsWith(`${ORIGIN}/project/`)).toBeTrue();
    }
  });
});
