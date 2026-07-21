import type { CurrencyCode } from './types/index.js';

/**
 * Money representation
 */
export interface Money {
  /** Amount in the smallest currency unit (e.g. cents) */
  amount: number;
  currency: CurrencyCode;
}

/**
 * Zero-decimal currencies that don't use fractional units
 *
 * @see https://docs.stripe.com/currencies#zero-decimal
 */
const ZERO_DECIMAL_CURRENCIES: CurrencyCode[] = ['jpy'];

/**
 * Get the multiplier for a currency
 */
function getCurrencyMultiplier(currency: CurrencyCode): number {
  return ZERO_DECIMAL_CURRENCIES.includes(currency) ? 1 : 100;
}

/**
 * Convert a major-unit amount to the smallest currency unit Stripe expects.
 *
 * @param amount - Major-unit amount (e.g. 10.50 dollars)
 * @param currency - Currency code (default: usd)
 * @returns Amount in the smallest currency unit (e.g. 1050 for $10.50)
 *
 * @example
 * ```typescript
 * toMinor(10.50) // 1050
 * toMinor(1000, 'jpy') // 1000 (JPY has no decimal places)
 * ```
 */
export function toMinor(amount: number, currency: CurrencyCode = 'usd'): number {
  const multiplier = getCurrencyMultiplier(currency);
  // Use Math.round to handle floating point precision issues
  return Math.round(amount * multiplier);
}

/**
 * Convert an amount in the smallest currency unit to a major-unit amount.
 *
 * @param minor - Amount in the smallest currency unit
 * @param currency - Currency code (default: usd)
 * @returns Major-unit amount
 *
 * @example
 * ```typescript
 * fromMinor(1050) // 10.50
 * fromMinor(1000, 'jpy') // 1000
 * ```
 */
export function fromMinor(minor: number, currency: CurrencyCode = 'usd'): number {
  const multiplier = getCurrencyMultiplier(currency);
  return minor / multiplier;
}

/**
 * Format money for display.
 *
 * @param minor - Amount in the smallest currency unit
 * @param currency - Currency code (default: usd)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatMoney(1050) // "$10.50"
 * formatMoney(1000, 'jpy', 'ja-JP') // "￥1,000"
 * ```
 */
export function formatMoney(
  minor: number,
  currency: CurrencyCode = 'usd',
  locale: string = 'en-US'
): string {
  const amount = fromMinor(minor, currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    // Intl expects an uppercase ISO code; Stripe codes are lowercase.
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Create a unique idempotency key for Stripe API requests.
 *
 * Uses the WebCrypto `randomUUID`, so it runs on any modern runtime (Node 20+,
 * Deno, Bun, Cloudflare Workers) — not just Node.
 *
 * @returns UUID string
 *
 * @example
 * ```typescript
 * const key = createIdempotencyKey();
 * // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function createIdempotencyKey(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * Convert a Unix timestamp (seconds) to a JS `Date`.
 *
 * Stripe expresses times as Unix epoch **seconds**; this saves consumers from
 * the repetitive `new Date(value * 1000)`.
 *
 * @param seconds - Unix time in seconds (e.g. `subscription.current_period_end`)
 * @returns A `Date`, or `undefined` if the input is null/undefined
 *
 * @example
 * ```typescript
 * fromUnixTime(1700000000); // Date
 * fromUnixTime(null);       // undefined
 * ```
 */
export function fromUnixTime(seconds: number | null | undefined): Date | undefined {
  if (seconds === null || seconds === undefined) {
    return undefined;
  }
  return new Date(seconds * 1000);
}
