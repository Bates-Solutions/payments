/**
 * Clover environment. Selects the sandbox or production host.
 */
export type CloverEnvironment = 'sandbox' | 'production';

/**
 * Currency codes commonly used with Clover's Ecommerce API.
 *
 * Clover currency codes are lowercase ISO 4217 (e.g. `usd`). This is a
 * representative subset.
 */
export type CurrencyCode = 'usd' | 'cad' | 'gbp' | 'eur' | 'aud';

/**
 * Which Clover host an operation targets.
 *
 * - `ecommerce` — the Stripe-shaped `/v1/...` API (charges, refunds, tokens) on
 *   `scl(-sandbox).dev.clover.com`.
 * - `platform` — the `/v3/merchants/{mId}/...` REST API (customers, orders,
 *   inventory) on `api(sandbox).dev.clover.com`.
 */
export type CloverHost = 'ecommerce' | 'platform';

/**
 * Common pagination options for platform (`/v3`) list endpoints.
 */
export interface PaginationOptions {
  /** Maximum number of records to return */
  limit?: number;
  /** Number of records to skip */
  offset?: number;
}

/**
 * A normalized paginated response.
 */
export interface PaginatedResponse<T> {
  data: T[];
}

/**
 * Options for creating a charge (a payment).
 */
export interface CreateChargeOptions {
  /** Amount in cents */
  amount: number;
  /** ISO currency code (default: `usd`) */
  currency?: CurrencyCode;
  /** Tokenized payment source (a `clv_…` token) */
  source: string;
  /**
   * Capture the charge immediately. Set `false` to authorize only (capture
   * later with `payments.capture`).
   * @default true
   */
  capture?: boolean;
  /** Description shown on the charge */
  description?: string;
  /** Email address to send the receipt to */
  receiptEmail?: string;
  /** Your own reference id (invoice/PO number) */
  externalReferenceId?: string;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}
