import type Stripe from 'stripe';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { listAll } from '../utils.js';
import type { LineItem, ListLineItemsOptions } from './checkout.service.js';

/**
 * A Stripe Payment Link
 */
export type PaymentLink = Stripe.PaymentLink;

/**
 * Payment Links service wrapping Stripe
 * [Payment Links](https://docs.stripe.com/api/payment-link) (read-only).
 *
 * A Payment Link's line items are what it offers. What was actually sold
 * through it is on the Checkout Sessions it created:
 * `checkout.list({ paymentLinkId, status: 'complete' })`.
 *
 * @example
 * ```typescript
 * const link = await stripe.paymentLinks.get('plink_123');
 * const offered = await stripe.paymentLinks.listLineItems(link.id);
 * ```
 */
export class PaymentLinksService {
  constructor(private readonly client: Stripe) {}

  /**
   * Retrieve a Payment Link by ID.
   */
  async get(paymentLinkId: string): Promise<PaymentLink> {
    try {
      return await this.client.paymentLinks.retrieve(paymentLinkId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List all line items of a Payment Link (every page, fetched for you).
   *
   * @throws {StripeValidationError} When `paymentLinkId` is missing
   */
  async listLineItems(
    paymentLinkId: string,
    options?: ListLineItemsOptions
  ): Promise<LineItem[]> {
    if (!paymentLinkId) {
      throw new StripeValidationError('paymentLinkId is required', 'paymentLinkId');
    }
    try {
      return await listAll((startingAfter) =>
        this.client.paymentLinks.listLineItems(paymentLinkId, {
          limit: 100,
          starting_after: startingAfter,
          expand: options?.expandProduct ? ['data.price.product'] : undefined,
        })
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
