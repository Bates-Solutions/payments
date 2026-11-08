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
 * A related object embedded by `expand` (payment, refund, discount, ...).
 * Typed loosely: only `id` is common to all of them.
 */
export interface CloverObject {
  id?: string;
  [field: string]: unknown;
}

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
  /** With `expand: ['lineItems.discounts']`. Always an array (envelope unwrapped). */
  discounts?: CloverObject[];
  /** With `expand: ['lineItems.modifications']`. Always an array (envelope unwrapped). */
  modifications?: CloverObject[];
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
  /*
   * Expanded collections below are present when requested with `expand` and
   * are always arrays: Clover's `{ elements: [...] }` envelope is unwrapped.
   */
  /** With `expand: ['customers']` */
  customers?: CloverObject[];
  /** With `expand: ['lineItems']` */
  lineItems?: LineItem[];
  /** With `expand: ['payments']` */
  payments?: CloverObject[];
  /** With `expand: ['refunds']` */
  refunds?: CloverObject[];
  /** With `expand: ['credits']` */
  credits?: CloverObject[];
  /** With `expand: ['voids']` */
  voids?: CloverObject[];
  /** With `expand: ['discounts']` */
  discounts?: CloverObject[];
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
  /** Only orders in this state, e.g. `locked`. Must not be empty. */
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

/** An order or line item as Clover sends it: collections may be in an envelope. */
type RawObject = Record<string, unknown>;

/** Order fields that `expand` fills with a collection. */
const ORDER_COLLECTIONS = [
  'lineItems',
  'customers',
  'payments',
  'refunds',
  'credits',
  'voids',
  'discounts',
] as const;

/** Line item fields that `expand` (`lineItems.*`) fills with a collection. */
const LINE_ITEM_COLLECTIONS = ['discounts', 'modifications'] as const;

/** Clover's maximum page size for v3 list endpoints (the default is 100). */
const MAX_PAGE_SIZE = 1000;

/** Replace `{ elements: [...] }` envelopes on the given fields with plain arrays. */
function unwrapCollections(raw: RawObject, fields: readonly string[]): RawObject {
  const out: RawObject = { ...raw };
  for (const field of fields) {
    const value = out[field];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[field] = (value as CloverListResponse<unknown>).elements ?? [];
    }
  }
  return out;
}

function normalizeOrder(raw: RawObject): Order {
  const order = unwrapCollections(raw, ORDER_COLLECTIONS) as Order;
  if (order.lineItems) {
    order.lineItems = order.lineItems.map(
      (lineItem) => unwrapCollections(lineItem as RawObject, LINE_ITEM_COLLECTIONS) as LineItem
    );
  }
  return order;
}

function validatePaging(options?: PaginationOptions): void {
  const { limit, offset } = options ?? {};
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE)) {
    throw new CloverValidationError(
      `limit must be an integer from 1 to ${String(MAX_PAGE_SIZE)}`,
      'limit'
    );
  }
  if (offset !== undefined && (!Number.isInteger(offset) || offset < 0)) {
    throw new CloverValidationError('offset must be a non-negative integer', 'offset');
  }
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
   * window and with line items. Clover returns 100 orders per page by
   * default and at most 1000; keep requesting with a larger `offset` while
   * a page comes back full.
   *
   * Clover's reference says results are "restricted to the last 90 days"
   * when the filter includes `createdTime`, `state`, `total`, `payType`,
   * `title`, `note`, `externalReferenceId`, `deletedTime`,
   * `manualTransaction`, `cardTransaction.last4`, `testMode` or `touched`.
   * This library does not enforce or work around that (not verified against
   * a sandbox).
   *
   * @throws {CloverValidationError} When a time is invalid,
   *   `createdTimeFrom` is not before `createdTimeTo`, `state` is empty,
   *   `limit` is outside 1 to 1000, or `offset` is negative
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
    validatePaging(options);
    if (options?.state !== undefined && !options.state) {
      throw new CloverValidationError('state cannot be empty', 'state');
    }
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
    if (options?.state !== undefined) filter.push(`state=${options.state}`);
    filter.push(...(options?.filter ?? []));

    try {
      const response = await this.http.request<CloverListResponse<RawObject>>(
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
      const order = await this.http.request<RawObject>(
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
