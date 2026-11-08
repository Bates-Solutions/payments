import type { CloverHttp } from '../http.js';
import type { PaginatedResponse, PaginationOptions } from '../types/index.js';
import { parseCloverError, CloverValidationError } from '../errors.js';

/**
 * Related data Clover can embed in an order response (`expand`).
 *
 * Any other string is also accepted so new Clover expansions work without a
 * library update.
 */
export type OrderExpand =
  | 'lineItems'
  | 'lineItems.discounts'
  | 'lineItems.modifications'
  | 'payments'
  | 'payment.tender'
  | 'payment.cardTransaction'
  | 'refunds'
  | 'credits'
  | 'voids'
  | 'employee'
  | 'customers'
  | 'discounts'
  | 'serviceCharge'
  | 'orderType'
  // Preserves autocomplete for the names above while accepting any string.
  | (string & {});

/**
 * Payment state of an order.
 */
export type OrderPaymentState =
  | 'OPEN'
  | 'PAID'
  | 'REFUNDED'
  | 'CREDITED'
  | 'PARTIALLY_PAID'
  | 'PARTIALLY_REFUNDED';

/**
 * A line item on a Clover order.
 */
export interface LineItem {
  id?: string;
  /** The inventory item this line was rung up from. Absent for custom items. */
  item?: { id: string };
  name?: string;
  alternateName?: string;
  /** Unit price in cents */
  price?: number;
  /** Price in cents including modifiers (reporting only) */
  priceWithModifiers?: number;
  /**
   * Quantity for `PER_UNIT` items as a fixed-point integer scaled by 1000
   * (`2500` is 2.5 `unitName`). Absent for other items: Clover adds one line
   * item per unit sold, so count the lines instead.
   */
  unitQty?: number;
  /** Unit name (e.g. `oz`, `lb`) for `PER_UNIT` items */
  unitName?: string;
  itemCode?: string;
  note?: string;
  printed?: boolean;
  exchanged?: boolean;
  refunded?: boolean;
  isRevenue?: boolean;
  /** Fixed discount in cents */
  discountAmount?: number;
  /** Created, in milliseconds since the epoch */
  createdTime?: number;
  orderClientCreatedTime?: number;
}

/**
 * A Clover Platform order (`/v3/merchants/{mId}/orders`).
 */
export interface Order {
  id?: string;
  /** ISO 4217 currency code */
  currency?: string;
  /** Total in cents */
  total?: number;
  unpaidBalance?: number;
  /** Order state, e.g. `open` or `locked` */
  state?: string;
  paymentState?: OrderPaymentState;
  payType?: 'SPLIT_GUEST' | 'SPLIT_ITEM' | 'SPLIT_CUSTOM' | 'FULL';
  title?: string;
  note?: string;
  externalReferenceId?: string;
  employee?: { id: string };
  customers?: { id: string }[];
  /**
   * Present when requested with `expand: ['lineItems']`. Always an array:
   * Clover's `{ elements: [...] }` envelope is unwrapped.
   */
  lineItems?: LineItem[];
  manualTransaction?: boolean;
  testMode?: boolean;
  /** Created on Clover's servers, in milliseconds since the epoch */
  createdTime?: number;
  /** Created on the device, in milliseconds since the epoch */
  clientCreatedTime?: number;
  modifiedTime?: number;
}

/**
 * Options for `orders.list()`.
 */
export interface ListOrdersOptions extends PaginationOptions {
  /** Only orders created at or after this time (`Date` or epoch milliseconds) */
  createdTimeFrom?: Date | number;
  /** Only orders created before this time (`Date` or epoch milliseconds) */
  createdTimeTo?: Date | number;
  /** Only orders in this state, e.g. `locked` */
  state?: string;
  /**
   * Extra raw Clover filters, each `field<op>value`, e.g. `['total>1000']`.
   * Combined with AND with the options above.
   *
   * @see https://docs.clover.com/docs/applying-filters
   */
  filter?: string[];
  /** Related data to embed, e.g. `['lineItems']` */
  expand?: OrderExpand[];
}

/**
 * Options for `orders.get()`.
 */
export interface GetOrderOptions {
  /** Related data to embed, e.g. `['lineItems']` */
  expand?: OrderExpand[];
}

/**
 * Clover Platform list envelope (`{ elements, href }`).
 */
interface CloverListResponse<T> {
  elements?: T[];
}

/** An order as Clover sends it: expanded collections arrive in an envelope. */
type RawOrder = Omit<Order, 'lineItems'> & {
  lineItems?: LineItem[] | CloverListResponse<LineItem>;
};

function normalizeOrder(raw: RawOrder): Order {
  const { lineItems, ...rest } = raw;
  if (lineItems === undefined) {
    return rest;
  }
  return { ...rest, lineItems: Array.isArray(lineItems) ? lineItems : (lineItems.elements ?? []) };
}

function toEpochMs(value: Date | number, field: string): number {
  const ms = value instanceof Date ? value.getTime() : value;
  if (!Number.isInteger(ms) || ms < 0) {
    throw new CloverValidationError(`${field} must be a valid Date or epoch milliseconds`, field);
  }
  return ms;
}

function expandParam(expand?: OrderExpand[]): string | undefined {
  return expand && expand.length > 0 ? expand.join(',') : undefined;
}

/**
 * Orders service wrapping Clover's Platform
 * [orders](https://docs.clover.com/dev/reference/ordergetorders) API
 * (`/v3/merchants/{mId}/orders`). Read only for now.
 *
 * Requires a `merchantId` on the client.
 *
 * @example
 * ```typescript
 * const { data: orders } = await clover.orders.list({
 *   createdTimeFrom: new Date('2026-10-01'),
 *   createdTimeTo: new Date('2026-11-01'),
 *   expand: ['lineItems'],
 * });
 * ```
 */
export class OrdersService {
  constructor(private readonly http: CloverHttp) {}

  private basePath(): string {
    const merchantId = this.http.merchantId;
    if (!merchantId) {
      throw new CloverValidationError(
        'merchantId is required for order operations. Set it in the client config.',
        'merchantId'
      );
    }
    return `/v3/merchants/${encodeURIComponent(merchantId)}/orders`;
  }

  /**
   * List orders with offset-based pagination, optionally in a creation time
   * window and with line items.
   *
   * Clover returns at most 90 days of orders per request when filtering on
   * `createdTime` or `state`, so page longer periods in windows of 90 days or
   * less.
   *
   * @throws {CloverValidationError} When a time is invalid or
   *   `createdTimeFrom` is not before `createdTimeTo`
   *
   * @example
   * ```typescript
   * const { data } = await clover.orders.list({
   *   createdTimeFrom: Date.now() - 7 * 24 * 60 * 60 * 1000,
   *   expand: ['lineItems'],
   *   limit: 100,
   * });
   * for (const order of data) {
   *   for (const line of order.lineItems ?? []) console.log(line.item?.id, line.price);
   * }
   * ```
   */
  async list(options?: ListOrdersOptions): Promise<PaginatedResponse<Order>> {
    const filter: string[] = [];
    const from =
      options?.createdTimeFrom === undefined
        ? undefined
        : toEpochMs(options.createdTimeFrom, 'createdTimeFrom');
    const to =
      options?.createdTimeTo === undefined
        ? undefined
        : toEpochMs(options.createdTimeTo, 'createdTimeTo');
    if (from !== undefined && to !== undefined && from >= to) {
      throw new CloverValidationError(
        'createdTimeFrom must be before createdTimeTo',
        'createdTimeFrom'
      );
    }
    if (from !== undefined) filter.push(`createdTime>=${String(from)}`);
    if (to !== undefined) filter.push(`createdTime<${String(to)}`);
    if (options?.state) filter.push(`state=${options.state}`);
    filter.push(...(options?.filter ?? []));

    try {
      const response = await this.http.request<CloverListResponse<RawOrder>>(
        'platform',
        'GET',
        this.basePath(),
        {
          query: {
            filter,
            expand: expandParam(options?.expand),
            limit: options?.limit,
            offset: options?.offset,
          },
        }
      );
      return { data: (response.elements ?? []).map(normalizeOrder) };
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Retrieve an order by ID.
   *
   * @example
   * ```typescript
   * const order = await clover.orders.get('ORDER_1', { expand: ['lineItems'] });
   * ```
   */
  async get(orderId: string, options?: GetOrderOptions): Promise<Order> {
    if (!orderId) {
      throw new CloverValidationError('orderId is required', 'orderId');
    }

    try {
      const order = await this.http.request<RawOrder>(
        'platform',
        'GET',
        `${this.basePath()}/${encodeURIComponent(orderId)}`,
        { query: { expand: expandParam(options?.expand) } }
      );
      return normalizeOrder(order);
    } catch (error) {
      throw parseCloverError(error);
    }
  }
}
