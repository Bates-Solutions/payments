import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SquareCatalogService } from '../services/square-catalog.service.js';
import { firstValueFrom } from 'rxjs';

describe('SquareCatalogService', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function createService(): SquareCatalogService {
    TestBed.configureTestingModule({
      providers: [SquareCatalogService],
    });
    return TestBed.inject(SquareCatalogService);
  }

  describe('initialization', () => {
    it('should create service', () => {
      const service = createService();
      expect(service).toBeTruthy();
    });

    it('should expose loading$ observable', () => {
      const service = createService();
      expect(service.loading$).toBeDefined();
    });

    it('should expose error$ observable', () => {
      const service = createService();
      expect(service.error$).toBeDefined();
    });
  });

  describe('list', () => {
    it('should list catalog items', async () => {
      const mockItems = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ objects: mockItems }),
      });

      const service = createService();

      const result = await firstValueFrom(service.list());

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ objects: mockItems });
    });

    it('should filter by types', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ objects: [] }),
      });

      const service = createService();
      await firstValueFrom(service.list(['ITEM', 'CATEGORY']));

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=ITEM,CATEGORY',
        expect.anything()
      );
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.list(undefined, '/custom/catalog'));

      expect(fetch).toHaveBeenCalledWith('/custom/catalog', expect.anything());
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.list())).rejects.toThrow('Server error');
    });

    it('should set loading state', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      const loadingStates: boolean[] = [];
      service.loading$.subscribe((l) => loadingStates.push(l));

      await firstValueFrom(service.list());

      expect(loadingStates).toContain(true);
      expect(loadingStates[loadingStates.length - 1]).toBe(false);
    });
  });

  describe('search', () => {
    it('should search catalog items', async () => {
      const mockItems = [{ id: 'ITEM_1' }];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ objects: mockItems }),
      });

      const service = createService();

      const result = await firstValueFrom(service.search({ textFilter: 'coffee' }));

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog/search',
        expect.objectContaining({ method: 'POST' })
      );
      expect(result).toEqual({ objects: mockItems });
    });

    it('should send search request in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(
        service.search({
          textFilter: 'latte',
          categoryIds: ['CAT_1'],
          limit: 10,
        })
      );

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.textFilter).toBe('latte');
      expect(body.categoryIds).toEqual(['CAT_1']);
      expect(body.limit).toBe(10);
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.search({ textFilter: 'test' }, '/custom/catalog'));

      expect(fetch).toHaveBeenCalledWith('/custom/catalog/search', expect.anything());
    });

    it('should handle search errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid query' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.search({ textFilter: '' }))).rejects.toThrow(
        'Invalid query'
      );
    });
  });

  describe('retrieve', () => {
    it('should get catalog item by ID', async () => {
      const mockItem = { id: 'ITEM_123', type: 'ITEM' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ object: mockItem }),
      });

      const service = createService();

      const result = await firstValueFrom(service.retrieve('ITEM_123'));

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog/ITEM_123',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ object: mockItem });
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.retrieve('ITEM_123', '/custom/catalog'));

      expect(fetch).toHaveBeenCalledWith('/custom/catalog/ITEM_123', expect.anything());
    });

    it('should handle not found errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Item not found' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.retrieve('INVALID_ID'))).rejects.toThrow(
        'Item not found'
      );
    });
  });

  describe('batchRetrieve', () => {
    it('should batch retrieve catalog items', async () => {
      const mockItems = [{ id: 'ITEM_1' }, { id: 'ITEM_2' }];
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ objects: mockItems }),
      });

      const service = createService();

      const result = await firstValueFrom(service.batchRetrieve(['ITEM_1', 'ITEM_2']));

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog/batch',
        expect.objectContaining({ method: 'POST' })
      );
      expect(result).toEqual({ objects: mockItems });
    });

    it('should send object IDs in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.batchRetrieve(['ID_1', 'ID_2', 'ID_3']));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.objectIds).toEqual(['ID_1', 'ID_2', 'ID_3']);
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.batchRetrieve(['ID_1'], '/custom/catalog'));

      expect(fetch).toHaveBeenCalledWith('/custom/catalog/batch', expect.anything());
    });

    it('should handle batch errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Too many IDs' }),
      });

      const service = createService();

      await expect(
        firstValueFrom(service.batchRetrieve(['ID_1', 'ID_2']))
      ).rejects.toThrow('Too many IDs');
    });
  });
});
