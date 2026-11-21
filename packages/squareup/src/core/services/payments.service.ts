import type { SquareClient } from 'square';
import type { CreatePaymentOptions, CurrencyCode } from '../types/index.js';
import {
  assertNoResponseErrors,
  parseSquareError,
  requireNonEmpty,
  SquareValidationError,
} from '../errors.js';

/**
 * Payment object type from Square API
 */
export interface Payment {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  amountMoney?: {
    amount?: bigint;
    currency?: string;
  };
  status?: string;
  sourceType?: string;
  orderId?: string;
  customerId?: string;
  locationId?: string;
  referenceId?: string;
  note?: string;
}

/**
 * Simplified payments service
 *
 * @example
 * ```typescript
 * const payment = await square.payments.create({
 *   sourceId: 'cnon:card-nonce-ok',
 *   amount: 1000, // $10.00 in cents
 *   idempotencyKey: 'order-1042', // one key per order, so a retry can't charge twice
 * });
 * ```
 */
export class PaymentsService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string,
    private readonly defaultCurrency: CurrencyCode = 'USD'
  ) {}

  /**
   * Create a payment
   *
   * @param options - Payment creation options
   * @returns Created payment
   *
   * @throws {SquarePaymentError} When payment processing fails
   * @throws {SquareValidationError} When input validation fails, including a missing `idempotencyKey`
   *
   * @example
   * ```typescript
   * // Simple payment
   * const payment = await square.payments.create({
   *   sourceId: 'cnon:card-nonce-ok',
   *   amount: 1000, // $10.00 in cents
   *   idempotencyKey: 'order-1042', // one key per order, so a retry can't charge twice
   * });
   *
   * // Payment with all options
   * const payment = await square.payments.create({
   *   sourceId: 'cnon:card-nonce-ok',
   *   amount: 1000,
   *   currency: 'USD',
   *   customerId: 'CUST_123',
   *   orderId: 'ORDER_123',
   *   note: 'Payment for order #123',
   *   autocomplete: true,
   *   buyerEmailAddress: 'buyer@example.com',
   *   statementDescriptionIdentifier: 'ORDER123',
   *   idempotencyKey: 'order-123-payment',
   * });
   *
   * // Merchant-initiated charge of a card on file (e.g. a renewal)
   * const payment = await square.payments.create({
   *   sourceId: 'ccof:CARD_123',
   *   customerId: 'CUST_123',
   *   amount: 1000,
   *   customerDetails: { customerInitiated: false, sellerKeyedIn: false },
   *   idempotencyKey: 'renewal-SUB_123-2026-12',
   * });
   * ```
   */
  async create(options: CreatePaymentOptions): Promise<Payment> {
    // Validate required fields
    if (!options.sourceId) {
      throw new SquareValidationError('sourceId is required', 'sourceId');
    }
    if (options.amount <= 0) {
      throw new SquareValidationError('amount must be greater than 0', 'amount');
    }
    requireNonEmpty(options.idempotencyKey, 'idempotencyKey');

    const locationId = this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    const currency: CurrencyCode = options.currency ?? this.defaultCurrency;

    try {
      const response = await this.client.payments.create({
        sourceId: options.sourceId,
        idempotencyKey: options.idempotencyKey,
        amountMoney: {
          amount: BigInt(options.amount),
          currency,
        },
        customerId: options.customerId,
        orderId: options.orderId,
        referenceId: options.referenceId,
        note: options.note,
        autocomplete: options.autocomplete ?? true,
        locationId,
        customerDetails: options.customerDetails,
        buyerEmailAddress: options.buyerEmailAddress,
        statementDescriptionIdentifier: options.statementDescriptionIdentifier,
        verificationToken: options.verificationToken,
      });
      assertNoResponseErrors(response);

      if (!response.payment) {
        throw new Error('Payment was not created');
      }

      return response.payment as Payment;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a payment by ID
   *
   * @param paymentId - Payment ID
   * @returns Payment details
   *
   * @example
   * ```typescript
   * const payment = await square.payments.get('PAYMENT_123');
   * ```
   */
  async get(paymentId: string): Promise<Payment> {
    try {
      const response = await this.client.payments.get({ paymentId });
      assertNoResponseErrors(response);

      if (!response.payment) {
        throw new Error('Payment not found');
      }

      return response.payment as Payment;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Cancel a payment
   *
   * @param paymentId - Payment ID to cancel
   * @returns Cancelled payment
   *
   * @example
   * ```typescript
   * const payment = await square.payments.cancel('PAYMENT_123');
   * ```
   */
  async cancel(paymentId: string): Promise<Payment> {
    try {
      const response = await this.client.payments.cancel({ paymentId });
      assertNoResponseErrors(response);

      if (!response.payment) {
        throw new Error('Payment cancellation failed');
      }

      return response.payment as Payment;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Complete a payment (for payments created with autocomplete: false)
   *
   * @param paymentId - Payment ID to complete
   * @returns Completed payment
   *
   * @example
   * ```typescript
   * const payment = await square.payments.complete('PAYMENT_123');
   * ```
   */
  async complete(paymentId: string): Promise<Payment> {
    try {
      const response = await this.client.payments.complete({ paymentId });
      assertNoResponseErrors(response);

      if (!response.payment) {
        throw new Error('Payment completion failed');
      }

      return response.payment as Payment;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List payments with optional filters
   *
   * @param options - List options
   * @returns Array of payments
   *
   * @example
   * ```typescript
   * const payments = await square.payments.list({
   *   limit: 10,
   * });
   * ```
   */
  async list(options?: {
    limit?: number;
    locationId?: string;
  }): Promise<Payment[]> {
    try {
      const payments: Payment[] = [];
      const limit = options?.limit ?? 100;

      const page = await this.client.payments.list({
        locationId: options?.locationId ?? this.defaultLocationId,
      });
      assertNoResponseErrors(page.response);

      for await (const payment of page) {
        payments.push(payment as Payment);
        if (payments.length >= limit) {
          break;
        }
      }
      // Iteration replaces `page.response` with each fetched page; an errors
      // page has no cursor, so it is the last one loaded.
      assertNoResponseErrors(page.response);

      return payments;
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
