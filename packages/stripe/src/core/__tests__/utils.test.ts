import { describe, it, expect } from 'vitest';
import { toMinor, fromMinor, formatMoney, createIdempotencyKey, fromUnixTime } from '../utils.js';
import { StripeValidationError } from '../errors.js';

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

// Stripe's currency rules: https://docs.stripe.com/currencies
const ZERO_DECIMAL = [
  'bif',
  'clp',
  'djf',
  'gnf',
  'jpy',
  'kmf',
  'krw',
  'mga',
  'pyg',
  'rwf',
  'vnd',
  'vuv',
  'xaf',
  'xof',
  'xpf',
];
const THREE_DECIMAL = ['bhd', 'jod', 'kwd', 'omr', 'tnd'];
const WHOLE_UNIT_TWO_DECIMAL = ['isk', 'ugx'];
const TWO_DECIMAL = ['usd', 'eur', 'gbp', 'cad', 'aud', 'huf', 'twd'];

describe('zero-decimal currencies', () => {
  describe.each(ZERO_DECIMAL)('%s', (currency) => {
    it('toMinor does not multiply', () => {
      expect(toMinor(500, currency)).toBe(500);
    });

    it('toMinor rounds to a whole unit', () => {
      expect(toMinor(500.4, currency)).toBe(500);
      expect(toMinor(500.6, currency)).toBe(501);
    });

    it('fromMinor does not divide', () => {
      expect(fromMinor(500, currency)).toBe(500);
    });

    it('rounds half away from zero, so negatives mirror positives', () => {
      expect(toMinor(500.5, currency)).toBe(501);
      expect(toMinor(-500.5, currency)).toBe(-501);
      expect(toMinor(-500.4, currency)).toBe(-500);
      expect(toMinor(-0.4, currency)).toBe(0);
    });

    it('matches the uppercase code', () => {
      expect(toMinor(500, currency.toUpperCase())).toBe(500);
      expect(fromMinor(500, currency.toUpperCase())).toBe(500);
    });
  });
});

describe('three-decimal currencies', () => {
  describe.each(THREE_DECIMAL)('%s', (currency) => {
    it('toMinor multiplies by 1000', () => {
      expect(toMinor(5.12, currency)).toBe(5120);
    });

    it('toMinor rounds to the nearest 10', () => {
      expect(toMinor(5.124, currency)).toBe(5120);
      expect(toMinor(5.126, currency)).toBe(5130);
    });

    it('fromMinor divides by 1000', () => {
      expect(fromMinor(5120, currency)).toBe(5.12);
      expect(fromMinor(5125, currency)).toBe(5.125);
    });

    it('rounds half away from zero, so negatives mirror positives', () => {
      expect(toMinor(5.125, currency)).toBe(5130);
      expect(toMinor(-5.125, currency)).toBe(-5130);
      expect(toMinor(-5.124, currency)).toBe(-5120);
      expect(toMinor(-0.004, currency)).toBe(0);
    });

    it('matches the uppercase code', () => {
      expect(toMinor(5.12, currency.toUpperCase())).toBe(5120);
      expect(fromMinor(5120, currency.toUpperCase())).toBe(5.12);
    });
  });
});

describe('isk and ugx (two-decimal value, decimals always 00)', () => {
  describe.each(WHOLE_UNIT_TWO_DECIMAL)('%s', (currency) => {
    it('toMinor multiplies whole units by 100', () => {
      expect(toMinor(5, currency)).toBe(500);
    });

    it('toMinor rounds to a whole unit first', () => {
      expect(toMinor(5.4, currency)).toBe(500);
      expect(toMinor(5.6, currency)).toBe(600);
    });

    it('fromMinor divides by 100', () => {
      expect(fromMinor(500, currency)).toBe(5);
      expect(fromMinor(550, currency)).toBe(5.5);
    });

    it('rounds half away from zero, so negatives mirror positives', () => {
      expect(toMinor(5.5, currency)).toBe(600);
      expect(toMinor(-5.5, currency)).toBe(-600);
      expect(toMinor(-5.4, currency)).toBe(-500);
      expect(toMinor(-0.4, currency)).toBe(0);
    });

    it('matches the uppercase code', () => {
      expect(toMinor(5.4, currency.toUpperCase())).toBe(500);
      expect(fromMinor(500, currency.toUpperCase())).toBe(5);
    });
  });
});

describe('two-decimal currencies', () => {
  describe.each(TWO_DECIMAL)('%s', (currency) => {
    it('toMinor multiplies by 100 and keeps cents', () => {
      expect(toMinor(10.45, currency)).toBe(1045);
    });

    it('fromMinor divides by 100', () => {
      expect(fromMinor(1045, currency)).toBe(10.45);
    });

    it('rounds half away from zero, so negatives mirror positives', () => {
      expect(toMinor(10.125, currency)).toBe(1013);
      expect(toMinor(-10.125, currency)).toBe(-1013);
      expect(toMinor(-10.45, currency)).toBe(-1045);
      expect(toMinor(-0.004, currency)).toBe(0);
    });

    it('matches the uppercase code', () => {
      expect(toMinor(10.45, currency.toUpperCase())).toBe(1045);
      expect(fromMinor(1045, currency.toUpperCase())).toBe(10.45);
    });
  });

  it('treats an unknown code as two-decimal', () => {
    expect(toMinor(10.45, 'zzz')).toBe(1045);
    expect(fromMinor(1045, 'zzz')).toBe(10.45);
  });
});

describe('formatMoney currency decimals', () => {
  it('formats a three-decimal currency with three decimals', () => {
    expect(formatMoney(5120, 'kwd')).toContain('5.120');
  });

  it('formats isk from a two-decimal amount as whole units', () => {
    expect(formatMoney(500, 'isk')).toMatch(/(^|\D)5$/);
  });

  it('formats a zero-decimal currency given in uppercase', () => {
    expect(formatMoney(5000, 'KRW')).toContain('5,000');
  });
});

describe('money helper validation', () => {
  const expectValidationError = (fn: () => unknown, field: string, message: RegExp) => {
    let caught: unknown;
    try {
      fn();
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(StripeValidationError);
    expect((caught as StripeValidationError).field).toBe(field);
    expect((caught as StripeValidationError).message).toMatch(message);
  };

  it('returns 0, not -0, for a negative amount that rounds to zero', () => {
    expect(Object.is(toMinor(-0.004), 0)).toBe(true);
    expect(Object.is(toMinor(-0.4, 'isk'), 0)).toBe(true);
    expect(Object.is(toMinor(-0), 0)).toBe(true);
  });

  it('uses the default currency when currency is undefined', () => {
    expect(toMinor(5, undefined)).toBe(500);
  });

  it.each([null, 5, {}])('rejects a non-string currency (%j)', (currency) => {
    const bad = currency as unknown as string;
    expectValidationError(() => toMinor(5, bad), 'currency', /non-empty string/);
    expectValidationError(() => fromMinor(500, bad), 'currency', /non-empty string/);
    expectValidationError(() => formatMoney(500, bad), 'currency', /non-empty string/);
  });

  it.each(['', '   '])('rejects an empty currency (%j)', (currency) => {
    expectValidationError(() => toMinor(5, currency), 'currency', /non-empty string/);
    expectValidationError(() => fromMinor(500, currency), 'currency', /non-empty string/);
  });

  it.each([NaN, Infinity, -Infinity])('rejects a non-finite amount (%s)', (amount) => {
    expectValidationError(() => toMinor(amount), 'amount', /finite number/);
    expectValidationError(() => toMinor(amount, 'isk'), 'amount', /finite number/);
  });

  it('rejects an amount whose minor value is beyond MAX_SAFE_INTEGER', () => {
    expectValidationError(() => toMinor(1e17, 'isk'), 'amount', /too large/);
    expectValidationError(() => toMinor(-1e17, 'isk'), 'amount', /too large/);
    expectValidationError(() => toMinor(2 ** 53, 'jpy'), 'amount', /too large/);
  });

  it('accepts MAX_SAFE_INTEGER minor units exactly', () => {
    expect(toMinor(Number.MAX_SAFE_INTEGER, 'jpy')).toBe(Number.MAX_SAFE_INTEGER);
    expect(toMinor(-Number.MAX_SAFE_INTEGER, 'jpy')).toBe(-Number.MAX_SAFE_INTEGER);
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

describe('fromUnixTime', () => {
  it('converts Unix seconds to a Date', () => {
    expect(fromUnixTime(1700000000)?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });

  it('returns undefined for null/undefined', () => {
    expect(fromUnixTime(null)).toBeUndefined();
    expect(fromUnixTime(undefined)).toBeUndefined();
  });
});
