import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { CatalogService, type CatalogObject } from '../services/catalog.service.js';
import { SquareValidationError } from '../errors.js';

// Create mock Square client
function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    catalog: {
      object: {
        upsert: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
      },
      search: vi.fn(),
      list: vi.fn(),
      batchGet: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('CatalogService', () => {
  describe('createItem', () => {
    it('should create an item with variations', async () => {
      const mockCatalogObject = { id: 'ITEM_123', type: 'ITEM' };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      const result = await service.createItem({
        name: 'Coffee',
        variations: [{ name: 'Small', price: 350 }],
      });

      expect(result).toEqual(mockCatalogObject);
    });

    it('should pass optional fields', async () => {
      const mockCatalogObject = { id: 'ITEM_123' };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      await service.createItem({
        name: 'Coffee',
        description: 'Hot coffee',
        categoryId: 'CAT_123',
        variations: [
          { name: 'Small', price: 350, sku: 'COF-S', currency: 'EUR' },
        ],
        idempotencyKey: 'custom-key',
      });

      expect(client.catalog.object.upsert).toHaveBeenCalled();
    });

    it('should throw SquareValidationError for missing name', async () => {
      const client = createMockClient();
      const service = new CatalogService(client);

      await expect(
        service.createItem({ name: '', variations: [{ name: 'Small', price: 350 }] })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for empty variations', async () => {
      const client = createMockClient();
      const service = new CatalogService(client);

      await expect(service.createItem({ name: 'Coffee', variations: [] })).rejects.toThrow(
        SquareValidationError
      );
    });

    it('should throw if item not returned', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({}),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(
        service.createItem({ name: 'Coffee', variations: [{ name: 'Small', price: 350 }] })
      ).rejects.toThrow('Catalog item was not created');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockRejectedValue({
            statusCode: 400,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
          }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(
        service.createItem({ name: 'Coffee', variations: [{ name: 'Small', price: 350 }] })
      ).rejects.toThrow();
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const mockCatalogObject = { id: 'CAT_123', type: 'CATEGORY' };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      const result = await service.createCategory({ name: 'Beverages' });

      expect(result).toEqual(mockCatalogObject);
    });

    it('should use custom idempotencyKey', async () => {
      const mockCatalogObject = { id: 'CAT_123' };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      await service.createCategory({ name: 'Beverages', idempotencyKey: 'custom-key' });

      expect(client.catalog.object.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ idempotencyKey: 'custom-key' })
      );
    });

    it('should throw SquareValidationError for missing name', async () => {
      const client = createMockClient();
      const service = new CatalogService(client);

      await expect(service.createCategory({ name: '' })).rejects.toThrow(SquareValidationError);
    });

    it('should throw if category not returned', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({}),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(service.createCategory({ name: 'Beverages' })).rejects.toThrow(
        'Category was not created'
      );
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockRejectedValue({
            statusCode: 400,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
          }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(service.createCategory({ name: 'Beverages' })).rejects.toThrow();
    });
  });

  describe('upsert', () => {
    it('should upsert a catalog object', async () => {
      const mockCatalogObject = { id: 'ITEM_123', type: 'ITEM', version: BigInt(1) };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      const result = await service.upsert({
        type: 'ITEM',
        id: 'ITEM_123',
        version: BigInt(1),
        itemData: { name: 'Updated Item' },
      });

      expect(result).toEqual(mockCatalogObject);
      expect(client.catalog.object.upsert).toHaveBeenCalled();
    });

    it('should use custom idempotency key when provided', async () => {
      const mockCatalogObject = { id: 'ITEM_123', type: 'ITEM' };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      await service.upsert(
        { type: 'ITEM', id: 'ITEM_123', itemData: { name: 'Test' } },
        'custom-idempotency-key'
      );

      expect(client.catalog.object.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ idempotencyKey: 'custom-idempotency-key' })
      );
    });

    it('should throw if catalog object not returned', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({}),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(
        service.upsert({ type: 'ITEM', id: 'ITEM_123', itemData: { name: 'Test' } })
      ).rejects.toThrow('Catalog object was not upserted');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockRejectedValue({
            statusCode: 400,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
          }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(
        service.upsert({ type: 'ITEM', id: 'ITEM_123', itemData: { name: 'Test' } })
      ).rejects.toThrow();
    });

    it('should upsert with custom attribute values', async () => {
      const mockCatalogObject = {
        id: 'ITEM_123',
        type: 'ITEM',
        customAttributeValues: {
          'Square:custom-key': { stringValue: 'custom value' },
        },
      };
      const client = createMockClient({
        object: {
          upsert: vi.fn().mockResolvedValue({ catalogObject: mockCatalogObject }),
          get: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      const result = await service.upsert({
        type: 'ITEM',
        id: 'ITEM_123',
        customAttributeValues: {
          'Square:custom-key': { stringValue: 'custom value' },
        },
        itemData: { name: 'Item with Custom Attrs' },
      });

      expect(result.customAttributeValues).toBeDefined();
      expect(result.customAttributeValues?.['Square:custom-key']?.stringValue).toBe('custom value');
    });
  });

  describe('get', () => {
    it('should get a catalog object by ID', async () => {
      const mockObject = { id: 'ITEM_123', type: 'ITEM' };
      const client = createMockClient({
        object: {
          get: vi.fn().mockResolvedValue({ object: mockObject }),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      const result = await service.get('ITEM_123');

      expect(result).toEqual(mockObject);
      expect(client.catalog.object.get).toHaveBeenCalledWith({
        objectId: 'ITEM_123',
        includeRelatedObjects: true,
      });
    });

    it('should throw if object not found', async () => {
      const client = createMockClient({
        object: {
          get: vi.fn().mockResolvedValue({}),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(service.get('ITEM_123')).rejects.toThrow('Catalog object not found');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        object: {
          get: vi.fn().mockRejectedValue({
            statusCode: 404,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
          }),
          upsert: vi.fn(),
          delete: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(service.get('ITEM_123')).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a catalog object', async () => {
      const client = createMockClient({
        object: {
          delete: vi.fn().mockResolvedValue({}),
          get: vi.fn(),
          upsert: vi.fn(),
        },
      });

      const service = new CatalogService(client);
      await service.delete('ITEM_123');

      expect(client.catalog.object.delete).toHaveBeenCalledWith({ objectId: 'ITEM_123' });
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        object: {
          delete: vi.fn().mockRejectedValue({
            statusCode: 404,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
          }),
          get: vi.fn(),
          upsert: vi.fn(),
        },
      });

      const service = new CatalogService(client);

      await expect(service.delete('ITEM_123')).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search the catalog', async () => {
      const mockObjects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ objects: mockObjects, cursor: 'next' }),
      });

      const service = new CatalogService(client);
      const result = await service.search();

      expect(result.data).toEqual(mockObjects);
      expect(result.cursor).toBe('next');
    });

    it('should search with objectTypes', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ objects: [] }),
      });

      const service = new CatalogService(client);
      await service.search({ objectTypes: ['ITEM', 'CATEGORY'] });

      expect(client.catalog.search).toHaveBeenCalledWith(
        expect.objectContaining({
          objectTypes: ['ITEM', 'CATEGORY'],
        })
      );
    });

    it('should search with text query', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ objects: [] }),
      });

      const service = new CatalogService(client);
      await service.search({ query: 'coffee' });

      expect(client.catalog.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            textQuery: {
              keywords: ['coffee'],
            },
          },
        })
      );
    });

    it('should pass cursor and limit', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ objects: [] }),
      });

      const service = new CatalogService(client);
      await service.search({ cursor: 'some_cursor', limit: 25 });

      expect(client.catalog.search).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: 'some_cursor',
          limit: 25,
        })
      );
    });

    it('should return empty array when no objects', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({}),
      });

      const service = new CatalogService(client);
      const result = await service.search();

      expect(result.data).toEqual([]);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new CatalogService(client);

      await expect(service.search()).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list catalog objects by type', async () => {
      const mockObjects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ objects: mockObjects }),
      });

      const service = new CatalogService(client);
      const result = await service.list('ITEM');

      expect(result).toEqual(mockObjects);
      expect(client.catalog.search).toHaveBeenCalledWith({
        objectTypes: ['ITEM'],
        cursor: undefined,
      });
    });

    it('should paginate through all results', async () => {
      const page1Objects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const page2Objects = [{ id: 'ITEM_3' }, { id: 'ITEM_4' }];
      const client = createMockClient({
        search: vi
          .fn()
          .mockResolvedValueOnce({ objects: page1Objects, cursor: 'page2' })
          .mockResolvedValueOnce({ objects: page2Objects }),
      });

      const service = new CatalogService(client);
      const result = await service.list('ITEM');

      expect(result).toEqual([...page1Objects, ...page2Objects]);
      expect(client.catalog.search).toHaveBeenCalledTimes(2);
      expect(client.catalog.search).toHaveBeenNthCalledWith(1, {
        objectTypes: ['ITEM'],
        cursor: undefined,
      });
      expect(client.catalog.search).toHaveBeenNthCalledWith(2, {
        objectTypes: ['ITEM'],
        cursor: 'page2',
      });
    });

    it('should respect limit option', async () => {
      const page1Objects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const page2Objects = [{ id: 'ITEM_3' }, { id: 'ITEM_4' }];
      const client = createMockClient({
        search: vi
          .fn()
          .mockResolvedValueOnce({ objects: page1Objects, cursor: 'page2' })
          .mockResolvedValueOnce({ objects: page2Objects }),
      });

      const service = new CatalogService(client);
      const result = await service.list('ITEM', { limit: 2 });

      expect(result).toHaveLength(2);
      expect(client.catalog.search).toHaveBeenCalledTimes(1);
    });

    it('should stop at limit across pages', async () => {
      const page1Objects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const page2Objects = [{ id: 'ITEM_3' }, { id: 'ITEM_4' }];
      const client = createMockClient({
        search: vi
          .fn()
          .mockResolvedValueOnce({ objects: page1Objects, cursor: 'page2' })
          .mockResolvedValueOnce({ objects: page2Objects }),
      });

      const service = new CatalogService(client);
      const result = await service.list('ITEM', { limit: 3 });

      expect(result).toHaveLength(3);
      expect(result).toEqual([{ id: 'ITEM_1' }, { id: 'ITEM_2' }, { id: 'ITEM_3' }]);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new CatalogService(client);

      await expect(service.list('ITEM')).rejects.toThrow();
    });
  });

  describe('batchGet', () => {
    it('should batch get catalog objects', async () => {
      const mockObjects = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      const client = createMockClient({
        batchGet: vi.fn().mockResolvedValue({ objects: mockObjects }),
      });

      const service = new CatalogService(client);
      const result = await service.batchGet(['ITEM_1', 'ITEM_2']);

      expect(result).toEqual(mockObjects);
      expect(client.catalog.batchGet).toHaveBeenCalledWith({
        objectIds: ['ITEM_1', 'ITEM_2'],
        includeRelatedObjects: true,
      });
    });

    it('should return empty array for empty input', async () => {
      const client = createMockClient();
      const service = new CatalogService(client);

      const result = await service.batchGet([]);

      expect(result).toEqual([]);
      expect(client.catalog.batchGet).not.toHaveBeenCalled();
    });

    it('should return empty array when no objects found', async () => {
      const client = createMockClient({
        batchGet: vi.fn().mockResolvedValue({}),
      });

      const service = new CatalogService(client);
      const result = await service.batchGet(['ITEM_1']);

      expect(result).toEqual([]);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchGet: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new CatalogService(client);

      await expect(service.batchGet(['ITEM_1'])).rejects.toThrow();
    });
  });
});
