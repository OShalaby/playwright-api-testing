import { test, expect } from '@playwright/test';

/**
 * Authentication coverage: login then use the returned bearer token.
 *
 * `emilys` / `emilyspass` are DummyJSON's public demo credentials
 * (https://dummyjson.com/docs/auth) — safe to commit to a public repo.
 */
test.describe('Auth (login + token)', () => {
  test('POST /auth/login -> 200 and returns a usable access token', async ({ request }) => {
    const loginResponse = await request.post('/auth/login', {
      data: { username: 'emilys', password: 'emilyspass' },
    });

    expect(loginResponse.status()).toBe(200);

    const session = (await loginResponse.json()) as {
      accessToken: string;
      username: string;
    };
    expect(typeof session.accessToken).toBe('string');
    expect(session.accessToken.length).toBeGreaterThan(0);
    expect(session.username).toBe('emilys');

    // Use the token to fetch the authenticated user's profile.
    const meResponse = await request.get('/auth/me', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    expect(meResponse.status()).toBe(200);

    const me = (await meResponse.json()) as { username: string };
    expect(me.username).toBe('emilys');
  });
});
