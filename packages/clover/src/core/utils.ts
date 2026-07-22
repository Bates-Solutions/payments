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
 * Convert a major-unit amount to cents.
 *
 * @param amount - Major-unit amount (e.g. 10.50 dollars)
 * @returns Amount in cents (e.g. 1050)
 *
 * @example
 * ```typescript
 * toCents(10.50); // 1050
 * ```
 */
export function toCents(amount: number): number {
  // Use Math.round to avoid floating point drift (e.g. 19.99 * 100).
  return Math.round(amount * 100);
}

/**
 * Convert cents to a major-unit amount.
 *
 * @param cents - Amount in cents
 * @returns Major-unit amount
 *
 * @example
 * ```typescript
 * fromCents(1050); // 10.50
 * ```
 */
export function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Format money for display.
 *
 * @param cents - Amount in cents
 * @param currency - Currency code (default: usd)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
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
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    // Intl expects an uppercase ISO code; Clover codes are lowercase.
    currency: currency.toUpperCase(),
  }).format(fromCents(cents));
}

/**
 * Create a unique idempotency key for Clover requests.
 *
 * Uses WebCrypto `randomUUID`, so it runs on any modern runtime (Node 22+,
 * Deno, Bun, Cloudflare Workers).
 *
 * @returns UUID string
 */
export function createIdempotencyKey(): string {
  return globalThis.crypto.randomUUID();
}
