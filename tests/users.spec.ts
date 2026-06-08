import { test, expect } from '@playwright/test';
import { isUser } from '../utils/schema';

/**
 * Read coverage for the Users resource, including deep validation of nested
 * objects (address.coordinates and the company block).
 */
test.describe('Users', () => {
  test('GET /users returns 200 with a paginated, schema-valid collection', async ({ request }) => {
    const response = await request.get('/users');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
      users: unknown[];
      limit: number;
      total: number;
    };

    expect(Array.isArray(body.users)).toBe(true);
    expect(body.limit).toBe(30); // DummyJSON returns 30 items per page by default.
    expect(body.total).toBeGreaterThan(0);

    for (const user of body.users) {
      expect(isUser(user)).toBe(true);
    }
  });

  test('GET /users/1 exposes nested address.coordinates and company name', async ({ request }) => {
    const response = await request.get('/users/1');

    expect(response.status()).toBe(200);

    const user = (await response.json()) as {
      id: number;
      address: { coordinates: { lat: number; lng: number }; city: string };
      company: { name: string };
    };

    expect(user.id).toBe(1);

    // Independent nested-field checks — soft assertions let all of them report
    // even if one fails, which is more informative for schema regressions.
    expect.soft(typeof user.address.coordinates.lat).toBe('number');
    expect.soft(typeof user.address.coordinates.lng).toBe('number');
    expect.soft(typeof user.company.name).toBe('string');
  });
});
