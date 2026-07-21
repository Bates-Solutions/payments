import { describe, it, expect } from 'vitest';
import { toMinor, fromMinor, formatMoney, createIdempotencyKey } from '../utils.js';

describe('toMinor', () => {
  it('converts major units to cents', () => {
    expect(toMinor(10.5)).toBe(1050);
    expect(toMinor(10.5, 'usd')).toBe(1050);
  });

  it('handles zero-decimal currencies', () => {
    expect(toMinor(1000, 'jpy')).toBe(1000);
  });

  it('rounds floating point cleanly', () => {
    expect(toMinor(19.99)).toBe(1999);
    expect(toMinor(0.1 + 0.2)).toBe(30);
  });
});

describe('fromMinor', () => {
  it('converts cents to major units', () => {
    expect(fromMinor(1050)).toBe(10.5);
  });

  it('handles zero-decimal currencies', () => {
    expect(fromMinor(1000, 'jpy')).toBe(1000);
  });
});

describe('formatMoney', () => {
  it('formats USD', () => {
    expect(formatMoney(1050)).toBe('$10.50');
  });

  it('formats a zero-decimal currency', () => {
    expect(formatMoney(1000, 'jpy', 'ja-JP')).toContain('1,000');
  });
});

describe('createIdempotencyKey', () => {
  it('returns a unique UUID each call', () => {
    const a = createIdempotencyKey();
    const b = createIdempotencyKey();
    expect(a).toMatch(/^[0-9a-f-]{36}$/);
    expect(a).not.toBe(b);
  });
});
