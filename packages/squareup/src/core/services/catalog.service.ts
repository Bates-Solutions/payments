import type { SquareClient, CatalogObject as SquareCatalogObject } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';
import type { CurrencyCode } from '../types/index.js';

/**
 * Catalog item type
 */
export type CatalogObjectType =
  | 'ITEM'
  | 'ITEM_VARIATION'
  | 'CATEGORY'
  | 'DISCOUNT'
  | 'TAX'
  | 'MODIFIER'
  | 'MODIFIER_LIST'
  | 'IMAGE'
  | 'CUSTOM_ATTRIBUTE_DEFINITION';

/**
 * Custom attribute value for catalog items
 */
export interface CatalogCustomAttributeValue {
  name?: string;
  stringValue?: string;
  customAttributeDefinitionId?: string;
  type?: 'STRING' | 'BOOLEAN' | 'NUMBER' | 'SELECTION';
  numberValue?: string;
  booleanValue?: boolean;
  selectionUidValues?: string[];
  key?: string;
}

/**
 * Custom attribute definition data
 */
export interface CustomAttributeDefinitionData {
  type?: 'STRING' | 'BOOLEAN' | 'NUMBER' | 'SELECTION';
  name?: string;
  description?: string;
  allowedObjectTypes?: CatalogObjectType[];
  sellerVisibility?: 'SELLER_VISIBILITY_HIDDEN' | 'SELLER_VISIBILITY_READ_WRITE_VALUES';
  appVisibility?: 'APP_VISIBILITY_HIDDEN' | 'APP_VISIBILITY_READ_ONLY' | 'APP_VISIBILITY_READ_WRITE_VALUES';
  key?: string;
}

/**
 * Catalog object from Square API
 */
export interface CatalogObject {
  type: CatalogObjectType;
  id: string;
  updatedAt?: string;
  version?: bigint;
  isDeleted?: boolean;
  presentAtAllLocations?: boolean;
  presentAtLocationIds?: string[];
  customAttributeValues?: Record<string, CatalogCustomAttributeValue>;
  itemData?: {
    name?: string;
    description?: string;
    categoryId?: string;
    variations?: CatalogObject[];
    productType?: string;
  };
  itemVariationData?: {
    itemId?: string;
    name?: string;
    sku?: string;
    priceMoney?: {
      amount?: bigint;
      currency?: string;
    };
    pricingType?: 'FIXED_PRICING' | 'VARIABLE_PRICING';
  };
  categoryData?: {
    name?: string;
  };
  discountData?: {
    name?: string;
    discountType?: 'FIXED_PERCENTAGE' | 'FIXED_AMOUNT' | 'VARIABLE_PERCENTAGE' | 'VARIABLE_AMOUNT';
    percentage?: string;
    amountMoney?: {
      amount?: bigint;
      currency?: string;
    };
  };
  taxData?: {
    name?: string;
    percentage?: string;
    inclusionType?: 'ADDITIVE' | 'INCLUSIVE';
  };
  customAttributeDefinitionData?: CustomAttributeDefinitionData;
}

/**
 * Options for creating a catalog item
 */
export interface CreateCatalogItemOptions {
  name: string;
  description?: string;
  categoryId?: string;
  variations: Array<{
    name: string;
    price: number;
    currency?: CurrencyCode;
    sku?: string;
  }>;
  idempotencyKey?: string;
}

/**
 * Options for creating a category
 */
export interface CreateCategoryOptions {
  name: string;
  idempotencyKey?: string;
}

/**
 * Options for searching the catalog
 */
export interface SearchCatalogOptions {
  objectTypes?: CatalogObjectType[];
  query?: string;
  categoryIds?: string[];
  limit?: number;
  cursor?: string;
}

/**
 * Catalog service for managing Square catalog items
 *
 * @example
 * ```typescript
 * // Create an item with variations
 * const item = await square.catalog.createItem({
 *   name: 'Coffee',
 *   variations: [
 *     { name: 'Small', price: 350 },
 *     { name: 'Large', price: 450 },
 *   ],
 * });
 *
 * // Search items
 * const results = await square.catalog.search({
 *   objectTypes: ['ITEM'],
 *   query: 'coffee',
 * });
 * ```
 */
export class CatalogService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Create a catalog item with variations
   *
   * @param options - Item creation options
   * @returns Created catalog object
   *
   * @example
   * ```typescript
   * const item = await square.catalog.createItem({
   *   name: 'Latte',
   *   description: 'Espresso with steamed milk',
   *   variations: [
   *     { name: 'Small', price: 400, sku: 'LATTE-S' },
   *     { name: 'Medium', price: 500, sku: 'LATTE-M' },
   *     { name: 'Large', price: 600, sku: 'LATTE-L' },
   *   ],
   * });
   * ```
   */
  async createItem(options: CreateCatalogItemOptions): Promise<CatalogObject> {
    if (!options.name) {
      throw new SquareValidationError('Item name is required', 'name');
    }
    if (options.variations.length === 0) {
      throw new SquareValidationError('At least one variation is required', 'variations');
    }

    const itemId = `#item_${String(Date.now())}`;

    try {
      const response = await this.client.catalog.object.upsert({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        object: {
          type: 'ITEM',
          id: itemId,
          itemData: {
            name: options.name,
            description: options.description,
            categoryId: options.categoryId,
            variations: options.variations.map((v, i) => ({
              type: 'ITEM_VARIATION' as const,
              id: `#variation_${String(Date.now())}_${String(i)}`,
              itemVariationData: {
                itemId,
                name: v.name,
                sku: v.sku,
                pricingType: 'FIXED_PRICING' as const,
                priceMoney: {
                  amount: BigInt(v.price),
                  currency: v.currency ?? 'USD',
                },
              },
            })),
          },
        },
      });

      if (!response.catalogObject) {
        throw new Error('Catalog item was not created');
      }

      return response.catalogObject as CatalogObject;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Create a category
   *
   * @param options - Category creation options
   * @returns Created category
   *
   * @example
   * ```typescript
   * const category = await square.catalog.createCategory({
   *   name: 'Beverages',
   * });
   * ```
   */
  async createCategory(options: CreateCategoryOptions): Promise<CatalogObject> {
    if (!options.name) {
      throw new SquareValidationError('Category name is required', 'name');
    }

    try {
      const response = await this.client.catalog.object.upsert({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        object: {
          type: 'CATEGORY',
          id: `#category_${String(Date.now())}`,
          categoryData: {
            name: options.name,
          },
        },
      });

      if (!response.catalogObject) {
        throw new Error('Category was not created');
      }

      return response.catalogObject as CatalogObject;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Upsert (create or update) a catalog object
   *
   * @param catalogObject - The catalog object to upsert
   * @param idempotencyKey - Optional idempotency key
   * @returns The upserted catalog object
   *
   * @example
   * ```typescript
   * // Update an existing item's custom attributes
   * const updatedItem = await square.catalog.upsert({
   *   type: 'ITEM',
   *   id: 'EXISTING_ITEM_ID',
   *   version: existingItem.version,
   *   customAttributeValues: {
   *     'Square:some-key': { stringValue: 'new value' }
   *   },
   *   itemData: existingItem.itemData,
   * });
   *
   * // Update a variation price
   * const updatedVariation = await square.catalog.upsert({
   *   type: 'ITEM_VARIATION',
   *   id: 'EXISTING_VARIATION_ID',
   *   version: existingVariation.version,
   *   itemVariationData: {
   *     ...existingVariation.itemVariationData,
   *     priceMoney: { amount: BigInt(500), currency: 'USD' },
   *   },
   * });
   * ```
   */
  async upsert(
    catalogObject: CatalogObject,
    idempotencyKey?: string
  ): Promise<CatalogObject> {
    try {
      const response = await this.client.catalog.object.upsert({
        idempotencyKey: idempotencyKey ?? createIdempotencyKey(),
        object: catalogObject as unknown as SquareCatalogObject,
      });

      if (!response.catalogObject) {
        throw new Error('Catalog object was not upserted');
      }

      return response.catalogObject as CatalogObject;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a catalog object by ID
   *
   * @param objectId - Catalog object ID
   * @returns Catalog object
   *
   * @example
   * ```typescript
   * const item = await square.catalog.get('ITEM_123');
   * ```
   */
  async get(objectId: string): Promise<CatalogObject> {
    try {
      const response = await this.client.catalog.object.get({
        objectId,
        includeRelatedObjects: true,
      });

      if (!response.object) {
        throw new Error('Catalog object not found');
      }

      return response.object as CatalogObject;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a catalog object
   *
   * @param objectId - Catalog object ID to delete
   *
   * @example
   * ```typescript
   * await square.catalog.delete('ITEM_123');
   * ```
   */
  async delete(objectId: string): Promise<void> {
    try {
      await this.client.catalog.object.delete({ objectId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search the catalog
   *
   * @param options - Search options
   * @returns Matching catalog objects with pagination
   *
   * @example
   * ```typescript
   * // Search for items
   * const results = await square.catalog.search({
   *   objectTypes: ['ITEM'],
   *   query: 'coffee',
   * });
   *
   * // Get all categories
   * const categories = await square.catalog.search({
   *   objectTypes: ['CATEGORY'],
   * });
   * ```
   */
  async search(
    options?: SearchCatalogOptions
  ): Promise<{ data: CatalogObject[]; cursor?: string }> {
    try {
      const response = await this.client.catalog.search({
        cursor: options?.cursor,
        limit: options?.limit,
        objectTypes: options?.objectTypes,
        query: options?.query
          ? {
              textQuery: {
                keywords: [options.query],
              },
            }
          : undefined,
      });

      return {
        data: (response.objects ?? []) as CatalogObject[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List all catalog objects of a specific type
   *
   * @param objectType - Type of objects to list
   * @param options - List options
   * @returns Array of catalog objects
   *
   * @example
   * ```typescript
   * const items = await square.catalog.list('ITEM', { limit: 50 });
   * ```
   */
  async list(
    objectType: CatalogObjectType,
    options?: { limit?: number }
  ): Promise<CatalogObject[]> {
    try {
      const objects: CatalogObject[] = [];
      const limit = options?.limit ?? 100;

      const page = await this.client.catalog.list({
        types: objectType,
      });

      for await (const obj of page) {
        objects.push(obj as CatalogObject);
        if (objects.length >= limit) {
          break;
        }
      }

      return objects;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Batch retrieve multiple catalog objects
   *
   * @param objectIds - Array of object IDs to retrieve
   * @returns Array of catalog objects
   *
   * @example
   * ```typescript
   * const items = await square.catalog.batchGet(['ITEM_1', 'ITEM_2', 'ITEM_3']);
   * ```
   */
  async batchGet(objectIds: string[]): Promise<CatalogObject[]> {
    if (objectIds.length === 0) {
      return [];
    }

    try {
      const response = await this.client.catalog.batchGet({
        objectIds,
        includeRelatedObjects: true,
      });

      return (response.objects ?? []) as CatalogObject[];
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
