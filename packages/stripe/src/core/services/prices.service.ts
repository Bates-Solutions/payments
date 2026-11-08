import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError } from '../errors.js';

/**
 * A Stripe Price
 */
export type Price = Stripe.Price;

/**
 * Options for listing prices
 */
export interface ListPricesOptions {
  /** Only return active (or inactive) prices */
  active?: boolean;
  /** Only return prices for this product */
  product?: string;
  limit?: number;
  startingAfter?: string;
  /**
   * Expand the related product inline (`price.product` becomes the full
   * `Stripe.Product` instead of an ID). Handy for reading product metadata.
   * @default false
   */
  expandProduct?: boolean;
}

/**
 * Prices service wrapping Stripe [Prices](https://docs.stripe.com/api/prices).
 *
 * @example
 * ```typescript
 * // List active prices with their product expanded (read product metadata)
 * const { data } = await stripe.prices.list({ active: true, expandProduct: true });
 * for (const price of data) {
 *   const product = price.product as Stripe.Product;
 *   console.log(product.metadata.tier, price.unit_amount, price.recurring?.interval);
 * }
 * ```
 */
export class PricesService {
  constructor(private readonly client: Stripe) {}

  /**
   * List prices with cursor-based pagination.
   */
  async list(options?: ListPricesOptions): Promise<PaginatedResponse<Price>> {
    try {
      const page = await this.client.prices.list({
        active: options?.active,
        product: options?.product,
        limit: options?.limit,
        starting_after: options?.startingAfter,
        expand: options?.expandProduct ? ['data.product'] : undefined,
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
   * Retrieve a price by ID, optionally expanding its product.
   */
  async get(priceId: string, options?: { expandProduct?: boolean }): Promise<Price> {
    try {
      return await this.client.prices.retrieve(priceId, {
        expand: options?.expandProduct ? ['product'] : undefined,
      });
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
