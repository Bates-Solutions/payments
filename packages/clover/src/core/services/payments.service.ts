import type { CloverHttp } from '../http.js';
import type { CreateChargeOptions, CurrencyCode } from '../types/index.js';
import { parseCloverError, CloverValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Clover Ecommerce charge (a payment).
 */
export interface Charge {
  id?: string;
  amount?: number;
  currency?: string;
  /** Charge status (e.g. `paid`, `succeeded`) */
  status?: string;
  paid?: boolean;
  captured?: boolean;
  source?: {
    id?: string;
    brand?: string;
    last4?: string;
  };
  created?: number;
  description?: string;
}

/**
 * Options for capturing a previously authorized charge.
 */
export interface CaptureChargeOptions {
  /** Amount in cents to capture (defaults to the full authorized amount) */
  amount?: number;
  idempotencyKey?: string;
}

/**
 * Payments service wrapping Clover's Ecommerce
 * [charges](https://docs.clover.com/dev/docs/create-a-charge) (`/v1/charges`).
 * Amounts are in cents; the `source` is a Clover card token (`clv_…`).
 *
 * @example
 * ```typescript
 * const charge = await clover.payments.create({
 *   amount: 1000, // $10.00
 *   currency: 'usd',
 *   source: 'clv_1TSTStok...',
 * });
 * ```
 */
export class PaymentsService {
  constructor(private readonly http: CloverHttp) {}

  /**
   * Create a charge.
   *
   * @throws {CloverValidationError} When input validation fails
   * @throws {CloverPaymentError} When the card is declined
   */
  async create(options: CreateChargeOptions): Promise<Charge> {
    if (!options.source) {
      throw new CloverValidationError('source is required', 'source');
    }
    if (options.amount <= 0) {
      throw new CloverValidationError('amount must be greater than 0', 'amount');
    }

    const currency: CurrencyCode = options.currency ?? 'usd';

    try {
      return await this.http.request<Charge>('ecommerce', 'POST', '/v1/charges', {
        body: {
          amount: options.amount,
          currency,
          source: options.source,
          capture: options.capture ?? true,
          description: options.description,
          receipt_email: options.receiptEmail,
          external_reference_id: options.externalReferenceId,
        },
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Retrieve a charge by ID.
   */
  async get(chargeId: string): Promise<Charge> {
    try {
      return await this.http.request<Charge>(
        'ecommerce',
        'GET',
        `/v1/charges/${encodeURIComponent(chargeId)}`
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Capture a charge that was created with `capture: false`.
   */
  async capture(chargeId: string, options?: CaptureChargeOptions): Promise<Charge> {
    try {
      return await this.http.request<Charge>(
        'ecommerce',
        'POST',
        `/v1/charges/${encodeURIComponent(chargeId)}/capture`,
        {
          body: options?.amount !== undefined ? { amount: options.amount } : {},
          idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey(),
        }
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }
}
