import { test, expect } from '@playwright/test';

/**
 * CRUD coverage for the Products resource.
 *
 * IMPORTANT — DummyJSON *simulates* write operations: it accepts the request and
 * returns a realistic response, but nothing is persisted. The server echoes the
 * submitted fields back together with a generated id (for adds) and, for deletes,
 * an `isDeleted`/`deletedOn` marker. The assertions below validate that documented
 * contract rather than real database state.
 *
 * Note: POST /products/add returns 201 Created (verified against the live API);
 * the in-place PUT/PATCH/DELETE operations return 200.
 */
test.describe('Products: CRUD (simulated)', () => {
  test('POST /products/add -> 201, echoes the body with a generated numeric id', async ({ request }) => {
    const response = await request.post('/products/add', {
      data: { title: 'QA Automation Test Product', price: 9.99 },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as { id: number; title: string };
    expect(typeof body.id).toBe('number');
    expect(body.title).toBe('QA Automation Test Product');
  });

  test('PUT /products/1 -> 200, echoes the resource with the replaced field', async ({ request }) => {
    const response = await request.put('/products/1', {
      data: { title: 'Updated Title' },
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { id: number; title: string };
    expect(body.id).toBe(1);
    expect(body.title).toBe('Updated Title');
  });

  test('PATCH /products/1 -> 200, echoes the resource with the patched field', async ({ request }) => {
    const response = await request.patch('/products/1', {
      data: { title: 'Patched Title' },
    });

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { title: string };
    expect(body.title).toBe('Patched Title');
  });

  test('DELETE /products/1 -> 200, flags the resource as deleted', async ({ request }) => {
    const response = await request.delete('/products/1');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as {
      id: number;
      isDeleted: boolean;
      deletedOn: string;
    };
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(typeof body.deletedOn).toBe('string');
  });
});
