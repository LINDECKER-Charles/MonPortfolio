import { expect, test } from '@playwright/test';
import { PUBLIC_ROUTES } from './routes';
import { stubImageServer } from './image-server-stub';

for (const route of PUBLIC_ROUTES) {
  test.describe(`smoke ${route.path}`, () => {
    test('rend la page SSR avec son contenu', async ({ page }) => {
      await stubImageServer(page);
      const response = await page.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);

      // Landmark principal présent et non vide. textContent plutôt qu'innerText :
      // les sections sous reveal-on-scroll sont masquées avant intersection,
      // on valide ici le contenu SSR, pas sa visibilité.
      const main = page.locator('main').first();
      await main.waitFor({ state: 'attached' });
      expect((await main.textContent())?.trim().length).toBeGreaterThan(0);
    });
  });
}

test('la route inconnue renvoie la page 404 dédiée', async ({ page }) => {
  await stubImageServer(page);
  const response = await page.goto('/cette-route-n-existe-pas');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page introuvable/);
});
