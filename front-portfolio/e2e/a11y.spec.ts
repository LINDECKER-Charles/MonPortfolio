import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PUBLIC_ROUTES } from './routes';
import { stubImageServer } from './image-server-stub';

/**
 * Scan axe-core (WCAG 2.1 AA) sur chaque route publique.
 * Les violations `serious`/`critical` sont bloquantes ; les autres sont
 * remontées dans le rapport sans faire échouer le run.
 */
const BLOCKING_IMPACTS = new Set(['serious', 'critical']);

for (const route of PUBLIC_ROUTES) {
  test(`a11y ${route.path}`, async ({ page }, testInfo) => {
    await stubImageServer(page);
    await page.goto(route.path);
    await page.locator('main').first().waitFor();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      await testInfo.attach(`axe${route.path.replaceAll('/', '-')}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });
    }

    const blocking = results.violations.filter((v) => v.impact && BLOCKING_IMPACTS.has(v.impact));
    expect(
      blocking.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(' ')),
      })),
    ).toEqual([]);
  });
}
