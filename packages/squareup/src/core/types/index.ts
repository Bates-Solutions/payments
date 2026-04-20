/**
 * Square environment configuration
 */
export type SquareEnvironment = 'sandbox' | 'production';

/**
 * Currency codes supported by Square
 */
export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD' | 'JPY';

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
  idempotencyKey?: string;
}

/**
 * Pricing options for an order. Controls automatic application of discounts
 * (pricing rules) and taxes.
 */
export interface OrderPricingOptions {
  /**
   * Apply catalog pricing rules (incl. customer-group-gated wholesale rules)
   * automatically at calculation time. Required for order templates that back
   * subscriptions with per-retailer wholesale pricing.
   */
  autoApplyDiscounts?: boolean;
  /**
   * Apply all enabled taxes at the location automatically.
   */
  autoApplyTaxes?: boolean;
}

/**
 * Create order options
 */
export interface CreateOrderOptions {
  lineItems: LineItemInput[];
  customerId?: string;
  referenceId?: string;
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
