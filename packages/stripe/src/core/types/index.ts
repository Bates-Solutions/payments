/**
 * Stripe environment, derived from the API key prefix.
 *
 * Stripe has no separate sandbox host — a `sk_test_…` key operates in test
 * mode and a `sk_live_…` key operates in live mode.
 */
export type StripeEnvironment = 'test' | 'live';

/**
 * Currency codes commonly used with Stripe.
 *
 * Stripe currency codes are lowercase ISO 4217 (e.g. `usd`). This is a
 * representative subset; Stripe supports many more.
 */
export type CurrencyCode = 'usd' | 'cad' | 'gbp' | 'eur' | 'aud' | 'jpy';

/**
 * Common cursor pagination options
 */
export interface PaginationOptions {
  /** Maximum number of records to return */
  limit?: number;
  /** Cursor: return records after this object ID (`starting_after`) */
  startingAfter?: string;
}

/**
 * Common paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  /** Whether more records are available */
  hasMore: boolean;
  /** Cursor to pass as `startingAfter` for the next page */
  nextCursor?: string;
}

/**
 * Simple money representation for API inputs
 */
export interface MoneyInput {
  /** Amount in the smallest currency unit (e.g. cents) */
  amount: number;
  currency?: CurrencyCode;
}

/**
 * Options for creating a payment (PaymentIntent)
 */
export interface CreatePaymentOptions {
  /** Amount in the smallest currency unit (e.g. cents) */
  amount: number;
  /** ISO currency code (default: `usd`) */
  currency?: CurrencyCode;
  /** Customer to attach the payment to */
  customerId?: string;
  /** Payment method to charge (e.g. `pm_…`) */
  paymentMethod?: string;
  /**
   * Confirm the PaymentIntent immediately after creation.
   * @default false
   */
  confirm?: boolean;
  /** Arbitrary description shown in the Stripe dashboard */
  description?: string;
  /** Email address to send the receipt to */
  receiptEmail?: string;
  /** Key/value metadata attached to the PaymentIntent */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}
