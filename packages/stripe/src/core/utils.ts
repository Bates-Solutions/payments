import { StripeValidationError } from './errors.js';
import type { CurrencyCode, TimeRange } from './types/index.js';

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
 * Uses the WebCrypto `randomUUID`, so it runs on any modern runtime (Node 22+,
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

/**
 * Convert a JS `Date` to Unix seconds, the time format Stripe expects. A
 * number is taken to be Unix seconds already and passed through.
 *
 * @param value - A `Date`, or whole Unix seconds
 * @param field - Field name reported on a validation error
 * @throws {StripeValidationError} When the value is an invalid `Date`, not a
 *   whole number, or looks like milliseconds (above 1e11, i.e. after the year
 *   5000)
 *
 * @example
 * ```typescript
 * toUnixTime(new Date('2026-03-01T00:00:00Z')); // 1772323200
 * ```
 */
export function toUnixTime(value: Date | number, field = 'value'): number {
  const seconds = value instanceof Date ? Math.floor(value.getTime() / 1000) : value;
  if (typeof seconds !== 'number' || !Number.isInteger(seconds)) {
    throw new StripeValidationError(`${field} must be a valid Date or whole Unix seconds`, field);
  }
  if (seconds > MAX_UNIX_SECONDS) {
    throw new StripeValidationError(
      `${field} looks like milliseconds; pass Unix seconds or a Date`,
      field
    );
  }
  return seconds;
}

/** Above this, a "seconds" value is almost certainly milliseconds (year 5138). */
const MAX_UNIX_SECONDS = 1e11;

/**
 * Convert a {@link TimeRange} to Stripe's range query param.
 *
 * @internal
 */
export function toRangeParam(
  range: TimeRange | undefined,
  field: string
): { gt?: number; gte?: number; lt?: number; lte?: number } | undefined {
  if (!range) {
    return undefined;
  }
  const convert = (value: Date | number | undefined, bound: string): number | undefined =>
    value === undefined ? undefined : toUnixTime(value, `${field}.${bound}`);
  return {
    gt: convert(range.gt, 'gt'),
    gte: convert(range.gte, 'gte'),
    lt: convert(range.lt, 'lt'),
    lte: convert(range.lte, 'lte'),
  };
}

/**
 * Fetch every page of a cursor-paginated Stripe list and return all items.
 *
 * @internal
 */
export async function listAll<T extends { id?: string }>(
  fetchPage: (startingAfter: string | undefined) => PromiseLike<{ data: T[]; has_more: boolean }>
): Promise<T[]> {
  const items: T[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const page = await fetchPage(startingAfter);
    items.push(...page.data);
    const cursor = page.data.at(-1)?.id;
    if (!page.has_more || !cursor) {
      return items;
    }
    startingAfter = cursor;
  }
}

/**
 * Resolve a Stripe reference that may be either an ID string or an expanded
 * object, to its ID.
 *
 * Stripe fields like `customer` / `subscription` / `product` are a bare ID
 * string unless expanded, in which case they are the full object. This
 * collapses both forms.
 *
 * @example
 * ```typescript
 * resolveId('cus_1');          // 'cus_1'
 * resolveId({ id: 'cus_1' });  // 'cus_1'
 * resolveId(null);             // undefined
 * ```
 */
export function resolveId(value: string | { id?: string } | null | undefined): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return value?.id;
}
