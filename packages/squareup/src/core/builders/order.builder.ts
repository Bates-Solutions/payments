import type { SquareClient } from 'square';
import type {
  CurrencyCode,
  LineItemInput,
  OrderDiscountInput,
  OrderPricingOptions,
} from '../types/index.js';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

type OrderState = 'DRAFT' | 'OPEN';

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
  appliedDiscounts?: Array<{ discountUid: string }>;
  note?: string;
}

/**
 * Order-level discount, in the shape Square's `order.discounts` expects.
 */
interface OrderDiscount {
  uid?: string;
  catalogObjectId?: string;
  name?: string;
  type?: OrderDiscountInput['type'];
  percentage?: string;
  amountMoney?: { amount: bigint; currency: CurrencyCode };
  scope?: OrderDiscountInput['scope'];
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
  pricingOptions?: OrderPricingOptions;
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
  private discounts: OrderDiscount[] = [];
  private customerId?: string;
  private referenceId?: string;
  private tipAmount?: bigint;
  private currency: CurrencyCode;
  private state?: OrderState;
  private pricingOptions?: OrderPricingOptions;
  private idempotencyKey?: string;

  constructor(
    private readonly client: SquareClient,
    private readonly locationId: string,
    defaultCurrency: CurrencyCode = 'USD'
  ) {
    this.currency = defaultCurrency;
  }

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
    } else if (item.name) {
      lineItem.name = item.name;
      if (item.amount !== undefined) {
        lineItem.basePriceMoney = {
          amount: BigInt(item.amount),
          currency: this.currency,
        };
      }
    }

    if (item.basePriceMoney) {
      lineItem.basePriceMoney = {
        amount: BigInt(item.basePriceMoney.amount),
        currency: item.basePriceMoney.currency,
      };
    }

    if (!lineItem.catalogObjectId && (!lineItem.name || !lineItem.basePriceMoney)) {
      throw new SquareValidationError(
        'Line item must have either catalogObjectId or both name and amount (or basePriceMoney)'
      );
    }

    if (item.appliedDiscounts && item.appliedDiscounts.length > 0) {
      lineItem.appliedDiscounts = item.appliedDiscounts;
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
   * Add an order discount. Reference an existing `CatalogDiscount` by
   * `catalogObjectId` (price tracks the catalog), or define one inline. For a
   * `LINE_ITEM`-scoped discount, give it a `uid` and reference that from each
   * line's `appliedDiscounts`.
   *
   * @example
   * ```typescript
   * builder
   *   .addItem({ catalogObjectId: 'ITEM_1', quantity: 1, appliedDiscounts: [{ discountUid: 'wholesale' }] })
   *   .addDiscount({ uid: 'wholesale', catalogObjectId: 'DISCOUNT_1', scope: 'LINE_ITEM' });
   * ```
   */
  addDiscount(discount: OrderDiscountInput): this {
    const mapped: OrderDiscount = {
      uid: discount.uid,
      catalogObjectId: discount.catalogObjectId,
      name: discount.name,
      type: discount.type,
      percentage: discount.percentage,
      scope: discount.scope,
    };
    if (discount.amountMoney) {
      mapped.amountMoney = {
        amount: BigInt(discount.amountMoney.amount),
        currency: discount.amountMoney.currency,
      };
    }
    this.discounts.push(mapped);
    return this;
  }

  /**
   * Add multiple order discounts at once.
   */
  addDiscounts(discounts: OrderDiscountInput[]): this {
    for (const discount of discounts) {
      this.addDiscount(discount);
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
   * Set the order state. Use `'DRAFT'` when creating an order template that
   * will back a subscription phase.
   */
  withState(state: OrderState): this {
    this.state = state;
    return this;
  }

  /**
   * Set pricing options. `autoApplyDiscounts: true` is required for templates
   * that should pick up customer-group pricing rules (wholesale tiers) at each
   * subscription billing cycle.
   */
  withPricingOptions(options: OrderPricingOptions): this {
    this.pricingOptions = options;
    return this;
  }

  /**
   * Shorthand for a DRAFT order with `autoApplyDiscounts: true`.
   *
   * ⚠️ **Not valid for a subscription order template** — Square rejects
   * `auto_apply_discounts` there (`The order template amount must not have
   * auto_apply_discounts set to true`). For a subscription template, use
   * `withState('DRAFT')` and make the amount explicit via `addDiscount(...)`
   * (catalog-authoritative) or per-line `basePriceMoney`. This helper remains
   * for non-subscription DRAFT orders that do want auto-applied pricing rules.
   */
  asTemplate(): this {
    return this.withState('DRAFT').withPricingOptions({ autoApplyDiscounts: true });
  }

  /**
   * Provide an explicit idempotency key. Useful for retrying subscription
   * template creation without producing duplicate orders.
   */
  withIdempotencyKey(key: string): this {
    this.idempotencyKey = key;
    return this;
  }

  /**
   * Cross-check discount references so mistakes fail clearly here instead of as
   * an opaque Square error (or a silent no-op):
   * - a line's `appliedDiscounts.discountUid` must match an order discount `uid`;
   * - a `LINE_ITEM`-scoped discount must be referenced by at least one line
   *   (otherwise it applies to nothing).
   */
  private validateDiscountReferences(): void {
    const discountUids = new Set(
      this.discounts.map((d) => d.uid).filter((uid): uid is string => uid !== undefined)
    );
    const referencedUids = new Set<string>();

    for (const item of this.lineItems) {
      for (const applied of item.appliedDiscounts ?? []) {
        if (!discountUids.has(applied.discountUid)) {
          throw new SquareValidationError(
            `Line item references discount '${applied.discountUid}', which is not in the order's discounts. Add it with addDiscount({ uid: '${applied.discountUid}', … }).`,
            'appliedDiscounts'
          );
        }
        referencedUids.add(applied.discountUid);
      }
    }

    for (const discount of this.discounts) {
      if (discount.scope === 'LINE_ITEM' && discount.uid && !referencedUids.has(discount.uid)) {
        throw new SquareValidationError(
          `LINE_ITEM discount '${discount.uid}' is not referenced by any line item's appliedDiscounts, so it would apply to nothing.`,
          'discounts'
        );
      }
    }
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

    this.validateDiscountReferences();

    try {
      const response = await this.client.orders.create({
        order: {
          locationId: this.locationId,
          lineItems: this.lineItems,
          discounts: this.discounts.length > 0 ? this.discounts : undefined,
          customerId: this.customerId,
          referenceId: this.referenceId,
          state: this.state,
          pricingOptions: this.pricingOptions,
        },
        idempotencyKey: this.idempotencyKey ?? createIdempotencyKey(),
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
    discounts: OrderDiscount[];
    customerId?: string;
    referenceId?: string;
    tipAmount?: bigint;
    currency: CurrencyCode;
    state?: OrderState;
    pricingOptions?: OrderPricingOptions;
    idempotencyKey?: string;
  } {
    return {
      locationId: this.locationId,
      lineItems: [...this.lineItems],
      discounts: [...this.discounts],
      customerId: this.customerId,
      referenceId: this.referenceId,
      tipAmount: this.tipAmount,
      currency: this.currency,
      state: this.state,
      pricingOptions: this.pricingOptions,
      idempotencyKey: this.idempotencyKey,
    };
  }

  /**
   * Reset the builder to start fresh
   */
  reset(): this {
    this.lineItems = [];
    this.discounts = [];
    this.customerId = undefined;
    this.referenceId = undefined;
    this.tipAmount = undefined;
    this.state = undefined;
    this.pricingOptions = undefined;
    this.idempotencyKey = undefined;
    return this;
  }
}
