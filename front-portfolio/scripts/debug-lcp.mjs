// Diagnostic LCP : liste les candidats LCP successifs et les erreurs console
// (hydratation) sur une route du build SSR. Usage : node scripts/debug-lcp.mjs [path]
import { chromium } from '@playwright/test';

const route = process.argv[2] ?? '/';
const browser = await chromium.launch();
const page = await browser.newPage();

const consoleMessages = [];
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    consoleMessages.push(`[${msg.type()}] ${msg.text().slice(0, 300)}`);
  }
});

await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__lcp.push({
        time: Math.round(e.startTime),
        size: e.size,
        tag: e.element?.tagName,
        cls: e.element?.className?.toString().slice(0, 80),
        text: e.element?.textContent?.slice(0, 40),
      });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
});

await page.goto(`http://localhost:4000${route}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const lcp = await page.evaluate(() => window.__lcp);
console.log('LCP candidates:', JSON.stringify(lcp, null, 2));
console.log('Console issues:', JSON.stringify(consoleMessages, null, 2));

await browser.close();
