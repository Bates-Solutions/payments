import type { SquareClient } from 'square';
import type {
  CurrencyCode,
  ListRefundsOptions,
  PaymentRefund,
  RefundPaymentOptions,
} from '../types/index.js';
import {
  assertNoResponseErrors,
  parseSquareError,
  requireNonEmpty,
  SquareValidationError,
} from '../errors.js';

/**
 * Refunds of Square payments
 *
 * @example
 * ```typescript
 * const refund = await square.refunds.refundPayment({
 *   paymentId: 'PAYMENT_123',
 *   amountMoney: { amount: 500 }, // $5.00
 *   idempotencyKey: createIdempotencyKey(),
 * });
 * ```
 */
export class RefundsService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultCurrency: CurrencyCode = 'USD'
  ) {}

  /**
   * Refund all or part of a payment
   *
   * The refund starts `PENDING`; Square sends `refund.updated` when it
   * completes or fails.
   *
   * @param options - Refund options
   * @returns The refund
   *
   * @throws {SquareValidationError} When `paymentId` or `idempotencyKey` is missing, or the amount is not positive
   *
   * @example
   * ```typescript
   * const refund = await square.refunds.refundPayment({
   *   paymentId: 'PAYMENT_123',
   *   amountMoney: { amount: 500, currency: 'USD' },
   *   idempotencyKey: 'refund-order-123',
   *   reason: 'Damaged item',
   * });
   * ```
   */
  async refundPayment(options: RefundPaymentOptions): Promise<PaymentRefund> {
    requireNonEmpty(options.paymentId, 'paymentId');
    requireNonEmpty(options.idempotencyKey, 'idempotencyKey');
    if (!(options.amountMoney.amount > 0)) {
      throw new SquareValidationError(
        'amountMoney.amount must be greater than 0',
        'amountMoney.amount'
      );
    }

    try {
      const response = await this.client.refunds.refundPayment({
        idempotencyKey: options.idempotencyKey,
        paymentId: options.paymentId,
        amountMoney: {
          amount: BigInt(options.amountMoney.amount),
          currency: options.amountMoney.currency ?? this.defaultCurrency,
        },
        reason: options.reason,
      });
      assertNoResponseErrors(response);

      if (!response.refund) {
        throw new Error('Refund was not created');
      }

      return response.refund;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a refund by ID
   *
   * @param refundId - Refund ID
   * @returns Refund details
   *
   * @example
   * ```typescript
   * const refund = await square.refunds.get('REFUND_123');
   * ```
   */
  async get(refundId: string): Promise<PaymentRefund> {
    requireNonEmpty(refundId, 'refundId');

    try {
      const response = await this.client.refunds.get({ refundId });
      assertNoResponseErrors(response);

      if (!response.refund) {
        throw new Error('Refund not found');
      }

      return response.refund;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List refunds, one page at a time
   *
   * @param options - Filters, page size and the cursor of the page to fetch
   * @returns One page of refunds, and the cursor of the next page if there is one
   *
   * @example
   * ```typescript
   * const page1 = await square.refunds.list({ status: 'COMPLETED', limit: 50 });
   * const page2 = await square.refunds.list({ status: 'COMPLETED', cursor: page1.cursor });
   * ```
   */
  async list(options?: ListRefundsOptions): Promise<{ refunds: PaymentRefund[]; cursor?: string }> {
    try {
      const page = await this.client.refunds.list({
        beginTime: options?.beginTime,
        endTime: options?.endTime,
        sortOrder: options?.sortOrder,
        locationId: options?.locationId,
        status: options?.status,
        sourceType: options?.sourceType,
        limit: options?.limit,
        cursor: options?.cursor,
      });
      assertNoResponseErrors(page.response);

      return {
        refunds: page.response.refunds ?? [],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
