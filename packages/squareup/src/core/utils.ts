import { createHash } from 'node:crypto';
import { minorUnitExponent } from '@bates-solutions/payments-core/currency';
import { SquareValidationError } from './errors.js';
import type { CurrencyCode } from './types/index.js';

/**
 * Money representation
 */
export interface Money {
  amount: bigint;
  currency: CurrencyCode;
}

/**
 * Minor units per major unit for a currency, from `minorUnitExponent` in
 * payments-core: 1 for `JPY`, 100 for the other supported currencies. Matching
 * is case-insensitive, and an untyped caller's other ISO 4217 code gets its own
 * exponent (1000 for `KWD`, 1 for `KRW`).
 *
 * @throws {SquareValidationError} When `currency` is not a non-empty string
 */
function getCurrencyMultiplier(currency: CurrencyCode): number {
  if (typeof currency !== 'string' || currency.trim() === '') {
    throw new SquareValidationError('currency must be a non-empty string', 'currency');
  }
  return 10 ** minorUnitExponent(currency);
}

/**
 * Convert a dollar amount to cents (smallest currency unit)
 *
 * @param amount - Dollar amount (e.g., 10.50)
 * @param currency - Currency code (default: USD)
 * @returns Amount in smallest currency unit (e.g., 1050 for $10.50 USD)
 *
 * @example
 * ```typescript
 * toCents(10.50) // 1050
 * toCents(10.50, 'USD') // 1050
 * toCents(1000, 'JPY') // 1000 (JPY has no decimal places)
 * ```
 */
export function toCents(amount: number, currency: CurrencyCode = 'USD'): bigint {
  const multiplier = getCurrencyMultiplier(currency);
  // Use Math.round to handle floating point precision issues
  return BigInt(Math.round(amount * multiplier));
}

/**
 * Convert cents (smallest currency unit) to dollar amount
 *
 * @param cents - Amount in smallest currency unit
 * @param currency - Currency code (default: USD)
 * @returns Dollar amount
 *
 * @example
 * ```typescript
 * fromCents(1050n) // 10.50
 * fromCents(1050n, 'USD') // 10.50
 * fromCents(1000n, 'JPY') // 1000
 * ```
 */
export function fromCents(cents: bigint | number, currency: CurrencyCode = 'USD'): number {
  const multiplier = getCurrencyMultiplier(currency);
  const value = typeof cents === 'bigint' ? Number(cents) : cents;
  return value / multiplier;
}

/**
 * Format money for display
 *
 * @param cents - Amount in smallest currency unit
 * @param currency - Currency code (default: USD)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatMoney(1050n) // "$10.50"
 * formatMoney(1050n, 'USD', 'en-US') // "$10.50"
 * formatMoney(1000n, 'JPY', 'ja-JP') // "¥1,000"
 * ```
 */
export function formatMoney(
  cents: bigint | number,
  currency: CurrencyCode = 'USD',
  locale: string = 'en-US'
): string {
  const amount = fromCents(cents, currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export { createIdempotencyKey } from '@bates-solutions/payments-core/crypto';

/** Shortest idempotency-key limit among the endpoints keys are derived for. */
const MAX_DERIVED_KEY_LENGTH = 128;

/**
 * Derive a stable key for one step of a multi-call method from the caller's
 * key, so a retry with the same key is deduplicated at every step. Falls back
 * to a SHA-256 hex digest (64 chars) when the suffixed key would be too long.
 *
 * @internal
 */
export function deriveIdempotencyKey(key: string, step: string): string {
  const derived = `${key}:${step}`;
  return derived.length <= MAX_DERIVED_KEY_LENGTH
    ? derived
    : createHash('sha256').update(derived).digest('hex');
}

/**
 * Convert Money object to Square API format
 */
export function toSquareMoney(
  amount: number | bigint,
  currency: CurrencyCode = 'USD'
): { amount: bigint; currency: string } {
  const cents = typeof amount === 'bigint' ? amount : toCents(amount, currency);
  return {
    amount: cents,
    currency,
  };
}
