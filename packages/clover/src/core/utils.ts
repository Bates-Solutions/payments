import { minorUnitExponent } from '@bates-solutions/payments-core/currency';
import { CloverValidationError } from './errors.js';
import type { CurrencyCode } from './types/index.js';

/**
 * Money representation
 */
export interface Money {
  /** Amount in cents */
  amount: number;
  currency: CurrencyCode;
}

/**
 * Minor units per major unit for a currency, from `minorUnitExponent` in
 * payments-core: 100 for every `CurrencyCode`. Matching is case-insensitive,
 * and an untyped caller's other ISO 4217 code gets its own exponent (1 for
 * `jpy`, 1000 for `kwd`).
 *
 * @throws {CloverValidationError} When `currency` is not a string, or is empty or only whitespace
 */
function getCurrencyMultiplier(currency: CurrencyCode): number {
  if (typeof currency !== 'string' || currency.trim() === '') {
    throw new CloverValidationError('currency must be a non-empty string', 'currency');
  }
  return 10 ** minorUnitExponent(currency);
}

/**
 * Convert a major-unit amount to cents (the currency's smallest unit).
 *
 * The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
 * in payments-core, matched in any case. Every `CurrencyCode` has two
 * decimals; a code outside it gets its own exponent (1 for `jpy`, 1000 for
 * `kwd`).
 *
 * @param amount - Major-unit amount (e.g. 10.50 dollars)
 * @param currency - Currency code (default: usd)
 * @returns Amount in the smallest unit (e.g. 1050)
 * @throws {CloverValidationError} When `currency` is not a string, or is empty or only whitespace
 *
 * @example
 * ```typescript
 * toCents(10.50); // 1050
 * toCents(10.50, 'cad'); // 1050
 * ```
 */
export function toCents(amount: number, currency: CurrencyCode = 'usd'): number {
  const multiplier = getCurrencyMultiplier(currency);
  // Use Math.round to avoid floating point drift (e.g. 19.99 * 100).
  return Math.round(amount * multiplier);
}

/**
 * Convert cents (the currency's smallest unit) to a major-unit amount.
 *
 * The currency's minor unit comes from ISO 4217 through `minorUnitExponent`
 * in payments-core, matched in any case. Every `CurrencyCode` has two
 * decimals; a code outside it gets its own exponent (1 for `jpy`, 1000 for
 * `kwd`).
 *
 * @param cents - Amount in the smallest unit
 * @param currency - Currency code (default: usd)
 * @returns Major-unit amount
 * @throws {CloverValidationError} When `currency` is not a string, or is empty or only whitespace
 *
 * @example
 * ```typescript
 * fromCents(1050); // 10.50
 * fromCents(1050, 'gbp'); // 10.50
 * ```
 */
export function fromCents(cents: number, currency: CurrencyCode = 'usd'): number {
  return cents / getCurrencyMultiplier(currency);
}

/**
 * Format money for display.
 *
 * @param cents - Amount in the currency's smallest unit
 * @param currency - Currency code (default: usd)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 * @throws {CloverValidationError} When `currency` is not a string, or is empty or only whitespace
 *
 * @example
 * ```typescript
 * formatMoney(1050); // "$10.50"
 * ```
 */
export function formatMoney(
  cents: number,
  currency: CurrencyCode = 'usd',
  locale: string = 'en-US'
): string {
  const amount = fromCents(cents, currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    // Intl expects an uppercase ISO code; Clover codes are lowercase.
    currency: currency.toUpperCase(),
  }).format(amount);
}

export { createIdempotencyKey } from '@bates-solutions/payments-core/crypto';
