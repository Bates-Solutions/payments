import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

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
 * Options for creating a product
 */
export interface CreateProductOptions {
  /** Product name shown to customers (required, non-empty) */
  name: string;
  /** Longer description shown to customers */
  description?: string;
  /**
   * Whether the product can be bought.
   * @default true
   */
  active?: boolean;
  /** Up to 8 image URLs */
  images?: string[];
  /**
   * Key/value metadata. Use it to tag the product with your own id so you can
   * find it again on a later sync.
   */
  metadata?: Record<string, string>;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for updating a product. Only the fields you pass are changed.
 */
export interface UpdateProductOptions {
  /** New name (must not be empty when given) */
  name?: string;
  /** New description. Pass `''` to clear it. */
  description?: string;
  /** Archive (`false`) or restore (`true`) the product */
  active?: boolean;
  /** Replace the image URLs */
  images?: string[];
  /**
   * Metadata to merge into the existing metadata. Set a key to `''` to remove
   * it.
   */
  metadata?: Record<string, string>;
  /** Make this price the product's default price */
  defaultPriceId?: string;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Products service wrapping Stripe [Products](https://docs.stripe.com/api/products).
 *
 * @example
 * ```typescript
 * const product = await stripe.products.create({
 *   name: 'Sourdough loaf',
 *   metadata: { supplierSku: 'SD-001' },
 * });
 * await stripe.products.update(product.id, { description: 'Baked daily' });
 * await stripe.products.archive(product.id);
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
        nextCursor: page.has_more ? page.data.at(-1)?.id : undefined,
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

  /**
   * Create a product.
   *
   * @throws {StripeValidationError} When `name` is missing or blank
   *
   * @example
   * ```typescript
   * const product = await stripe.products.create({
   *   name: 'Sourdough loaf',
   *   description: 'Naturally leavened',
   *   metadata: { supplierSku: 'SD-001' },
   * });
   * ```
   */
  async create(options: CreateProductOptions): Promise<Product> {
    // Optional chain guards JS callers who bypass the types and omit name.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!options.name?.trim()) {
      throw new StripeValidationError('name is required', 'name');
    }

    try {
      return await this.client.products.create(
        {
          name: options.name,
          description: options.description,
          active: options.active,
          images: options.images,
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Update a product. Only the fields you pass are changed.
   *
   * @throws {StripeValidationError} When `productId` is missing, or `name` is
   * given but blank
   *
   * @example
   * ```typescript
   * await stripe.products.update('prod_123', {
   *   name: 'Sourdough loaf (large)',
   *   metadata: { supplierSku: 'SD-002' },
   * });
   * ```
   */
  async update(productId: string, options: UpdateProductOptions): Promise<Product> {
    if (!productId) {
      throw new StripeValidationError('productId is required', 'productId');
    }
    if (options.name !== undefined && !options.name.trim()) {
      throw new StripeValidationError('name must not be empty', 'name');
    }

    try {
      return await this.client.products.update(
        productId,
        {
          name: options.name,
          description: options.description,
          active: options.active,
          images: options.images,
          metadata: options.metadata,
          default_price: options.defaultPriceId,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Archive a product (`active: false`). Stripe keeps archived products so
   * past payments still reference them, but they can no longer be bought.
   * Restore one with `update(id, { active: true })`.
   *
   * @throws {StripeValidationError} When `productId` is missing
   */
  async archive(productId: string, options?: { idempotencyKey?: string }): Promise<Product> {
    return this.update(productId, { active: false, idempotencyKey: options?.idempotencyKey });
  }
}
