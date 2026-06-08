import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the REST API testing suite.
 *
 * The `request` fixture (APIRequestContext) honours `use.baseURL`, so every spec
 * issues requests with relative paths (e.g. `request.get('/products')`). No browser
 * navigation happens here, but a single Chromium project is declared so the runner
 * behaves consistently in local and CI environments.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://dummyjson.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
