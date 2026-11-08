import type { CloverHttp } from '../http.js';
import { parseCloverError, CloverValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Clover Ecommerce refund.
 */
export interface Refund {
  id?: string;
  /** The charge this refund is against */
  charge?: string;
  amount?: number;
  currency?: string;
  status?: string;
  reason?: string;
  created?: number;
}

/**
 * Options for creating a refund.
 */
export interface CreateRefundOptions {
  /** The charge to refund */
  chargeId: string;
  /** Amount in cents. Omit for a full refund. */
  amount?: number;
  /** Reason for the refund */
  reason?: string;
  idempotencyKey?: string;
}

/**
 * Refunds service wrapping Clover's Ecommerce
 * [refunds](https://docs.clover.com/dev/docs/ecommerce-refunding-payments) (`/v1/refunds`).
 *
 * @remarks
 * `/v1/refunds` refunds charges created with `/v1/charges`. Partial refunds are
 * not supported for charges that include taxes/tips or more than one line item.
 *
 * @example
 * ```typescript
 * const refund = await clover.refunds.create({ chargeId: 'CHG_123' });
 * ```
 */
export class RefundsService {
  constructor(private readonly http: CloverHttp) {}

  /**
   * Create a refund for a charge.
   *
   * @throws {CloverValidationError} When `chargeId` is missing or `amount` is non-positive
   */
  async create(options: CreateRefundOptions): Promise<Refund> {
    if (!options.chargeId) {
      throw new CloverValidationError('chargeId is required', 'chargeId');
    }
    if (options.amount !== undefined && options.amount <= 0) {
      throw new CloverValidationError('amount must be greater than 0', 'amount');
    }

    try {
      return await this.http.request<Refund>('ecommerce', 'POST', '/v1/refunds', {
        body: {
          charge: options.chargeId,
          amount: options.amount,
          reason: options.reason,
        },
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Retrieve a refund by ID.
   */
  async get(refundId: string): Promise<Refund> {
    try {
      return await this.http.request<Refund>(
        'ecommerce',
        'GET',
        `/v1/refunds/${encodeURIComponent(refundId)}`
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }
}
