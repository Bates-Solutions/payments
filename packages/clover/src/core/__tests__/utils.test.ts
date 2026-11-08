import { describe, it, expect } from 'vitest';
import { toCents, fromCents, formatMoney, createIdempotencyKey } from '../utils.js';

describe('toCents', () => {
  it('converts dollars to cents', () => {
    expect(toCents(10.5)).toBe(1050);
  });
  it('rounds floating point cleanly', () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0.1 + 0.2)).toBe(30);
  });
});

describe('fromCents', () => {
  it('converts cents to dollars', () => {
    expect(fromCents(1050)).toBe(10.5);
  });
});

describe('formatMoney', () => {
  it('formats USD', () => {
    expect(formatMoney(1050)).toBe('$10.50');
  });
  it('uppercases the lowercase currency code for Intl', () => {
    expect(formatMoney(1000, 'cad')).toContain('10.00');
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
