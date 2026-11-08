import { describe, it, expect } from 'vitest';
import { toMinor, fromMinor, formatMoney, createIdempotencyKey, fromUnixTime } from '../utils.js';

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
