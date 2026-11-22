import type { SquareClient } from 'square';
import type {
  CurrencyCode,
  LineItemInput,
  OrderDiscountInput,
  OrderPricingOptions,
  OrderTaxInput,
} from '../types/index.js';
import { assertNoResponseErrors, parseSquareError, SquareValidationError } from '../errors.js';
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
  appliedTaxes?: Array<{ taxUid: string }>;
  note?: string;
}

/**
 * Order-level tax, in the shape Square's `order.taxes` expects.
 */
interface OrderTaxRequest {
  uid?: string;
  catalogObjectId?: string;
  name?: string;
  percentage?: string;
  type?: OrderTaxInput['type'];
  scope?: OrderTaxInput['scope'];
}

/** Money as Square returns it. */
interface OrderMoney {
  amount?: bigint;
  currency?: string;
}

/**
 * A tax on a returned order, with the amount Square computed for it.
 */
export interface OrderTax {
  uid?: string;
  catalogObjectId?: string;
  name?: string;
  percentage?: string;
  type?: string;
  scope?: string;
  /** The amount of this tax across the order, as Square computed it. */
  appliedMoney?: OrderMoney;
}

/**
 * A payment (or other tender) applied to an order. An order with no tenders
 * hasn't been paid.
 */
export interface OrderTender {
  id?: string;
  type?: string;
  amountMoney?: OrderMoney;
  paymentId?: string;
  createdAt?: string;
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
  /** The order's taxes, each with the `appliedMoney` Square computed. */
  taxes?: OrderTax[];
  /** Payments applied to the order. Empty or missing until it's paid. */
  tenders?: OrderTender[];
  totalMoney?: {
    amount?: bigint;
    currency?: string;
  };
  totalTaxMoney?: OrderMoney;
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
  private taxes: OrderTaxRequest[] = [];
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

    if (item.appliedTaxes && item.appliedTaxes.length > 0) {
      lineItem.appliedTaxes = item.appliedTaxes;
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
   * Add an order tax. Define an ad hoc tax inline with `name` + `percentage`,
   * or reference an existing `CatalogTax` by `catalogObjectId`. For a
   * `LINE_ITEM`-scoped tax, give it a `uid` and reference that from each line's
   * `appliedTaxes`. To charge only the taxes you add, also set
   * `withPricingOptions({ autoApplyTaxes: false })`.
   *
   * @throws {SquareValidationError} When the tax has neither `catalogObjectId`
   *   nor a numeric `percentage`
   *
   * @example
   * ```typescript
   * builder
   *   .addItem({ name: 'Design fee', amount: 2500 })
   *   .addTax({ uid: 'gst', name: 'GST', percentage: '5', scope: 'ORDER' })
   *   .withPricingOptions({ autoApplyTaxes: false });
   * ```
   */
  addTax(tax: OrderTaxInput): this {
    if (!tax.catalogObjectId) {
      if (tax.percentage === undefined || !/^\d+(\.\d+)?$/.test(tax.percentage)) {
        throw new SquareValidationError(
          `Tax${tax.uid ? ` '${tax.uid}'` : ''} needs a catalogObjectId, or a percentage such as "5" or "7.25"`,
          'taxes'
        );
      }
    }
    this.taxes.push({
      uid: tax.uid,
      catalogObjectId: tax.catalogObjectId,
      name: tax.name,
      percentage: tax.percentage,
      type: tax.type,
      scope: tax.scope,
    });
    return this;
  }

  /**
   * Add multiple order taxes at once.
   */
  addTaxes(taxes: OrderTaxInput[]): this {
    for (const tax of taxes) {
      this.addTax(tax);
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
   * The same cross-check for taxes: a line's `appliedTaxes.taxUid` must match
   * an order tax `uid` whose scope is `LINE_ITEM`, and a `LINE_ITEM`-scoped
   * tax must be referenced by at least one line. Square applies an `ORDER` tax
   * to every line, so a reference to one would not exempt the other lines.
   */
  private validateTaxReferences(): void {
    const taxesByUid = new Map(
      this.taxes.filter((t) => t.uid !== undefined).map((t) => [t.uid as string, t])
    );
    const referencedUids = new Set<string>();

    for (const item of this.lineItems) {
      for (const applied of item.appliedTaxes ?? []) {
        const tax = taxesByUid.get(applied.taxUid);
        if (!tax) {
          throw new SquareValidationError(
            `Line item references tax '${applied.taxUid}', which is not in the order's taxes. Add it with addTax({ uid: '${applied.taxUid}', … }).`,
            'appliedTaxes'
          );
        }
        if (tax.scope !== 'LINE_ITEM') {
          throw new SquareValidationError(
            `Line item references tax '${applied.taxUid}', which is not LINE_ITEM-scoped. Square applies an ORDER tax to every line, so set scope: 'LINE_ITEM' on it to tax only the lines that reference it.`,
            'appliedTaxes'
          );
        }
        referencedUids.add(applied.taxUid);
      }
    }

    for (const tax of this.taxes) {
      if (tax.scope === 'LINE_ITEM' && (!tax.uid || !referencedUids.has(tax.uid))) {
        throw new SquareValidationError(
          `LINE_ITEM tax${tax.uid ? ` '${tax.uid}'` : ''} is not referenced by any line item's appliedTaxes, so it would apply to nothing.`,
          'taxes'
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
    this.validateTaxReferences();

    try {
      const response = await this.client.orders.create({
        order: {
          locationId: this.locationId,
          lineItems: this.lineItems,
          discounts: this.discounts.length > 0 ? this.discounts : undefined,
          taxes: this.taxes.length > 0 ? this.taxes : undefined,
          customerId: this.customerId,
          referenceId: this.referenceId,
          state: this.state,
          pricingOptions: this.pricingOptions,
        },
        idempotencyKey: this.idempotencyKey ?? createIdempotencyKey(),
      });
      assertNoResponseErrors(response);

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
    taxes: OrderTaxRequest[];
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
      taxes: [...this.taxes],
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
    this.taxes = [];
    this.customerId = undefined;
    this.referenceId = undefined;
    this.tipAmount = undefined;
    this.state = undefined;
    this.pricingOptions = undefined;
    this.idempotencyKey = undefined;
    return this;
  }
}
