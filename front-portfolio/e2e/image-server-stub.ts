import { Page } from '@playwright/test';

import { IMAGE_SERVER_BASE_URL } from '../src/app/img-sources/image-server';

/** WebP 1×1 transparent — suffisant pour déclencher `load` et les layouts. */
const PIXEL_WEBP = Buffer.from('UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==', 'base64');

/**
 * Stub hermétique du serveur d'images distant : les e2e ne dépendent plus du
 * réseau vers ce vhost (sur les runners CI, ses assets eager n'aboutissaient
 * pas et l'event `load` n'était jamais émis — routes exclues via
 * E2E_EXCLUDE_ROUTES, couverture perdue).
 *
 * Opt-out local pour tester contre le vrai serveur : `E2E_REAL_IMAGES=1`.
 */
export async function stubImageServer(page: Page): Promise<void> {
  if (process.env['E2E_REAL_IMAGES']) return;
  await page.route(`${IMAGE_SERVER_BASE_URL}/**`, (route) =>
    route.fulfill({ status: 200, contentType: 'image/webp', body: PIXEL_WEBP }),
  );
}
