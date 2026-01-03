import type { SquareClient } from 'square';
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
 * Inventory change for adjustments
 */
export interface InventoryChange {
  type: 'PHYSICAL_COUNT' | 'ADJUSTMENT' | 'TRANSFER';
  physicalCount?: {
    catalogObjectId: string;
    state: InventoryState;
    locationId: string;
    quantity: string;
    occurredAt?: string;
  };
  adjustment?: {
    catalogObjectId: string;
    fromState?: InventoryState;
    toState: InventoryState;
    locationId: string;
    quantity: string;
    occurredAt?: string;
  };
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
              locationId,
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
            type: 'TRANSFER',
            transfer: {
              catalogObjectId: options.catalogObjectId,
              fromLocationId: options.fromLocationId,
              toLocationId: options.toLocationId,
              state: 'IN_STOCK',
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
   *       locationId: 'LXXX',
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

    try {
      const response = await this.client.inventory.batchCreateChanges({
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
        changes: changes as Parameters<
          typeof this.client.inventory.batchCreateChanges
        >[0]['changes'],
      });

      return (response.counts ?? []) as InventoryCount[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
