import type { CloverHttp } from '../http.js';
import type { PaginatedResponse, PaginationOptions } from '../types/index.js';
import { parseCloverError, CloverValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * How an item is priced. `PER_UNIT` items are sold by weight or measure
 * (`unitName`), `VARIABLE` items get their price at the register.
 */
export type ItemPriceType = 'FIXED' | 'VARIABLE' | 'PER_UNIT';

/**
 * Related data Clover can embed in an item response (`expand`).
 *
 * Any other string is also accepted so new Clover expansions work without a
 * library update.
 */
export type ItemExpand =
  | 'tags'
  | 'categories'
  | 'taxRates'
  | 'modifierGroups'
  | 'itemStock'
  | 'options'
  | 'ageRestricted'
  // Preserves autocomplete for the names above while accepting any string.
  | (string & {});

/**
 * Stock level of an item (`/v3/merchants/{mId}/item_stocks/{itemId}`).
 */
export interface ItemStock {
  /** The item this stock belongs to */
  item?: { id: string };
  /** Current count in stock. Can be fractional for `PER_UNIT` items. */
  quantity?: number;
  /** @deprecated Clover deprecated this in favour of `quantity`. */
  stockCount?: number;
  /** Low stock alert threshold (only when the merchant uses low stock alerts) */
  stockAlertThreshold?: number;
  /** Last modified, in milliseconds since the epoch */
  modifiedTime?: number;
}

/**
 * A Clover inventory item (`/v3/merchants/{mId}/items`).
 */
export interface Item {
  id?: string;
  name?: string;
  alternateName?: string;
  /** Product code such as a UPC or EAN barcode. Searchable with `findItemsByCode()`. */
  code?: string;
  /** Stock keeping unit. Searchable with `findItemsByCode()`. */
  sku?: string;
  /** Price in cents */
  price?: number;
  priceType?: ItemPriceType;
  /** The merchant's cost in cents */
  cost?: number;
  /** Unit of measure for `PER_UNIT` items, e.g. `lb` */
  unitName?: string;
  /** Hidden in the Register app */
  hidden?: boolean;
  /** Sellable on all channels */
  available?: boolean;
  /** Availability managed automatically from stock */
  autoManage?: boolean;
  isRevenue?: boolean;
  defaultTaxRates?: boolean;
  /** Present when requested with `expand: ['itemStock']` */
  itemStock?: ItemStock;
  /** @deprecated Clover deprecated this in favour of `itemStock.quantity`. */
  stockCount?: number;
  tags?: { id: string; name?: string }[];
  categories?: { id: string; name?: string }[];
  /** Last modified, in milliseconds since the epoch */
  modifiedTime?: number;
  deletedTime?: number;
}

/**
 * Options for `inventory.listItems()`.
 */
export interface ListItemsOptions extends PaginationOptions {
  /**
   * Raw Clover filters, each `field<op>value`, e.g. `['sku=PICKLE-1',
   * 'hidden=false']`. Several filters are combined with AND.
   *
   * @see https://docs.clover.com/docs/applying-filters
   */
  filter?: string[];
  /** Related data to embed, e.g. `['itemStock']` */
  expand?: ItemExpand[];
}

/**
 * Options for `inventory.getItem()`.
 */
export interface GetItemOptions {
  /** Related data to embed, e.g. `['itemStock']` */
  expand?: ItemExpand[];
}

/**
 * Fields you can set when creating or updating an item.
 */
export interface ItemFields {
  name?: string;
  alternateName?: string;
  /** Product code such as a UPC or EAN barcode */
  code?: string;
  sku?: string;
  /** Price in cents (integer) */
  price?: number;
  priceType?: ItemPriceType;
  /** The merchant's cost in cents (integer) */
  cost?: number;
  unitName?: string;
  hidden?: boolean;
  available?: boolean;
  isRevenue?: boolean;
}

/**
 * Options for `inventory.createItem()`. `name` and `price` are required.
 */
export interface CreateItemOptions extends ItemFields {
  name: string;
  /** Price in cents (integer) */
  price: number;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Options for `inventory.updateItem()`. Give at least one field.
 *
 * Stock is not changed here; use `inventory.updateItemStock()`.
 */
export interface UpdateItemOptions extends ItemFields {
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Codes to look up with `inventory.findItemsByCode()`. Give either list, or
 * both.
 */
export interface FindItemsByCodeOptions {
  /** Product codes (UPC / EAN barcodes), matched against the item `code` */
  codes?: string[];
  /** SKUs, matched against the item `sku` */
  skus?: string[];
  /** Related data to embed in each item, e.g. `['itemStock']` */
  expand?: ItemExpand[];
}

/**
 * Options for `inventory.updateItemStock()`.
 */
export interface UpdateItemStockOptions {
  /** New stock count. Replaces the current quantity; it is not added to it. */
  quantity: number;
  /** Idempotency key (defaults to a generated UUID) */
  idempotencyKey?: string;
}

/**
 * Clover Platform list envelope (`{ elements, href }`).
 */
interface CloverListResponse<T> {
  elements?: T[];
}

/** Clover's maximum page size for `GET /items`. */
const MAX_PAGE_SIZE = 1000;

const ITEM_FIELDS: readonly (keyof ItemFields)[] = [
  'name',
  'alternateName',
  'code',
  'sku',
  'price',
  'priceType',
  'cost',
  'unitName',
  'hidden',
  'available',
  'isRevenue',
];

function toItemBody(options: ItemFields): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const field of ITEM_FIELDS) {
    if (options[field] !== undefined) {
      body[field] = options[field];
    }
  }
  return body;
}

function validateCents(value: number | undefined, field: string): void {
  if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
    throw new CloverValidationError(`${field} must be a non-negative integer (cents)`, field);
  }
}

function requireId(value: string, field: string): void {
  if (!value) {
    throw new CloverValidationError(`${field} is required`, field);
  }
}

function expandParam(expand?: ItemExpand[]): string | undefined {
  return expand && expand.length > 0 ? expand.join(',') : undefined;
}

/**
 * Inventory service wrapping Clover's Platform
 * [inventory](https://docs.clover.com/dev/reference/inventorygetitems) API:
 * items (`/v3/merchants/{mId}/items`) and their stock
 * (`/v3/merchants/{mId}/item_stocks`).
 *
 * Requires a `merchantId` on the client.
 *
 * @example
 * ```typescript
 * const [item] = await clover.inventory.findItemsByCode({
 *   codes: ['012345678905'],
 *   expand: ['itemStock'],
 * });
 * console.log(item?.name, item?.itemStock?.quantity);
 * ```
 */
export class InventoryService {
  constructor(private readonly http: CloverHttp) {}

  private merchantPath(): string {
    const merchantId = this.http.merchantId;
    if (!merchantId) {
      throw new CloverValidationError(
        'merchantId is required for inventory operations. Set it in the client config.',
        'merchantId'
      );
    }
    return `/v3/merchants/${encodeURIComponent(merchantId)}`;
  }

  private itemPath(itemId: string): string {
    requireId(itemId, 'itemId');
    return `${this.merchantPath()}/items/${encodeURIComponent(itemId)}`;
  }

  private stockPath(itemId: string): string {
    requireId(itemId, 'itemId');
    return `${this.merchantPath()}/item_stocks/${encodeURIComponent(itemId)}`;
  }

  /**
   * List items with offset-based pagination (Clover allows up to 1000 per
   * page). Use `filter` to narrow the list and `expand: ['itemStock']` to get
   * stock levels in the same call.
   *
   * @example
   * ```typescript
   * const { data } = await clover.inventory.listItems({
   *   filter: ['hidden=false'],
   *   expand: ['itemStock'],
   *   limit: 100,
   * });
   * ```
   */
  async listItems(options?: ListItemsOptions): Promise<PaginatedResponse<Item>> {
    try {
      const response = await this.http.request<CloverListResponse<Item>>(
        'platform',
        'GET',
        `${this.merchantPath()}/items`,
        {
          query: {
            filter: options?.filter,
            expand: expandParam(options?.expand),
            limit: options?.limit,
            offset: options?.offset,
          },
        }
      );
      return { data: response.elements ?? [] };
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Retrieve an item by ID.
   */
  async getItem(itemId: string, options?: GetItemOptions): Promise<Item> {
    try {
      return await this.http.request<Item>('platform', 'GET', this.itemPath(itemId), {
        query: { expand: expandParam(options?.expand) },
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Find items by product code (UPC / EAN barcode) or SKU, without listing
   * the whole inventory. Pages through every match and returns each item
   * once, even if it matches several codes.
   *
   * Codes are passed to Clover as exact-match filters and are not normalized:
   * a UPC-A `012345678905` won't find the same barcode stored as EAN-13
   * `0012345678905`. Pass both forms if the inventory may hold either.
   *
   * Makes one request per code (more for codes with over 1000 matches).
   *
   * @example
   * ```typescript
   * const items = await clover.inventory.findItemsByCode({
   *   codes: ['012345678905'],
   *   skus: ['PICKLE-DILL-500'],
   *   expand: ['itemStock'],
   * });
   * ```
   */
  async findItemsByCode(options: FindItemsByCodeOptions): Promise<Item[]> {
    const clean = (values?: string[]) => [
      ...new Set((values ?? []).map((v) => v.trim()).filter(Boolean)),
    ];
    // Clover's filter field for the item `code` property is `itemCode`.
    const filters = [
      ...clean(options.codes).map((code) => `itemCode=${code}`),
      ...clean(options.skus).map((sku) => `sku=${sku}`),
    ];
    if (filters.length === 0) {
      throw new CloverValidationError('Give at least one code or SKU', 'codes');
    }

    const items = new Map<string, Item>();
    const unkeyed: Item[] = [];
    const path = `${this.merchantPath()}/items`;
    const expand = expandParam(options.expand);

    try {
      for (const filter of filters) {
        let offset = 0;
        let page: Item[];
        do {
          const response = await this.http.request<CloverListResponse<Item>>('platform', 'GET', path, {
            query: { filter: [filter], expand, limit: MAX_PAGE_SIZE, offset },
          });
          page = response.elements ?? [];
          for (const item of page) {
            if (item.id) {
              items.set(item.id, item);
            } else {
              unkeyed.push(item);
            }
          }
          offset += page.length;
        } while (page.length === MAX_PAGE_SIZE);
      }

      return [...items.values(), ...unkeyed];
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Create an item.
   *
   * @throws {CloverValidationError} When `name` is empty or `price` / `cost`
   *   is not a non-negative integer number of cents
   */
  async createItem(options: CreateItemOptions): Promise<Item> {
    // The types require both; check the shape untyped input can take.
    const { name, price } = options as { name?: string; price?: number };
    if (!name?.trim()) {
      throw new CloverValidationError('name is required', 'name');
    }
    if (price === undefined) {
      throw new CloverValidationError('price is required', 'price');
    }
    validateCents(price, 'price');
    validateCents(options.cost, 'cost');

    try {
      return await this.http.request<Item>('platform', 'POST', `${this.merchantPath()}/items`, {
        body: toItemBody(options),
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Update an item. Only the fields you pass are sent. Stock is not changed
   * here; use {@link InventoryService.updateItemStock}.
   *
   * @throws {CloverValidationError} When no field is given, or `price` /
   *   `cost` is not a non-negative integer number of cents
   */
  async updateItem(itemId: string, options: UpdateItemOptions): Promise<Item> {
    const body = toItemBody(options);
    if (Object.keys(body).length === 0) {
      throw new CloverValidationError('Give at least one field to update');
    }
    if (options.name !== undefined && !options.name.trim()) {
      throw new CloverValidationError('name cannot be empty', 'name');
    }
    validateCents(options.price, 'price');
    validateCents(options.cost, 'cost');

    try {
      return await this.http.request<Item>('platform', 'POST', this.itemPath(itemId), {
        body,
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Get an item's stock level.
   *
   * @example
   * ```typescript
   * const { quantity } = await clover.inventory.getItemStock('ITEM_1');
   * ```
   */
  async getItemStock(itemId: string): Promise<ItemStock> {
    try {
      return await this.http.request<ItemStock>('platform', 'GET', this.stockPath(itemId));
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Set an item's stock level. `quantity` replaces the current count; to add
   * a delivery, read the stock first and send the new total.
   *
   * Resolves to the stock Clover returns, or to the stock you sent when
   * Clover's response has no body.
   *
   * @throws {CloverValidationError} When `quantity` is not a finite number
   *
   * @example
   * ```typescript
   * const { quantity = 0 } = await clover.inventory.getItemStock('ITEM_1');
   * await clover.inventory.updateItemStock('ITEM_1', { quantity: quantity + 24 });
   * ```
   */
  async updateItemStock(itemId: string, options: UpdateItemStockOptions): Promise<ItemStock> {
    if (typeof options.quantity !== 'number' || !Number.isFinite(options.quantity)) {
      throw new CloverValidationError('quantity must be a finite number', 'quantity');
    }

    try {
      const stock = await this.http.request<ItemStock | undefined>(
        'platform',
        'PUT',
        this.stockPath(itemId),
        {
          body: { quantity: options.quantity },
          idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        }
      );
      // Clover's reference documents no response body for this call.
      return stock ?? { item: { id: itemId }, quantity: options.quantity };
    } catch (error) {
      throw parseCloverError(error);
    }
  }
}
