import type { SquareClient } from 'square';
import type { CreateOrderOptions } from '../types/index.js';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';
import { OrderBuilder, type Order } from '../builders/order.builder.js';

/**
 * Orders service for managing Square orders
 *
 * @example
 * ```typescript
 * // Using the builder (recommended)
 * const order = await square.orders
 *   .builder()
 *   .addItem({ name: 'Latte', amount: 450 })
 *   .withCustomer('CUST_123')
 *   .build();
 *
 * // Or create directly
 * const order = await square.orders.create({
 *   lineItems: [{ name: 'Latte', amount: 450 }],
 * });
 * ```
 */
export class OrdersService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Create a new order builder
   *
   * @param locationId - Optional location ID (uses default if not provided)
   * @returns Order builder instance
   *
   * @example
   * ```typescript
   * const order = await square.orders
   *   .builder()
   *   .addItem({ name: 'Coffee', amount: 350 })
   *   .addItem({ name: 'Muffin', amount: 250 })
   *   .withTip(100)
   *   .build();
   * ```
   */
  builder(locationId?: string): OrderBuilder {
    const location = locationId ?? this.defaultLocationId;
    if (!location) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }
    return new OrderBuilder(this.client, location);
  }

  /**
   * Create an order directly (without builder)
   *
   * @param options - Order creation options
   * @param locationId - Optional location ID
   * @returns Created order
   *
   * @example
   * ```typescript
   * const order = await square.orders.create({
   *   lineItems: [
   *     { name: 'Coffee', amount: 350 },
   *     { catalogObjectId: 'ITEM_123', quantity: 2 },
   *   ],
   *   customerId: 'CUST_123',
   * });
   * ```
   */
  async create(options: CreateOrderOptions, locationId?: string): Promise<Order> {
    const location = locationId ?? this.defaultLocationId;
    if (!location) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    if (options.lineItems.length === 0) {
      throw new SquareValidationError('Order must have at least one line item', 'lineItems');
    }

    // Use builder internally for consistent validation
    const builder = new OrderBuilder(this.client, location);

    for (const item of options.lineItems) {
      builder.addItem(item);
    }

    if (options.customerId) {
      builder.withCustomer(options.customerId);
    }

    if (options.referenceId) {
      builder.withReference(options.referenceId);
    }

    return builder.build();
  }

  /**
   * Get an order by ID
   *
   * @param orderId - Order ID
   * @returns Order details
   *
   * @example
   * ```typescript
   * const order = await square.orders.get('ORDER_123');
   * ```
   */
  async get(orderId: string): Promise<Order> {
    try {
      const response = await this.client.orders.get({ orderId });

      if (!response.order) {
        throw new Error('Order not found');
      }

      return response.order as Order;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update an order
   *
   * @param orderId - Order ID to update
   * @param updates - Update fields
   * @returns Updated order
   */
  async update(
    orderId: string,
    updates: {
      version: number;
      referenceId?: string;
    },
    locationId?: string
  ): Promise<Order> {
    const location = locationId ?? this.defaultLocationId;
    if (!location) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    try {
      const response = await this.client.orders.update({
        orderId,
        order: {
          locationId: location,
          version: updates.version,
          referenceId: updates.referenceId,
        },
        idempotencyKey: createIdempotencyKey(),
      });

      if (!response.order) {
        throw new Error('Order update failed');
      }

      return response.order as Order;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Pay for an order
   *
   * @param orderId - Order ID
   * @param paymentIds - Payment IDs to apply
   * @returns Updated order
   *
   * @example
   * ```typescript
   * const order = await square.orders.pay('ORDER_123', ['PAYMENT_456']);
   * ```
   */
  async pay(orderId: string, paymentIds: string[]): Promise<Order> {
    try {
      const response = await this.client.orders.pay({
        orderId,
        idempotencyKey: createIdempotencyKey(),
        paymentIds,
      });

      if (!response.order) {
        throw new Error('Order payment failed');
      }

      return response.order as Order;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search for orders
   *
   * @param options - Search options
   * @returns Paginated list of orders
   *
   * @example
   * ```typescript
   * const { data, cursor } = await square.orders.search({
   *   locationIds: ['LXXX'],
   *   limit: 10,
   * });
   * ```
   */
  async search(options?: {
    locationIds?: string[];
    cursor?: string;
    limit?: number;
  }): Promise<{ data: Order[]; cursor?: string }> {
    try {
      const locationIds = options?.locationIds ?? (this.defaultLocationId ? [this.defaultLocationId] : []);

      if (locationIds.length === 0) {
        throw new SquareValidationError('At least one locationId is required for search');
      }

      const response = await this.client.orders.search({
        locationIds,
        cursor: options?.cursor,
        limit: options?.limit,
      });

      return {
        data: (response.orders ?? []) as Order[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
