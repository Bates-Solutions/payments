import { describe, it, expect } from 'vitest';
import { toCents, fromCents, formatMoney, createIdempotencyKey } from '../utils.js';
import { CloverValidationError } from '../errors.js';
import type { CurrencyCode } from '../types/index.js';

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

describe('currency rules from payments-core', () => {
  it('keeps every CurrencyCode two-decimal', () => {
    for (const currency of ['usd', 'cad', 'gbp', 'eur', 'aud'] as const) {
      expect(toCents(10.5, currency)).toBe(1050);
      expect(fromCents(1050, currency)).toBe(10.5);
    }
    expect(formatMoney(1050, 'gbp', 'en-GB')).toBe('\u00a310.50');
  });

  it('matches the currency in any case', () => {
    expect(toCents(10.5, 'USD' as CurrencyCode)).toBe(1050);
    expect(toCents(1000, 'JPY' as CurrencyCode)).toBe(1000);
    expect(fromCents(5124, 'Kwd' as CurrencyCode)).toBe(5.124);
  });

  it('uses the ISO exponent for codes outside CurrencyCode', () => {
    expect(toCents(1000, 'jpy' as CurrencyCode)).toBe(1000);
    expect(fromCents(1000, 'jpy' as CurrencyCode)).toBe(1000);
    expect(toCents(5000, 'krw' as CurrencyCode)).toBe(5000);
    expect(toCents(5.124, 'kwd' as CurrencyCode)).toBe(5124);
    expect(fromCents(5124, 'kwd' as CurrencyCode)).toBe(5.124);
    expect(formatMoney(1000, 'jpy' as CurrencyCode, 'en-US')).toBe('\u00a51,000');
  });

  it('uses the usd default when the currency is undefined', () => {
    expect(toCents(1, undefined)).toBe(100);
    expect(fromCents(100, undefined)).toBe(1);
    expect(formatMoney(100, undefined)).toBe('$1.00');
  });

  const convert: [string, (currency: CurrencyCode) => unknown][] = [
    ['toCents', (currency) => toCents(1, currency)],
    ['fromCents', (currency) => fromCents(100, currency)],
    ['formatMoney', (currency) => formatMoney(100, currency)],
  ];
  it.each(
    convert.flatMap(([name, call]) =>
      [null, '', '   ', 42].map((currency) => [name, currency, call] as const)
    )
  )('%s throws CloverValidationError for a currency of %o', (_name, currency, call) => {
    const error: unknown = (() => {
      try {
        call(currency as unknown as CurrencyCode);
      } catch (e) {
        return e;
      }
    })();
    expect(error).toBeInstanceOf(CloverValidationError);
    expect((error as CloverValidationError).field).toBe('currency');
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
