import { ENV } from '../../environments/env';
import { IMAGE_SERVER_BASE_URL, imageServerUrl } from './image-server';

/** Contrat de non-régression : l'origine du serveur d'images vient du `.env`
    racine (IMAGE_SERVER_URL) et préfixe les chemins sans les altérer. */
describe('image-server', () => {
  it("expose l'origine injectée depuis l'environnement", () => {
    expect(IMAGE_SERVER_BASE_URL).toBe(ENV.imageServerUrl);
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
});
