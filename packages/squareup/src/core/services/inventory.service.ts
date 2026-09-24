import type { Square, SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Inventory state types
 */
export type InventoryState =
  | 'CUSTOM'
  | 'IN_STOCK'
  | 'SOLD'
  | 'RETURNED_BY_CUSTOMER'
  | 'RESERVED_FOR_SALE'
  | 'SOLD_ONLINE'
  | 'ORDERED_FROM_VENDOR'
  | 'RECEIVED_FROM_VENDOR'
  | 'IN_TRANSIT_TO'
  | 'NONE'
  | 'WASTE'
  | 'UNLINKED_RETURN'
  | 'COMPOSED'
  | 'DECOMPOSED'
  | 'SUPPORTED_BY_NEWER_VERSION';

/**
 * Inventory count from Square API
 */
export interface InventoryCount {
  catalogObjectId?: string;
  catalogObjectType?: string;
  state?: InventoryState;
  locationId?: string;
  quantity?: string;
  calculatedAt?: string;
}

/**
 * Inventory change for {@link InventoryService.batchChange}.
 *
 * Since Square API version `2026-07-15` (`square@45`), movement between
 * locations is an `ADJUSTMENT` whose `fromLocationId` and `toLocationId`
 * differ. The legacy `TRANSFER` type and `adjustment.locationId` are still
 * accepted here and converted to that shape before being sent.
 */
export interface InventoryChange {
  /** `TRANSFER` is deprecated — use an `ADJUSTMENT` with differing locations */
  type: 'PHYSICAL_COUNT' | 'ADJUSTMENT' | 'TRANSFER';
  physicalCount?: {
    catalogObjectId: string;
    state: InventoryState;
    locationId: string;
    quantity: string;
    occurredAt?: string;
  };
  /**
   * Stock adjustment. Set `fromLocationId`/`toLocationId` (equal for a
   * same-location adjustment, different for a transfer), or the deprecated
   * `locationId` as shorthand for both.
   */
  adjustment?: {
    catalogObjectId: string;
    fromState?: InventoryState;
    toState: InventoryState;
    /** @deprecated Use `fromLocationId` and `toLocationId`. Fills whichever is unset. */
    locationId?: string;
    /** Location the quantity is tracked at before the adjustment */
    fromLocationId?: string;
    /** Location the quantity is tracked at after the adjustment */
    toLocationId?: string;
    quantity: string;
    occurredAt?: string;
  };
  /**
   * @deprecated Retired by Square in API version `2026-07-15`. Sent as an
   * `ADJUSTMENT` with `fromState` = `toState` = `state`.
   */
  transfer?: {
    catalogObjectId: string;
    fromLocationId: string;
    toLocationId: string;
    state: InventoryState;
    quantity: string;
    occurredAt?: string;
  };
}

/**
 * Convert a wrapper {@link InventoryChange} to the Square SDK shape,
 * translating legacy `TRANSFER` changes and `adjustment.locationId`.
 */
function toSdkChange(change: InventoryChange): Square.InventoryChange {
  switch (change.type) {
    case 'PHYSICAL_COUNT': {
      if (!change.physicalCount) {
        throw new SquareValidationError('PHYSICAL_COUNT change requires physicalCount', 'physicalCount');
      }
      return { type: 'PHYSICAL_COUNT', physicalCount: change.physicalCount };
    }
    case 'ADJUSTMENT': {
      if (!change.adjustment) {
        throw new SquareValidationError('ADJUSTMENT change requires adjustment', 'adjustment');
      }
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- translating the legacy shape is the point
      const { locationId, ...adjustment } = change.adjustment;
      const fromLocationId = adjustment.fromLocationId ?? locationId;
      const toLocationId = adjustment.toLocationId ?? locationId;
      if (!fromLocationId || !toLocationId) {
        throw new SquareValidationError(
          'ADJUSTMENT change requires fromLocationId and toLocationId (or locationId)',
          'adjustment.toLocationId'
        );
      }
      return { type: 'ADJUSTMENT', adjustment: { ...adjustment, fromLocationId, toLocationId } };
    }
    case 'TRANSFER': {
      /* eslint-disable @typescript-eslint/no-deprecated -- translating the legacy shape is the point */
      if (!change.transfer) {
        throw new SquareValidationError('TRANSFER change requires transfer', 'transfer');
      }
      const { state, ...transfer } = change.transfer;
      /* eslint-enable @typescript-eslint/no-deprecated */
      return { type: 'ADJUSTMENT', adjustment: { ...transfer, fromState: state, toState: state } };
    }
  }
}

/**
 * Inventory service for managing Square inventory
 *
 * @example
 * ```typescript
 * // Get inventory count for an item
 * const counts = await square.inventory.getCounts('ITEM_VAR_123');
 *
 * // Adjust inventory
 * await square.inventory.adjust({
 *   catalogObjectId: 'ITEM_VAR_123',
 *   locationId: 'LXXX',
 *   quantity: 10,
 * });
 * ```
 */
export class InventoryService {
  constructor(
    private readonly client: SquareClient,
    private readonly defaultLocationId?: string
  ) {}

  /**
   * Get inventory counts for a catalog object
   *
   * @param catalogObjectId - Catalog object ID (usually item variation)
   * @param locationId - Optional location ID filter
   * @returns Array of inventory counts
   *
   * @example
   * ```typescript
   * const counts = await square.inventory.getCounts('ITEM_VAR_123');
   * console.log(`In stock: ${counts[0].quantity}`);
   * ```
   */
  async getCounts(catalogObjectId: string, locationId?: string): Promise<InventoryCount[]> {
    try {
      const counts: InventoryCount[] = [];
      const page = await this.client.inventory.get({
        catalogObjectId,
        locationIds: locationId,
      });

      for await (const count of page) {
        counts.push(count as InventoryCount);
      }

      return counts;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Batch retrieve inventory counts for multiple objects
   *
   * @param catalogObjectIds - Array of catalog object IDs
   * @param locationIds - Optional array of location IDs
   * @returns Array of inventory counts
   *
   * @example
   * ```typescript
   * const counts = await square.inventory.batchGetCounts(
   *   ['ITEM_VAR_1', 'ITEM_VAR_2'],
   *   ['LOCATION_1']
   * );
   * ```
   */
  async batchGetCounts(
    catalogObjectIds: string[],
    locationIds?: string[]
  ): Promise<InventoryCount[]> {
    if (catalogObjectIds.length === 0) {
      return [];
    }

    try {
      const counts: InventoryCount[] = [];
      const page = await this.client.inventory.batchGetCounts({
        catalogObjectIds,
        locationIds,
      });

      for await (const count of page) {
        counts.push(count as InventoryCount);
      }

      return counts;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Set the inventory count for an item (physical count)
   *
   * @param options - Physical count options
   * @returns Updated inventory counts
   *
   * @example
   * ```typescript
   * await square.inventory.setCount({
   *   catalogObjectId: 'ITEM_VAR_123',
   *   locationId: 'LXXX',
   *   quantity: 50,
   * });
   * ```
   */
  async setCount(options: {
    catalogObjectId: string;
    locationId?: string;
    quantity: number;
    occurredAt?: string;
    idempotencyKey?: string;
  }): Promise<InventoryCount[]> {
    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    try {
      const response = await this.client.inventory.batchCreateChanges({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        changes: [
          {
            type: 'PHYSICAL_COUNT',
            physicalCount: {
              catalogObjectId: options.catalogObjectId,
              state: 'IN_STOCK',
              locationId,
              quantity: String(options.quantity),
              occurredAt: options.occurredAt ?? new Date().toISOString(),
            },
          },
        ],
      });

      return (response.counts ?? []) as InventoryCount[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Adjust inventory (add or remove stock)
   *
   * @param options - Adjustment options
   * @returns Updated inventory counts
   *
   * @example
   * ```typescript
   * // Add 10 items to stock
   * await square.inventory.adjust({
   *   catalogObjectId: 'ITEM_VAR_123',
   *   locationId: 'LXXX',
   *   quantity: 10,
   * });
   *
   * // Remove 5 items (negative quantity)
   * await square.inventory.adjust({
   *   catalogObjectId: 'ITEM_VAR_123',
   *   locationId: 'LXXX',
   *   quantity: -5,
   * });
   * ```
   */
  async adjust(options: {
    catalogObjectId: string;
    locationId?: string;
    quantity: number;
    reason?: string;
    idempotencyKey?: string;
  }): Promise<InventoryCount[]> {
    const locationId = options.locationId ?? this.defaultLocationId;
    if (!locationId) {
      throw new SquareValidationError(
        'locationId is required. Set it in client config or provide it explicitly.',
        'locationId'
      );
    }

    const isAdding = options.quantity > 0;
    const absQuantity = Math.abs(options.quantity);

    try {
      const response = await this.client.inventory.batchCreateChanges({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        changes: [
          {
            type: 'ADJUSTMENT',
            adjustment: {
              catalogObjectId: options.catalogObjectId,
              fromState: isAdding ? 'NONE' : 'IN_STOCK',
              toState: isAdding ? 'IN_STOCK' : 'SOLD',
              fromLocationId: locationId,
              toLocationId: locationId,
              quantity: String(absQuantity),
              occurredAt: new Date().toISOString(),
            },
          },
        ],
      });

      return (response.counts ?? []) as InventoryCount[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Transfer inventory between locations
   *
   * @param options - Transfer options
   * @returns Updated inventory counts
   *
   * @example
   * ```typescript
   * await square.inventory.transfer({
   *   catalogObjectId: 'ITEM_VAR_123',
   *   fromLocationId: 'LOCATION_A',
   *   toLocationId: 'LOCATION_B',
   *   quantity: 5,
   * });
   * ```
   */
  async transfer(options: {
    catalogObjectId: string;
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
    idempotencyKey?: string;
  }): Promise<InventoryCount[]> {
    if (options.quantity <= 0) {
      throw new SquareValidationError('Transfer quantity must be positive', 'quantity');
    }

    try {
      const response = await this.client.inventory.batchCreateChanges({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        changes: [
          {
            type: 'ADJUSTMENT',
            adjustment: {
              catalogObjectId: options.catalogObjectId,
              fromState: 'IN_STOCK',
              toState: 'IN_STOCK',
              fromLocationId: options.fromLocationId,
              toLocationId: options.toLocationId,
              quantity: String(options.quantity),
              occurredAt: new Date().toISOString(),
            },
          },
        ],
      });

      return (response.counts ?? []) as InventoryCount[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Batch apply multiple inventory changes
   *
   * @param changes - Array of inventory changes
   * @param idempotencyKey - Optional idempotency key
   * @returns Updated inventory counts
   *
   * @example
   * ```typescript
   * await square.inventory.batchChange([
   *   {
   *     type: 'ADJUSTMENT',
   *     adjustment: {
   *       catalogObjectId: 'ITEM_1',
   *       fromState: 'NONE',
   *       toState: 'IN_STOCK',
   *       fromLocationId: 'LXXX',
   *       toLocationId: 'LXXX',
   *       quantity: '10',
   *     },
   *   },
   * ]);
   * ```
   */
  async batchChange(
    changes: InventoryChange[],
    idempotencyKey?: string
  ): Promise<InventoryCount[]> {
    if (changes.length === 0) {
      return [];
    }

    const sdkChanges = changes.map(toSdkChange);

    try {
      const response = await this.client.inventory.batchCreateChanges({
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
        changes: sdkChanges,
      });

      return (response.counts ?? []) as InventoryCount[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
