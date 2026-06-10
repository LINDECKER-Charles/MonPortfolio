import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['E2E_PORT'] ?? 4173);

/**
 * Les tests tournent contre le build SSR de production (dist/), pas le dev-server :
 * `npm run build` doit avoir été exécuté avant `npm run e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI']
    ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list']],
  use: {
    // localhost (pas 127.0.0.1) : la protection SSRF d'Angular SSR rejette
    // les hostnames IP et bascule silencieusement en CSR.
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    // Les séquences GSAP respectent prefers-reduced-motion : on fige les
    // animations pour des assertions stables.
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node dist/front-portfolio/server/server.mjs',
    port: PORT,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
});
