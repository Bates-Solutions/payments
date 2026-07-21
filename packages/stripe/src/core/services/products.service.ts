import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError } from '../errors.js';

/**
 * A Stripe Product
 */
export type Product = Stripe.Product;

/**
 * Options for listing products
 */
export interface ListProductsOptions {
  /** Only return active (or inactive) products */
  active?: boolean;
  limit?: number;
  startingAfter?: string;
}

/**
 * Products service wrapping Stripe [Products](https://docs.stripe.com/api/products).
 *
 * @example
 * ```typescript
 * const { data } = await stripe.products.list({ active: true });
 * const product = await stripe.products.get('prod_123');
 * console.log(product.metadata);
 * ```
 */
export class ProductsService {
  constructor(private readonly client: Stripe) {}

  /**
   * List products with cursor-based pagination.
   */
  async list(options?: ListProductsOptions): Promise<PaginatedResponse<Product>> {
    try {
      const page = await this.client.products.list({
        active: options?.active,
        limit: options?.limit,
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

  /**
   * Retrieve a product by ID.
   */
  async get(productId: string): Promise<Product> {
    try {
      return await this.client.products.retrieve(productId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
