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
 * Zero-decimal currencies: the Stripe `amount` is the whole-unit amount, with
 * no multiplication (500 JPY is `500`).
 *
 * This is Stripe's documented zero-decimal list minus `ugx`, which Stripe's
 * special-cases table says must still be sent as a two-decimal value (see
 * {@link WHOLE_UNIT_TWO_DECIMAL_CURRENCIES}).
 *
 * @see https://docs.stripe.com/currencies#zero-decimal
 */
const ZERO_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set([
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
]);

/**
 * Three-decimal currencies: the Stripe `amount` is in thousandths, and Stripe
 * requires it to end in `0` (a multiple of 10), so 5.124 KWD is sent as `5120`.
 *
 * @see https://docs.stripe.com/currencies
 */
const THREE_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set(['bhd', 'jod', 'kwd', 'omr', 'tnd']);

/**
 * Currencies that are zero-decimal in practice but that Stripe still takes as
 * a two-decimal value whose decimal part is always `00`, for backward
 * compatibility: 5 ISK is sent as `500`. Fractions cannot be charged, so the
 * major amount is rounded to a whole unit first.
 *
 * Not included here: `huf` and `twd`. Stripe treats those as zero-decimal only
 * for payouts (which must be multiples of 100) and accepts ordinary
 * two-decimal amounts for charges, so they use the default two-decimal rule.
 *
 * @see https://docs.stripe.com/currencies#special-cases
 */
const WHOLE_UNIT_TWO_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set(['isk', 'ugx']);

interface CurrencyRule {
  /** Minor units per major unit */
  multiplier: number;
  /** The minor amount must be a multiple of this */
  step: number;
}

/**
 * Get the minor-unit rule for a currency. Matching is case-insensitive;
 * unknown currencies are treated as two-decimal, Stripe's default.
 */
function getCurrencyRule(currency: string): CurrencyRule {
  const code = currency.toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) {
    return { multiplier: 1, step: 1 };
  }
  if (THREE_DECIMAL_CURRENCIES.has(code)) {
    return { multiplier: 1000, step: 10 };
  }
  if (WHOLE_UNIT_TWO_DECIMAL_CURRENCIES.has(code)) {
    return { multiplier: 100, step: 100 };
  }
  return { multiplier: 100, step: 1 };
}

/**
 * Convert a major-unit amount to the smallest currency unit Stripe expects.
 *
 * Follows Stripe's currency rules (currency matching is case-insensitive):
 *
 * - Two-decimal (the default, e.g. `usd`, `eur`, `huf`, `twd`): × 100.
 * - Zero-decimal (`bif clp djf gnf jpy kmf krw mga pyg rwf vnd vuv xaf xof xpf`):
 *   × 1, rounded to a whole unit.
 * - Three-decimal (`bhd jod kwd omr tnd`): × 1000, rounded to the nearest 10
 *   because Stripe requires the last digit to be `0`.
 * - `isk` and `ugx`: rounded to a whole unit, then × 100 (Stripe takes them as
 *   two-decimal values whose decimals are always `00`).
 *
 * `huf` and `twd` payouts must be multiples of 100; this helper does not
 * enforce that, since charges in those currencies may use two decimals.
 *
 * @param amount - Major-unit amount (e.g. 10.50 dollars)
 * @param currency - Currency code, any case (default: usd)
 * @returns Amount in the smallest currency unit (e.g. 1050 for $10.50)
 *
 * @example
 * ```typescript
 * toMinor(10.50) // 1050
 * toMinor(1000, 'jpy') // 1000 (JPY has no decimal places)
 * toMinor(5000, 'KRW') // 5000 (case-insensitive)
 * toMinor(5.124, 'kwd') // 5120 (three-decimal, last digit must be 0)
 * toMinor(5, 'isk') // 500 (two-decimal value, decimals always 00)
 * ```
 *
 * @see https://docs.stripe.com/currencies
 */
export function toMinor(amount: number, currency: CurrencyCode = 'usd'): number {
  const { multiplier, step } = getCurrencyRule(currency);
  // Round to a whole number of steps (also absorbs floating point error).
  return Math.round(amount * (multiplier / step)) * step;
}

/**
 * Convert an amount in the smallest currency unit to a major-unit amount.
 *
 * Uses the same currency rules as {@link toMinor} (case-insensitive): divides
 * by 1 for zero-decimal currencies, 1000 for three-decimal currencies and 100
 * otherwise (including `isk` and `ugx`).
 *
 * @param minor - Amount in the smallest currency unit
 * @param currency - Currency code, any case (default: usd)
 * @returns Major-unit amount
 *
 * @example
 * ```typescript
 * fromMinor(1050) // 10.50
 * fromMinor(1000, 'jpy') // 1000
 * fromMinor(5120, 'kwd') // 5.12
 * fromMinor(500, 'isk') // 5
 * ```
 */
export function fromMinor(minor: number, currency: CurrencyCode = 'usd'): number {
  const { multiplier } = getCurrencyRule(currency);
  return minor / multiplier;
}

/**
 * Format money for display.
 *
 * Converts with {@link fromMinor}, then formats with `Intl.NumberFormat`, which
 * picks the display decimals for the currency (e.g. none for `jpy` and `isk`,
 * three for `kwd`).
 *
 * @param minor - Amount in the smallest currency unit
 * @param currency - Currency code, any case (default: usd)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatMoney(1050) // "$10.50"
 * formatMoney(1000, 'jpy', 'ja-JP') // "￥1,000"
 * formatMoney(5120, 'kwd') // "KWD 5.120"
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
