/**
 * How many decimal places a currency's minor unit has: the power of ten
 * between the major unit and the amount the payment APIs take.
 */
export type MinorUnitExponent = 0 | 2 | 3 | 4;

/** ISO 4217 currencies with no minor unit: the amount is in whole units (500 JPY is `500`). */
const ZERO_DECIMAL: ReadonlySet<string> = new Set([
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
]);

/** ISO 4217 currencies with three decimals: the amount is in thousandths (5.124 KWD is `5124`). */
const THREE_DECIMAL: ReadonlySet<string> = new Set([
  'BHD',
  'IQD',
  'JOD',
  'KWD',
  'LYD',
  'OMR',
  'TND',
]);

/** ISO 4217 currencies with four decimals (the Chilean and Uruguayan units of account). */
const FOUR_DECIMAL: ReadonlySet<string> = new Set(['CLF', 'UYW']);

/** A currency code: three ASCII letters, any case. */
const CODE_PATTERN = /^[A-Za-z]{3}$/;

/**
 * The ISO 4217 minor-unit exponent of a currency: `0` for currencies with no
 * minor unit, such as `JPY` and `KRW`; `3` for `BHD`, `IQD`, `JOD`, `KWD`,
 * `LYD`, `OMR` and `TND`; `4` for `CLF` and `UYW`; and `2` for every other
 * code, including codes it does not know.
 *
 * Matching is case-insensitive (`'jpy'` and `'JPY'` give the same answer) and
 * covers three-letter ASCII codes only; anything else gives `2`. Provider rules
 * that differ from ISO stay in the provider package: Stripe, for example, takes
 * `ISK` and `UGX` as two-decimal values and `MGA` as zero-decimal.
 *
 * @param currency - An ISO 4217 currency code, any case.
 * @returns The number of decimal places in the currency's minor unit.
 * @throws {TypeError} When `currency` is not a non-empty string.
 *
 * @example
 * ```typescript
 * minorUnitExponent('USD'); // 2
 * minorUnitExponent('jpy'); // 0
 * minorUnitExponent('KWD'); // 3
 *
 * // 10.50 USD in minor units
 * Math.round(10.5 * 10 ** minorUnitExponent('USD')); // 1050
 * ```
 *
 * @see https://www.iso.org/iso-4217-currency-codes.html
 */
export function minorUnitExponent(currency: string): MinorUnitExponent {
  if (typeof currency !== 'string' || currency.trim() === '') {
    throw new TypeError('currency must be a non-empty string');
  }
  if (!CODE_PATTERN.test(currency)) {
    return 2;
  }
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL.has(code)) {
    return 0;
  }
  if (THREE_DECIMAL.has(code)) {
    return 3;
  }
  if (FOUR_DECIMAL.has(code)) {
    return 4;
  }
  return 2;
}
