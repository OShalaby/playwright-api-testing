import { test, expect } from '@playwright/test';

/**
 * Response-header and status-helper coverage.
 *
 * Validates that the API advertises JSON content correctly and that Playwright's
 * `response.ok()` helper reflects the 2xx status range. These checks guard the
 * transport-level contract independently of the response body shape.
 */
test.describe('Response headers & status helpers', () => {
  test('GET /products/1 is ok() and advertises application/json', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.ok()).toBe(true);

    const contentType = response.headers()['content-type'];
    expect(contentType).toBeDefined();
    expect(contentType).toContain('application/json');
  });

  test('GET /products/9999 is not ok() and returns 404', async ({ request }) => {
    const response = await request.get('/products/9999');

    expect(response.ok()).toBe(false);
    expect(response.status()).toBe(404);
  });
});
