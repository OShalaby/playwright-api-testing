/**
 * Lightweight, dependency-free type guards used to validate API response shapes.
 *
 * Each function returns a boolean and is intentionally small so it can be dropped
 * straight into an `expect(...).toBe(true)` assertion inside a spec. Keeping the
 * validation here (rather than inline in tests) means schema rules live in one
 * place and are reused across every spec. Shapes target the DummyJSON API
 * (https://dummyjson.com).
 */

/** Narrowing helper: true when `value` is a non-null object (and not an array). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Basic RFC-ish email check — good enough to assert the API returns email-shaped strings. */
export function isValidEmail(value: unknown): boolean {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validates a DummyJSON Product object (core fields):
 *   { id: number, title: string, price: number, description: string,
 *     category: string, stock: number }
 */
export function isProduct(obj: unknown): boolean {
  if (!isRecord(obj)) return false;
  return (
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.stock === 'number'
  );
}

/**
 * Validates a DummyJSON User object, including the nested
 * `address.coordinates` block and the `company` block:
 *   { id: number, firstName: string, lastName: string, email: <valid>,
 *     age: number,
 *     address: { coordinates: { lat: number, lng: number }, city: string },
 *     company: { name: string } }
 */
export function isUser(obj: unknown): boolean {
  if (!isRecord(obj)) return false;

  if (
    typeof obj.id !== 'number' ||
    typeof obj.firstName !== 'string' ||
    typeof obj.lastName !== 'string' ||
    !isValidEmail(obj.email) ||
    typeof obj.age !== 'number'
  ) {
    return false;
  }

  // Nested address + coordinates.
  const address = obj.address;
  if (!isRecord(address)) return false;
  if (typeof address.city !== 'string') return false;

  const coordinates = address.coordinates;
  if (!isRecord(coordinates)) return false;
  if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    return false;
  }

  // Nested company block.
  const company = obj.company;
  if (!isRecord(company)) return false;
  if (typeof company.name !== 'string') return false;

  return true;
}

/**
 * Validates a DummyJSON Post object:
 *   { id: number, title: string, body: string, userId: number, tags: string[] }
 */
export function isPost(obj: unknown): boolean {
  if (!isRecord(obj)) return false;
  return (
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.body === 'string' &&
    typeof obj.userId === 'number' &&
    Array.isArray(obj.tags)
  );
}

/**
 * Validates a DummyJSON Comment object, including the nested `user` block:
 *   { id: number, body: string, postId: number,
 *     user: { id: number, username: string } }
 */
export function isComment(obj: unknown): boolean {
  if (!isRecord(obj)) return false;

  if (
    typeof obj.id !== 'number' ||
    typeof obj.body !== 'string' ||
    typeof obj.postId !== 'number'
  ) {
    return false;
  }

  const user = obj.user;
  if (!isRecord(user)) return false;
  if (typeof user.id !== 'number' || typeof user.username !== 'string') {
    return false;
  }

  return true;
}
