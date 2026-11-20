/**
 * Create a random idempotency key: a version 4 UUID from WebCrypto's
 * `randomUUID`, so it runs on Node 22+, Deno, Bun and Workers.
 *
 * @returns A UUID string
 *
 * @example
 * ```typescript
 * const key = createIdempotencyKey();
 * // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function createIdempotencyKey(): string {
  return globalThis.crypto.randomUUID();
}
