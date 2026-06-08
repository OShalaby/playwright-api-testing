import { test, expect } from '@playwright/test';
import { isProduct } from '../utils/schema';

/**
 * Read coverage for the Products resource.
 *
 * Exercises the full collection (with its pagination envelope), a single
 * resource by id, and a missing resource (404). Uses the `request` fixture
 * (APIRequestContext), which honours `use.baseURL` from playwright.config.ts.
 */
test.describe('Products: read', () => {
  test('GET /products returns 200 with a paginated, schema-valid collection', async ({ request }) => {
    const response = await request.get('/products');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
      products: unknown[];
      limit: number;
      total: number;
    };

    expect(Array.isArray(body.products)).toBe(true);
    expect(body.limit).toBe(30); // DummyJSON returns 30 items per page by default.
    expect(body.total).toBeGreaterThan(0);

    // Every element of the page must satisfy the Product schema.
    for (const product of body.products) {
      expect(isProduct(product)).toBe(true);
    }
  });

  test('GET /products/1 returns 200 with id === 1 and a valid Product body', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { id: number };
    expect(body.id).toBe(1);
    expect(isProduct(body)).toBe(true);
  });

  test('GET /products/9999 returns 404 for a non-existent resource', async ({ request }) => {
    const response = await request.get('/products/9999');

    expect(response.status()).toBe(404);
    expect(response.ok()).toBe(false);
  });
});
