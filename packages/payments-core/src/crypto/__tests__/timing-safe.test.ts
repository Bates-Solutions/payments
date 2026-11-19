import { describe, expect, it } from 'vitest';
import { timingSafeEqual } from '../timing-safe';

const bytes = (...values: number[]) => new Uint8Array(values);

describe('timingSafeEqual', () => {
  it('is true for equal strings', () => {
    expect(timingSafeEqual('abc123', 'abc123')).toBe(true);
  });

  it('is false for strings that differ in one character', () => {
    expect(timingSafeEqual('abc123', 'abc124')).toBe(false);
    expect(timingSafeEqual('Abc123', 'abc123')).toBe(false);
  });

  it('is false for different lengths', () => {
    expect(timingSafeEqual('abc', 'abcd')).toBe(false);
    expect(timingSafeEqual(bytes(1, 2), bytes(1, 2, 3))).toBe(false);
  });

  it('is false when either side is empty, even if both are', () => {
    expect(timingSafeEqual('', '')).toBe(false);
    expect(timingSafeEqual('', 'a')).toBe(false);
    expect(timingSafeEqual(bytes(), bytes())).toBe(false);
  });

  it('compares bytes', () => {
    expect(timingSafeEqual(bytes(0, 255, 7), bytes(0, 255, 7))).toBe(true);
    expect(timingSafeEqual(bytes(0, 255, 7), bytes(0, 255, 6))).toBe(false);
  });

  it('compares a string with bytes as its UTF-8 encoding', () => {
    expect(timingSafeEqual('é', bytes(0xc3, 0xa9))).toBe(true);
    expect(timingSafeEqual(bytes(0xc3, 0xa9), 'é')).toBe(true);
    expect(timingSafeEqual('é', bytes(0xe9))).toBe(false);
  });

  it('treats strings with the same character count but different UTF-8 lengths as unequal', () => {
    expect(timingSafeEqual('aé', 'ab')).toBe(false);
  });

  it('finds a difference in the first, middle and last byte', () => {
    const base = 'a'.repeat(64);
    for (const i of [0, 31, 63]) {
      const changed = base.slice(0, i) + 'b' + base.slice(i + 1);
      expect(timingSafeEqual(base, changed)).toBe(false);
    }
  });
});
