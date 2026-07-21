import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe Refund
 */
export type Refund = Stripe.Refund;

/**
 * Reason for a refund
 */
export type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer';

/**
 * Options for creating a refund.
 *
 * Provide either `paymentIntentId` or `chargeId`.
 */
export interface CreateRefundOptions {
  /** PaymentIntent to refund */
  paymentIntentId?: string;
  /** Charge to refund */
  chargeId?: string;
  /**
   * Amount to refund in the smallest currency unit. Omit for a full refund.
   */
  amount?: number;
  /** Reason for the refund */
  reason?: RefundReason;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}

/**
 * Options for listing refunds
 */
export interface ListRefundsOptions {
  limit?: number;
  /** Only return refunds for this PaymentIntent */
  paymentIntentId?: string;
  /** Only return refunds for this charge */
  chargeId?: string;
  /** Cursor: return records after this refund ID */
  startingAfter?: string;
}

/**
 * Refunds service wrapping Stripe Refunds.
 *
 * @example
 * ```typescript
 * const refund = await stripe.refunds.create({
 *   paymentIntentId: 'pi_123',
 * });
 * ```
 */
export class RefundsService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a refund.
   *
   * @param options - Refund creation options
   * @returns The created refund
   *
   * @throws {StripeValidationError} When neither a payment nor charge is given
   *
   * @example
   * ```typescript
   * // Full refund of a payment
   * const refund = await stripe.refunds.create({ paymentIntentId: 'pi_123' });
   *
   * // Partial refund
   * const partial = await stripe.refunds.create({
   *   paymentIntentId: 'pi_123',
   *   amount: 500,
   *   reason: 'requested_by_customer',
   * });
   * ```
   */
  async create(options: CreateRefundOptions): Promise<Refund> {
    if (!options.paymentIntentId && !options.chargeId) {
      throw new StripeValidationError(
        'Either paymentIntentId or chargeId is required'
      );
    }
    if (options.amount !== undefined && options.amount <= 0) {
      throw new StripeValidationError('amount must be greater than 0', 'amount');
    }

    try {
      return await this.client.refunds.create(
        {
          payment_intent: options.paymentIntentId,
          charge: options.chargeId,
          amount: options.amount,
          reason: options.reason,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a refund by ID.
   *
   * @param refundId - Refund ID
   * @returns The refund
   *
   * @example
   * ```typescript
   * const refund = await stripe.refunds.get('re_123');
   * ```
   */
  async get(refundId: string): Promise<Refund> {
    try {
      return await this.client.refunds.retrieve(refundId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List refunds with cursor-based pagination.
   *
   * @param options - List options
   * @returns Refunds and a cursor for the next page
   *
   * @example
   * ```typescript
   * const { data } = await stripe.refunds.list({ paymentIntentId: 'pi_123' });
   * ```
   */
  async list(options?: ListRefundsOptions): Promise<PaginatedResponse<Refund>> {
    try {
      const page = await this.client.refunds.list({
        limit: options?.limit,
        payment_intent: options?.paymentIntentId,
        charge: options?.chargeId,
        starting_after: options?.startingAfter,
      });

      return {
        data: page.data,
        hasMore: page.has_more,
        nextCursor: page.data.at(-1)?.id,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
