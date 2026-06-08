import { test, expect } from '@playwright/test';
import { isPost, isComment } from '../utils/schema';

/**
 * Read coverage for the Posts resource and its nested comments.
 *
 * Exercises the paginated collection, a single resource by id, and traversal of
 * a nested sub-collection (a post's comments), asserting the comments are scoped
 * to the parent post.
 */
test.describe('Posts & comments', () => {
  test('GET /posts returns 200 with a schema-valid collection', async ({ request }) => {
    const response = await request.get('/posts');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { posts: unknown[]; total: number };
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.total).toBeGreaterThan(0);

    for (const post of body.posts) {
      expect(isPost(post)).toBe(true);
    }
  });

  test('GET /posts/1 returns 200 with id === 1 and a valid Post body', async ({ request }) => {
    const response = await request.get('/posts/1');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { id: number };
    expect(body.id).toBe(1);
    expect(isPost(body)).toBe(true);
  });

  test('GET /posts/1/comments returns 200 with comments scoped to post 1', async ({ request }) => {
    const response = await request.get('/posts/1/comments');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as { comments: Array<{ postId: number }> };
    expect(Array.isArray(body.comments)).toBe(true);

    for (const comment of body.comments) {
      expect(isComment(comment)).toBe(true);
      expect(comment.postId).toBe(1);
    }
  });
});
