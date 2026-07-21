import type Stripe from 'stripe';
import type { CreatePaymentOptions, CurrencyCode, PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe PaymentIntent
 */
export type Payment = Stripe.PaymentIntent;

/**
 * Options for listing payments
 */
export interface ListPaymentsOptions {
  limit?: number;
  /** Only return payments for this customer */
  customerId?: string;
  /** Cursor: return records after this PaymentIntent ID */
  startingAfter?: string;
}

/**
 * Payments service wrapping Stripe PaymentIntents.
 *
 * @example
 * ```typescript
 * const payment = await stripe.payments.create({
 *   amount: 1000, // $10.00 in cents
 *   currency: 'usd',
 *   paymentMethod: 'pm_card_visa',
 *   confirm: true,
 * });
 * ```
 */
export class PaymentsService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a payment (PaymentIntent).
   *
   * @param options - Payment creation options
   * @returns Created PaymentIntent
   *
   * @throws {StripeValidationError} When input validation fails
   * @throws {StripePaymentError} When the card is declined
   *
   * @example
   * ```typescript
   * const payment = await stripe.payments.create({
   *   amount: 1000,
   *   currency: 'usd',
   *   customerId: 'cus_123',
   *   paymentMethod: 'pm_card_visa',
   *   confirm: true,
   * });
   * ```
   */
  async create(options: CreatePaymentOptions): Promise<Payment> {
    if (options.amount <= 0) {
      throw new StripeValidationError('amount must be greater than 0', 'amount');
    }

    const currency: CurrencyCode = options.currency ?? 'usd';

    try {
      return await this.client.paymentIntents.create(
        {
          amount: options.amount,
          currency,
          customer: options.customerId,
          payment_method: options.paymentMethod,
          confirm: options.confirm ?? false,
          description: options.description,
          receipt_email: options.receiptEmail,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a payment by ID.
   *
   * @param paymentId - PaymentIntent ID
   * @returns The PaymentIntent
   *
   * @example
   * ```typescript
   * const payment = await stripe.payments.get('pi_123');
   * ```
   */
  async get(paymentId: string): Promise<Payment> {
    try {
      return await this.client.paymentIntents.retrieve(paymentId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Capture a payment that was authorized with `capture_method: manual`.
   *
   * @param paymentId - PaymentIntent ID to capture
   * @returns The captured PaymentIntent
   *
   * @example
   * ```typescript
   * const payment = await stripe.payments.capture('pi_123');
   * ```
   */
  async capture(paymentId: string): Promise<Payment> {
    try {
      return await this.client.paymentIntents.capture(paymentId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Cancel a payment.
   *
   * @param paymentId - PaymentIntent ID to cancel
   * @returns The cancelled PaymentIntent
   *
   * @example
   * ```typescript
   * const payment = await stripe.payments.cancel('pi_123');
   * ```
   */
  async cancel(paymentId: string): Promise<Payment> {
    try {
      return await this.client.paymentIntents.cancel(paymentId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List payments with cursor-based pagination.
   *
   * @param options - List options
   * @returns Payments and a cursor for the next page
   *
   * @example
   * ```typescript
   * const page1 = await stripe.payments.list({ limit: 20 });
   * const page2 = await stripe.payments.list({ startingAfter: page1.nextCursor });
   * ```
   */
  async list(options?: ListPaymentsOptions): Promise<PaginatedResponse<Payment>> {
    try {
      const page = await this.client.paymentIntents.list({
        limit: options?.limit,
        customer: options?.customerId,
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
