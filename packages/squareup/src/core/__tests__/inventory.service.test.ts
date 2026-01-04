import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { InventoryService } from '../services/inventory.service.js';
import { SquareValidationError } from '../errors.js';

// Create mock Square client
function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    inventory: {
      get: vi.fn(),
      batchGetCounts: vi.fn(),
      batchCreateChanges: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('InventoryService', () => {
  const defaultLocationId = 'LOC_123';

  describe('getCounts', () => {
    it('should get inventory counts', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_123', quantity: '10' }];
      const client = createMockClient({
        get: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const count of mockCounts) yield count;
          },
        }),
      });

      const service = new InventoryService(client, defaultLocationId);
      const result = await service.getCounts('VAR_123');

      expect(result).toEqual(mockCounts);
    });

    it('should filter by locationId', async () => {
      const client = createMockClient({
        get: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {},
        }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await service.getCounts('VAR_123', 'CUSTOM_LOC');

      expect(client.inventory.get).toHaveBeenCalledWith({
        catalogObjectId: 'VAR_123',
        locationIds: 'CUSTOM_LOC',
      });
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        get: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
        }),
      });

      const service = new InventoryService(client);
      await expect(service.getCounts('VAR_123')).rejects.toThrow();
    });
  });

  describe('batchGetCounts', () => {
    it('should batch get inventory counts', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_1', quantity: '5' }];
      const client = createMockClient({
        batchGetCounts: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const count of mockCounts) yield count;
          },
        }),
      });

      const service = new InventoryService(client);
      const result = await service.batchGetCounts(['VAR_1', 'VAR_2'], ['LOC_1']);

      expect(result).toEqual(mockCounts);
      expect(client.inventory.batchGetCounts).toHaveBeenCalledWith({
        catalogObjectIds: ['VAR_1', 'VAR_2'],
        locationIds: ['LOC_1'],
      });
    });

    it('should return empty array for empty input', async () => {
      const client = createMockClient();
      const service = new InventoryService(client);

      const result = await service.batchGetCounts([]);

      expect(result).toEqual([]);
      expect(client.inventory.batchGetCounts).not.toHaveBeenCalled();
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchGetCounts: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new InventoryService(client);
      await expect(service.batchGetCounts(['VAR_1'])).rejects.toThrow();
    });
  });

  describe('setCount', () => {
    it('should set inventory count', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_123', quantity: '50' }];
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: mockCounts }),
      });

      const service = new InventoryService(client, defaultLocationId);
      const result = await service.setCount({
        catalogObjectId: 'VAR_123',
        quantity: 50,
      });

      expect(result).toEqual(mockCounts);
      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              type: 'PHYSICAL_COUNT',
              physicalCount: expect.objectContaining({
                catalogObjectId: 'VAR_123',
                locationId: defaultLocationId,
                quantity: '50',
              }),
            }),
          ],
        })
      );
    });

    it('should use custom locationId', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: [] }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await service.setCount({
        catalogObjectId: 'VAR_123',
        locationId: 'CUSTOM_LOC',
        quantity: 10,
      });

      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              physicalCount: expect.objectContaining({
                locationId: 'CUSTOM_LOC',
              }),
            }),
          ],
        })
      );
    });

    it('should use custom occurredAt', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: [] }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await service.setCount({
        catalogObjectId: 'VAR_123',
        quantity: 10,
        occurredAt: '2025-01-01T00:00:00Z',
      });

      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              physicalCount: expect.objectContaining({
                occurredAt: '2025-01-01T00:00:00Z',
              }),
            }),
          ],
        })
      );
    });

    it('should throw SquareValidationError for missing locationId', async () => {
      const client = createMockClient();
      const service = new InventoryService(client);

      await expect(
        service.setCount({ catalogObjectId: 'VAR_123', quantity: 10 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await expect(service.setCount({ catalogObjectId: 'VAR_123', quantity: 10 })).rejects.toThrow();
    });
  });

  describe('adjust', () => {
    it('should add inventory', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_123', quantity: '20' }];
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: mockCounts }),
      });

      const service = new InventoryService(client, defaultLocationId);
      const result = await service.adjust({
        catalogObjectId: 'VAR_123',
        quantity: 10,
      });

      expect(result).toEqual(mockCounts);
      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              type: 'ADJUSTMENT',
              adjustment: expect.objectContaining({
                fromState: 'NONE',
                toState: 'IN_STOCK',
                quantity: '10',
              }),
            }),
          ],
        })
      );
    });

    it('should remove inventory with negative quantity', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: [] }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await service.adjust({
        catalogObjectId: 'VAR_123',
        quantity: -5,
      });

      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              adjustment: expect.objectContaining({
                fromState: 'IN_STOCK',
                toState: 'SOLD',
                quantity: '5',
              }),
            }),
          ],
        })
      );
    });

    it('should throw SquareValidationError for missing locationId', async () => {
      const client = createMockClient();
      const service = new InventoryService(client);

      await expect(
        service.adjust({ catalogObjectId: 'VAR_123', quantity: 10 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new InventoryService(client, defaultLocationId);
      await expect(service.adjust({ catalogObjectId: 'VAR_123', quantity: 10 })).rejects.toThrow();
    });
  });

  describe('transfer', () => {
    it('should transfer inventory between locations', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_123', quantity: '5' }];
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: mockCounts }),
      });

      const service = new InventoryService(client, defaultLocationId);
      const result = await service.transfer({
        catalogObjectId: 'VAR_123',
        fromLocationId: 'LOC_A',
        toLocationId: 'LOC_B',
        quantity: 5,
      });

      expect(result).toEqual(mockCounts);
      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({
          changes: [
            expect.objectContaining({
              type: 'TRANSFER',
              transfer: expect.objectContaining({
                catalogObjectId: 'VAR_123',
                fromLocationId: 'LOC_A',
                toLocationId: 'LOC_B',
                quantity: '5',
              }),
            }),
          ],
        })
      );
    });

    it('should throw SquareValidationError for non-positive quantity', async () => {
      const client = createMockClient();
      const service = new InventoryService(client);

      await expect(
        service.transfer({
          catalogObjectId: 'VAR_123',
          fromLocationId: 'LOC_A',
          toLocationId: 'LOC_B',
          quantity: 0,
        })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new InventoryService(client);
      await expect(
        service.transfer({
          catalogObjectId: 'VAR_123',
          fromLocationId: 'LOC_A',
          toLocationId: 'LOC_B',
          quantity: 5,
        })
      ).rejects.toThrow();
    });
  });

  describe('batchChange', () => {
    it('should batch apply changes', async () => {
      const mockCounts = [{ catalogObjectId: 'VAR_123', quantity: '10' }];
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: mockCounts }),
      });

      const service = new InventoryService(client);
      const result = await service.batchChange([
        {
          type: 'ADJUSTMENT',
          adjustment: {
            catalogObjectId: 'VAR_123',
            toState: 'IN_STOCK',
            locationId: 'LOC_1',
            quantity: '10',
          },
        },
      ]);

      expect(result).toEqual(mockCounts);
    });

    it('should return empty array for empty input', async () => {
      const client = createMockClient();
      const service = new InventoryService(client);

      const result = await service.batchChange([]);

      expect(result).toEqual([]);
      expect(client.inventory.batchCreateChanges).not.toHaveBeenCalled();
    });

    it('should use custom idempotencyKey', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockResolvedValue({ counts: [] }),
      });

      const service = new InventoryService(client);
      await service.batchChange(
        [{ type: 'ADJUSTMENT', adjustment: { catalogObjectId: 'V', toState: 'IN_STOCK', locationId: 'L', quantity: '1' } }],
        'custom-key'
      );

      expect(client.inventory.batchCreateChanges).toHaveBeenCalledWith(
        expect.objectContaining({ idempotencyKey: 'custom-key' })
      );
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        batchCreateChanges: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new InventoryService(client);
      await expect(
        service.batchChange([{ type: 'ADJUSTMENT', adjustment: { catalogObjectId: 'V', toState: 'IN_STOCK', locationId: 'L', quantity: '1' } }])
      ).rejects.toThrow();
    });
  });
});
