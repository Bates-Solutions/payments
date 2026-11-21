import { describe, expect, it } from 'vitest';
import { minorUnitExponent } from '../minor-units';

describe('minorUnitExponent', () => {
  it.each([
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'ISK',
    'JPY',
    'KMF',
    'KRW',
    'PYG',
    'RWF',
    'UGX',
    'UYI',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
  ])('gives 0 for the zero-decimal %s', (code) => {
    expect(minorUnitExponent(code)).toBe(0);
  });

  it.each(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'])(
    'gives 3 for the three-decimal %s',
    (code) => {
      expect(minorUnitExponent(code)).toBe(3);
    }
  );

  it.each(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'HUF', 'TWD', 'MGA', 'MRU'])(
    'gives 2 for %s',
    (code) => {
      expect(minorUnitExponent(code)).toBe(2);
    }
  );

  it.each(['CLF', 'UYW'])('gives 4 for the four-decimal %s', (code) => {
    expect(minorUnitExponent(code)).toBe(4);
  });

  it.each(['Krw', 'ısk', 'JPY ', 'JP', 'JPYY'])(
    'gives 2 for %j, which is not three ASCII letters',
    (code) => {
      expect(minorUnitExponent(code)).toBe(2);
    }
  );

  it('gives 2 for a code it does not know', () => {
    expect(minorUnitExponent('XYZ')).toBe(2);
  });

  it('matches any case', () => {
    expect(minorUnitExponent('jpy')).toBe(0);
    expect(minorUnitExponent('Kwd')).toBe(3);
    expect(minorUnitExponent('usd')).toBe(2);
  });

  it.each([undefined, null, 42, '', '   '])('throws a TypeError for %o', (value) => {
    expect(() => minorUnitExponent(value as unknown as string)).toThrow(TypeError);
  });
});
