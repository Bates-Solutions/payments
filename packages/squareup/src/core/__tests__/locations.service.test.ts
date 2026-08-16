import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { LocationsService } from '../services/locations.service.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    locations: {
      list: vi.fn(),
      get: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('LocationsService', () => {
  describe('list', () => {
    it('returns the merchant locations', async () => {
      const mockLocations = [
        { id: 'LOC_1', name: 'Main', country: 'CA', currency: 'CAD', status: 'ACTIVE' },
        { id: 'LOC_2', name: 'Second', country: 'CA', currency: 'CAD', status: 'INACTIVE' },
      ];
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ locations: mockLocations }),
      });

      const service = new LocationsService(client);
      const result = await service.list();

      expect(result).toEqual(mockLocations);
      // Currency is derivable from the location (issue #119 Part 2).
      expect(result[0]?.currency).toBe('CAD');
      expect(client.locations.list).toHaveBeenCalled();
    });

    it('returns an empty array when Square omits locations', async () => {
      const client = createMockClient({ list: vi.fn().mockResolvedValue({}) });
      const service = new LocationsService(client);
      await expect(service.list()).resolves.toEqual([]);
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });
      const service = new LocationsService(client);
      await expect(service.list()).rejects.toThrow();
    });
  });

  describe('get', () => {
    it('returns a single location', async () => {
      const mockLocation = { id: 'LOC_1', name: 'Main', country: 'CA', currency: 'CAD', status: 'ACTIVE' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ location: mockLocation }),
      });

      const service = new LocationsService(client);
      const result = await service.get('LOC_1');

      expect(result).toEqual(mockLocation);
      expect(client.locations.get).toHaveBeenCalledWith({ locationId: 'LOC_1' });
    });

    it('throws when the location is not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });
      const service = new LocationsService(client);
      await expect(service.get('LOC_x')).rejects.toThrow('Location not found');
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        get: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
        }),
      });
      const service = new LocationsService(client);
      await expect(service.get('LOC_x')).rejects.toThrow();
    });
  });
});
