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
 * Create order options
 */
export interface CreateOrderOptions {
  lineItems: LineItemInput[];
  customerId?: string;
  referenceId?: string;
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
