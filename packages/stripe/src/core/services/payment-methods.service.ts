import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe PaymentMethod (a saved card, bank account, wallet, ...)
 */
export type PaymentMethod = Stripe.PaymentMethod;

/**
 * Options for listing payment methods
 */
export interface ListPaymentMethodsOptions {
  /** Only payment methods attached to this customer */
  customerId?: string;
  /** Only payment methods of this type, e.g. `'card'` */
  type?: Stripe.PaymentMethodListParams.Type;
  limit?: number;
  startingAfter?: string;
}

function requireId(value: string | undefined, field: string): void {
  if (!value) {
    throw new StripeValidationError(`${field} is required`, field);
  }
}

/**
 * Payment Methods service wrapping Stripe
 * [PaymentMethods](https://docs.stripe.com/api/payment_methods): read, attach
 * to and detach from customers, and set a customer's default.
 *
 * To save a card for later (off-session) charges, collect it with a
 * SetupIntent (see `setupIntents`); Stripe attaches it to the customer when the
 * SetupIntent succeeds.
 *
 * @example
 * ```typescript
 * const { data: cards } = await stripe.paymentMethods.list({ customerId: 'cus_123', type: 'card' });
 * await stripe.paymentMethods.setDefault('cus_123', cards[0].id);
 * ```
 */
export class PaymentMethodsService {
  constructor(private readonly client: Stripe) {}

  /**
   * Retrieve a payment method by ID.
   *
   * @throws {StripeValidationError} When `paymentMethodId` is missing
   */
  async get(paymentMethodId: string): Promise<PaymentMethod> {
    requireId(paymentMethodId, 'paymentMethodId');
    try {
      return await this.client.paymentMethods.retrieve(paymentMethodId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List payment methods with cursor-based pagination.
   */
  async list(options?: ListPaymentMethodsOptions): Promise<PaginatedResponse<PaymentMethod>> {
    try {
      const page = await this.client.paymentMethods.list({
        customer: options?.customerId,
        type: options?.type,
        limit: options?.limit,
        starting_after: options?.startingAfter,
      });

      return {
        data: page.data,
        hasMore: page.has_more,
        nextCursor: page.has_more ? page.data.at(-1)?.id : undefined,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Attach a payment method to a customer.
   *
   * Prefer a SetupIntent for cards you will charge off-session: attaching
   * directly skips the authentication and mandate a SetupIntent collects.
   *
   * @throws {StripeValidationError} When `paymentMethodId` or `customerId` is missing
   */
  async attach(
    paymentMethodId: string,
    options: { customerId: string; idempotencyKey?: string }
  ): Promise<PaymentMethod> {
    requireId(paymentMethodId, 'paymentMethodId');
    requireId(options.customerId, 'customerId');
    try {
      return await this.client.paymentMethods.attach(
        paymentMethodId,
        { customer: options.customerId },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Detach a payment method from its customer. It can't be used again
   * afterwards.
   *
   * @throws {StripeValidationError} When `paymentMethodId` is missing
   */
  async detach(
    paymentMethodId: string,
    options?: { idempotencyKey?: string }
  ): Promise<PaymentMethod> {
    requireId(paymentMethodId, 'paymentMethodId');
    try {
      return await this.client.paymentMethods.detach(
        paymentMethodId,
        {},
        { idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Make a payment method the customer's default for invoices and
   * subscriptions (`invoice_settings.default_payment_method`). The payment
   * method must already be attached to the customer.
   *
   * @returns The updated customer
   * @throws {StripeValidationError} When `customerId` or `paymentMethodId` is missing
   */
  async setDefault(
    customerId: string,
    paymentMethodId: string,
    options?: { idempotencyKey?: string }
  ): Promise<Stripe.Customer> {
    requireId(customerId, 'customerId');
    requireId(paymentMethodId, 'paymentMethodId');
    try {
      return await this.client.customers.update(
        customerId,
        { invoice_settings: { default_payment_method: paymentMethodId } },
        { idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
