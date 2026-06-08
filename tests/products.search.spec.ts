import { test, expect } from '@playwright/test';
import { isProduct } from '../utils/schema';

/**
 * Search and category coverage for the Products resource.
 *
 * Demonstrates passing query params via the `params` option (Playwright encodes
 * them onto the URL), reading a bare top-level array response, and traversing a
 * category sub-collection.
 */
test.describe('Products: search & categories', () => {
  test('GET /products/search?q=phone returns 200 with schema-valid matches', async ({ request }) => {
    const response = await request.get('/products/search', { params: { q: 'phone' } });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { products: unknown[] };
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);

    for (const product of body.products) {
      expect(isProduct(product)).toBe(true);
    }
  });

  test('GET /products/categories returns 200 with a non-empty array', async ({ request }) => {
    const response = await request.get('/products/categories');

    expect(response.status()).toBe(200);

    const categories = (await response.json()) as unknown[];
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  test('GET /products/category/smartphones returns 200 with a non-empty product list', async ({ request }) => {
    const response = await request.get('/products/category/smartphones');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { products: unknown[] };
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });
});
