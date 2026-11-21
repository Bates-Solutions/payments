/**
 * How many decimal places a currency's minor unit has: the power of ten
 * between the major unit and the amount the payment APIs take.
 */
export type MinorUnitExponent = 0 | 2 | 3;

/**
 * Zero-decimal currencies: the amount is in whole units (500 JPY is `500`).
 *
 * The set from the Stripe money helpers, plus `ISK` and `UGX`, which ISO 4217
 * also gives no minor unit. `MGA` is here as in Stripe's list, although ISO
 * 4217 gives it an exponent of 2: its subunit is not used in practice.
 */
const ZERO_DECIMAL: ReadonlySet<string> = new Set([
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'ISK',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF',
]);

/** Three-decimal currencies: the amount is in thousandths (5.124 KWD is `5124`). */
const THREE_DECIMAL: ReadonlySet<string> = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND']);

/**
 * The minor-unit exponent of a currency: `0` for zero-decimal currencies such
 * as `JPY` and `KRW`, `3` for `BHD`, `JOD`, `KWD`, `OMR` and `TND`, and `2`
 * for every other code, including codes it does not know.
 *
 * Matching is case-insensitive, so `'jpy'` and `'JPY'` give the same answer.
 * Provider rules on top of this stay in the provider package: Stripe, for
 * example, takes `ISK` and `UGX` as two-decimal values.
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
 */
export function minorUnitExponent(currency: string): MinorUnitExponent {
  if (typeof currency !== 'string' || currency.trim() === '') {
    throw new TypeError('currency must be a non-empty string');
  }
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL.has(code)) {
    return 0;
  }
  if (THREE_DECIMAL.has(code)) {
    return 3;
  }
  return 2;
}
