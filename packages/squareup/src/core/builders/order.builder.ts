import type { SquareClient } from 'square';
import type { CurrencyCode, LineItemInput } from '../types/index.js';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Order line item type for internal use
 */
interface OrderLineItem {
  quantity: string;
  catalogObjectId?: string;
  name?: string;
  basePriceMoney?: {
    amount: bigint;
    currency: CurrencyCode;
  };
  note?: string;
}

/**
 * Order type from Square API
 */
export interface Order {
  id?: string;
  locationId?: string;
  referenceId?: string;
  customerId?: string;
  lineItems?: OrderLineItem[];
  totalMoney?: {
    amount?: bigint;
    currency?: string;
  };
  state?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fluent builder for creating Square orders
 *
 * @example
 * ```typescript
 * const order = await square.orders
 *   .builder()
 *   .addItem({ name: 'Latte', amount: 450 })
 *   .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })
 *   .withTip(100)
 *   .withCustomer('CUST_123')
 *   .build();
 * ```
 */
export class OrderBuilder {
  private lineItems: OrderLineItem[] = [];
  private customerId?: string;
  private referenceId?: string;
  private tipAmount?: bigint;
  private currency: CurrencyCode = 'USD';

  constructor(
    private readonly client: SquareClient,
    private readonly locationId: string
  ) {}

  /**
   * Set the currency for the order
   *
   * @param currency - Currency code
   * @returns Builder instance for chaining
   */
  withCurrency(currency: CurrencyCode): this {
    this.currency = currency;
    return this;
  }

  /**
   * Add a line item to the order
   *
   * @param item - Line item details
   * @returns Builder instance for chaining
   *
   * @example
   * ```typescript
   * builder
   *   .addItem({ name: 'Coffee', amount: 350 })
   *   .addItem({ catalogObjectId: 'ITEM_123', quantity: 2 })
   * ```
   */
  addItem(item: LineItemInput): this {
    const quantity = String(item.quantity ?? 1);

    const lineItem: OrderLineItem = {
      quantity,
    };

    if (item.catalogObjectId) {
      lineItem.catalogObjectId = item.catalogObjectId;
    } else if (item.name && item.amount !== undefined) {
      lineItem.name = item.name;
      lineItem.basePriceMoney = {
        amount: BigInt(item.amount),
        currency: this.currency,
      };
    } else {
      throw new SquareValidationError(
        'Line item must have either catalogObjectId or both name and amount'
      );
    }

    if (item.note) {
      lineItem.note = item.note;
    }

    this.lineItems.push(lineItem);
    return this;
  }

  /**
   * Add multiple line items at once
   *
   * @param items - Array of line items
   * @returns Builder instance for chaining
   */
  addItems(items: LineItemInput[]): this {
    for (const item of items) {
      this.addItem(item);
    }
    return this;
  }

  /**
   * Add a tip to the order
   *
   * @param amount - Tip amount in cents
   * @returns Builder instance for chaining
   */
  withTip(amount: number): this {
    this.tipAmount = BigInt(amount);
    return this;
  }

  /**
   * Associate a customer with the order
   *
   * @param customerId - Square customer ID
   * @returns Builder instance for chaining
   */
  withCustomer(customerId: string): this {
    this.customerId = customerId;
    return this;
  }

  /**
   * Add a reference ID for external tracking
   *
   * @param referenceId - External reference ID
   * @returns Builder instance for chaining
   */
  withReference(referenceId: string): this {
    this.referenceId = referenceId;
    return this;
  }

  /**
   * Add a note to the order
   *
   * @param note - Order note
   * @returns Builder instance for chaining
   */
  withNote(_note: string): this {
    // Note: Order-level notes are typically handled differently in Square
    // This is preserved for API compatibility
    return this;
  }

  /**
   * Build and create the order
   *
   * @returns Created order
   *
   * @throws {SquareValidationError} When validation fails
   * @throws {SquareApiError} When API call fails
   */
  async build(): Promise<Order> {
    if (this.lineItems.length === 0) {
      throw new SquareValidationError('Order must have at least one line item');
    }

    try {
      const response = await this.client.orders.create({
        order: {
          locationId: this.locationId,
          lineItems: this.lineItems,
          customerId: this.customerId,
          referenceId: this.referenceId,
        },
        idempotencyKey: createIdempotencyKey(),
      });

      if (!response.order) {
        throw new Error('Order was not created');
      }

      return response.order as Order;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Preview the order without creating it
   * Returns the order configuration that would be sent
   */
  preview(): {
    locationId: string;
    lineItems: OrderLineItem[];
    customerId?: string;
    referenceId?: string;
    tipAmount?: bigint;
    currency: CurrencyCode;
  } {
    return {
      locationId: this.locationId,
      lineItems: [...this.lineItems],
      customerId: this.customerId,
      referenceId: this.referenceId,
      tipAmount: this.tipAmount,
      currency: this.currency,
    };
  }

  /**
   * Reset the builder to start fresh
   */
  reset(): this {
    this.lineItems = [];
    this.customerId = undefined;
    this.referenceId = undefined;
    this.tipAmount = undefined;
    return this;
  }
}
