/**
 * Square environment configuration
 */
export type SquareEnvironment = 'sandbox' | 'production';

/**
 * Currency codes supported by this wrapper. Runtime array so the value can be
 * validated; the {@link CurrencyCode} type is derived from it to prevent drift.
 */
export const CURRENCY_CODES = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'JPY'] as const;

/**
 * Currency codes supported by Square
 */
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/**
 * Type guard: is `value` a supported {@link CurrencyCode}?
 */
export function isCurrencyCode(value: string): value is CurrencyCode {
  return (CURRENCY_CODES as readonly string[]).includes(value);
}

/**
 * Payment source identifier
 * Can be a card nonce, card ID, or digital wallet token
 */
export type PaymentSource = string;

/**
 * Common pagination options
 */
export interface PaginationOptions {
  cursor?: string;
  limit?: number;
}

/**
 * Common response with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
}

/**
 * Simple money representation for API inputs
 */
export interface MoneyInput {
  amount: number;
  currency?: CurrencyCode;
}

/**
 * Line item for orders
 */
export interface LineItemInput {
  name?: string;
  catalogObjectId?: string;
  quantity?: number;
  amount?: number;
  /**
   * Explicit money override. When set, takes precedence over `amount` + the
   * builder's default currency. Useful for order templates where the base
   * price must include an explicit currency.
   */
  basePriceMoney?: {
    amount: bigint | number;
    currency: CurrencyCode;
  };
  /**
   * References to order-level `discounts` (by their `uid`) that apply to this
   * line item. Required for `LINE_ITEM`-scoped discounts — Square only applies
   * a line-item discount to a line that lists it here.
   */
  appliedDiscounts?: Array<{ discountUid: string }>;
  note?: string;
}

/**
 * Create payment options
 */
export interface CreatePaymentOptions {
  sourceId: PaymentSource;
  amount: number;
  currency?: CurrencyCode;
  customerId?: string;
  orderId?: string;
  referenceId?: string;
  note?: string;
  autocomplete?: boolean;
  /**
   * Required. Square takes the payment once per key, so a retry with the same key cannot
   * charge twice. Reuse a key only to resend the identical request (for example
   * after a network error); see {@link createIdempotencyKey}. At most 45
   * characters.
   */
  idempotencyKey: string;
  /**
   * Who started the payment. Set `customerInitiated: false` for a charge of a
   * card on file that the buyer did not start (a merchant-initiated
   * transaction, such as a renewal); `sellerKeyedIn: true` when the seller
   * typed in the card details.
   */
  customerDetails?: {
    customerInitiated?: boolean;
    sellerKeyedIn?: boolean;
  };
  /** The buyer's email address, for the receipt and risk checks. */
  buyerEmailAddress?: string;
  /**
   * Text added to the seller's name on the buyer's card statement (Square
   * truncates the combined text to the card network's limit).
   */
  statementDescriptionIdentifier?: string;
  /**
   * A buyer verification token from the Web Payments SDK `verifyBuyer()`.
   * Square has deprecated `verifyBuyer()` (`tokenize()` now runs buyer
   * verification itself), so new integrations should leave this unset; it is
   * kept for integrations that still send one.
   */
  verificationToken?: string;
}

/**
 * Pricing options for an order. Controls automatic application of discounts
 * (pricing rules) and taxes.
 */
export interface OrderPricingOptions {
  /**
   * Apply catalog pricing rules (incl. customer-group-gated wholesale rules)
   * automatically at calculation time.
   *
   * ⚠️ **Not for subscription order templates.** Square rejects a subscription
   * template that sets this (`The order template amount must not have
   * auto_apply_discounts set to true`). For a template, carry prices explicitly
   * via each line's `basePriceMoney`, or reference discounts explicitly via the
   * order's `discounts` — either keeps the amount well-defined without
   * auto-application.
   */
  autoApplyDiscounts?: boolean;
  /**
   * Apply all enabled taxes at the location automatically.
   */
  autoApplyTaxes?: boolean;
}

/**
 * Discount type. `FIXED_*` uses the exact `percentage`/`amountMoney` given;
 * `VARIABLE_*` is resolved from the referenced catalog discount.
 */
export type OrderDiscountType =
  | 'FIXED_PERCENTAGE'
  | 'FIXED_AMOUNT'
  | 'VARIABLE_PERCENTAGE'
  | 'VARIABLE_AMOUNT';

/**
 * Whether a discount applies to the whole order or to specific line items.
 */
export type OrderDiscountScope = 'ORDER' | 'LINE_ITEM';

/**
 * An order discount. Reference an existing `CatalogDiscount` by
 * `catalogObjectId` (keeps the catalog authoritative — the price tracks the
 * rule), or define an ad-hoc discount inline with `type` + `percentage`/`amountMoney`.
 *
 * @see https://developer.squareup.com/docs/orders-api/discounts
 */
export interface OrderDiscountInput {
  /** Client-side id; reference it from a line item's `appliedDiscounts`. */
  uid?: string;
  /** Reference an existing `CatalogDiscount` by id. */
  catalogObjectId?: string;
  name?: string;
  type?: OrderDiscountType;
  /** Percentage as a string, e.g. `"7.25"` (for percentage types). */
  percentage?: string;
  /** Fixed amount (for amount types). */
  amountMoney?: { amount: bigint | number; currency: CurrencyCode };
  /**
   * `ORDER` applies to the whole order (Square auto-applies to every line);
   * `LINE_ITEM` applies only to lines that list this discount's `uid` in their
   * `appliedDiscounts`.
   */
  scope?: OrderDiscountScope;
}

/**
 * Create order options
 */
export interface CreateOrderOptions {
  lineItems: LineItemInput[];
  customerId?: string;
  referenceId?: string;
  /**
   * Order-level and line-level discounts. Reference `CatalogDiscount` ids to
   * keep pricing authoritative (the number tracks the catalog rather than being
   * copied into the order). For a subscription order template, carry discounts
   * (or explicit `basePriceMoney`) here rather than relying on
   * `pricingOptions.autoApplyDiscounts` — see {@link OrderPricingOptions}.
   */
  discounts?: OrderDiscountInput[];
  /**
   * Order state. Use `'DRAFT'` when creating an order template that will back
   * a subscription phase (`subscriptions.create({ phases: [...] })`).
   */
  state?: 'DRAFT' | 'OPEN';
  pricingOptions?: OrderPricingOptions;
  /**
   * Override the client's default location for this order.
   */
  locationId?: string;
  idempotencyKey?: string;
}

/**
 * One fulfillment to change in `orders.update()`, matched on its `uid`.
 *
 * Moving a `SHIPMENT` fulfillment to `COMPLETED` marks it shipped; Square stamps
 * `shipmentDetails.shippedAt` itself, so it isn't settable here.
 */
export interface UpdateOrderFulfillmentInput {
  /** The `uid` of a fulfillment already on the order. */
  uid: string;
  state?: import('square').FulfillmentState;
  /** Writable shipment fields; only the ones you set are sent. */
  shipmentDetails?: {
    carrier?: string;
    shippingType?: string;
    shippingNote?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    /** RFC 3339 timestamp. */
    expectedShippedAt?: string;
  };
}

/**
 * Options for `orders.update()`. Square applies them as a sparse update: only
 * the fields you set change.
 */
export interface UpdateOrderOptions {
  /**
   * The order's current version. Square rejects a stale one, which is how a
   * concurrent change is detected.
   */
  version: number;
  referenceId?: string;
  /** Order state, e.g. `'CANCELED'` to cancel an open order or DRAFT template. */
  state?: import('square').OrderState;
  /** Fulfillments to change, each matched on `uid`. */
  fulfillments?: UpdateOrderFulfillmentInput[];
  /**
   * Fields to remove, as Square dot paths, e.g.
   * `'fulfillments[FULFILLMENT_UID].shipment_details.tracking_url'`.
   */
  fieldsToClear?: string[];
  /**
   * Reuse it only when resending the identical request; a retry with a new
   * `version` needs a new key.
   */
  idempotencyKey?: string;
}

/**
 * Re-export Square SDK types for SearchOrders
 */
export type {
  SearchOrdersQuery,
  SearchOrdersFilter,
  SearchOrdersSort,
  SearchOrdersDateTimeFilter,
  SearchOrdersStateFilter,
  SearchOrdersFulfillmentFilter,
  SearchOrdersSourceFilter,
  SearchOrdersCustomerFilter,
  TimeRange,
  OrderState,
  FulfillmentType,
  FulfillmentState,
  SearchOrdersSortField,
  SortOrder,
} from 'square';

/**
 * Search orders options
 */
export interface SearchOrdersOptions {
  locationIds?: string[];
  cursor?: string;
  limit?: number;
  query?: import('square').SearchOrdersQuery;
}

/**
 * Simplified options for searching recent orders
 */
export interface SearchRecentOrdersOptions {
  locationIds?: string[];
  states?: import('square').OrderState[];
  since?: Date;
  until?: Date;
  limit?: number;
  cursor?: string;
}

/**
 * Re-export of the Square SDK `Address` type, used for card billing addresses.
 */
export type { Address } from 'square';

/**
 * A card on file, as the Cards API returns it.
 */
export interface Card {
  id?: string;
  /** For example `VISA`, `MASTERCARD` or `AMERICAN_EXPRESS`. */
  cardBrand?: string;
  last4?: string;
  expMonth?: bigint | null;
  expYear?: bigint | null;
  cardholderName?: string | null;
  billingAddress?: import('square').Address;
  /** Identifies the card number across customers and merchants. */
  fingerprint?: string;
  customerId?: string | null;
  merchantId?: string;
  referenceId?: string | null;
  /** `false` once the card is disabled; a disabled card cannot be charged. */
  enabled?: boolean;
  /** `CREDIT`, `DEBIT` or `UNKNOWN_CARD_TYPE`. */
  cardType?: string;
  /** `PREPAID`, `NOT_PREPAID` or `UNKNOWN_PREPAID_TYPE`. */
  prepaidType?: string;
  bin?: string;
  createdAt?: string;
  disabledAt?: string;
  version?: bigint;
}

/**
 * Options for `cards.create()`: store a card on file for a customer.
 */
export interface CreateCardOptions {
  /**
   * The card to store: a card nonce from the Web Payments SDK, or the ID of a
   * payment made with the card.
   */
  sourceId: string;
  /** The customer the card belongs to. */
  customerId: string;
  /**
   * Required. Square stores the card once per key, so a retry with the same
   * key cannot create a second card. At most 45 characters.
   */
  idempotencyKey: string;
  cardholderName?: string;
  billingAddress?: import('square').Address;
  /** Your own ID for the card, for example a user ID. */
  referenceId?: string;
}

/**
 * Options for `cards.list()`.
 */
export interface ListCardsOptions {
  /** Only the cards of this customer. By default, every card of the merchant. */
  customerId?: string;
  /** Include disabled cards. Default `false`. */
  includeDisabled?: boolean;
  /** The `cursor` from a previous page. */
  cursor?: string;
}

/**
 * A refund of a payment, as the Refunds API returns it.
 */
export interface PaymentRefund {
  id: string;
  /** `PENDING`, `COMPLETED`, `REJECTED` or `FAILED`. */
  status?: string | null;
  locationId?: string | null;
  amountMoney: { amount?: bigint | null; currency?: string };
  paymentId?: string | null;
  orderId?: string | null;
  reason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Options for `refunds.refundPayment()`.
 */
export interface RefundPaymentOptions {
  /** The payment to refund. */
  paymentId: string;
  /**
   * How much to refund, in the smallest currency unit (cents). At most the
   * payment total minus what is already refunded. `currency` defaults to the
   * client's `defaultCurrency` and must match the payment's.
   */
  amountMoney: { amount: number | bigint; currency?: CurrencyCode };
  /**
   * Required. Square refunds once per key, so a retry with the same key cannot
   * refund twice. At most 45 characters.
   */
  idempotencyKey: string;
  /** Why the payment is refunded, shown to the seller. */
  reason?: string;
}

/**
 * Options for `refunds.list()`.
 */
export interface ListRefundsOptions {
  /** Only refunds created at or after this time (RFC 3339). Default: one year ago. */
  beginTime?: string;
  /** Only refunds created before this time (RFC 3339). Default: now. */
  endTime?: string;
  /** Order by creation time. Default `DESC` (newest first). */
  sortOrder?: 'ASC' | 'DESC';
  /** Only refunds at this location. Default: every location. */
  locationId?: string;
  /** Only refunds with this status, for example `COMPLETED`. */
  status?: string;
  /** Only refunds of payments with this source type, for example `CARD`. */
  sourceType?: string;
  /** Page size (Square caps it at 100). */
  limit?: number;
  /** The `cursor` from a previous page. */
  cursor?: string;
}
