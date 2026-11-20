import { afterEach, describe, expect, it, vi } from 'vitest';
import { createIdempotencyKey } from '../random';

describe('createIdempotencyKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a version 4 UUID', () => {
    expect(createIdempotencyKey()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('returns a new key each call', () => {
    const keys = new Set(Array.from({ length: 100 }, () => createIdempotencyKey()));
    expect(keys.size).toBe(100);
  });

  it('reads globalThis.crypto at call time, so a stub applies', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000000'
    );
    expect(createIdempotencyKey()).toBe('00000000-0000-4000-8000-000000000000');
  });
});
