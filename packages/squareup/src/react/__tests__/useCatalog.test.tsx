import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCatalog } from '../hooks/useCatalog.js';

describe('useCatalog', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with null data', () => {
      const { result } = renderHook(() => useCatalog());

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should have all required functions', () => {
      const { result } = renderHook(() => useCatalog());

      expect(typeof result.current.search).toBe('function');
      expect(typeof result.current.get).toBe('function');
      expect(typeof result.current.list).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('search', () => {
    it('should search catalog items successfully', async () => {
      const mockItems = [
        { id: 'ITEM_1', type: 'ITEM' as const, name: 'Latte' },
        { id: 'ITEM_2', type: 'ITEM' as const, name: 'Cappuccino' },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: mockItems }),
      });

      const { result } = renderHook(() => useCatalog());

      let items;
      await act(async () => {
        items = await result.current.search();
      });

      expect(items).toEqual(mockItems);
      expect(result.current.data).toEqual(mockItems);
      expect(result.current.error).toBeNull();
    });

    it('should use default /api/catalog endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.search();
      });

      expect(fetch).toHaveBeenCalledWith('/api/catalog', expect.anything());
    });

    it('should search with object types', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.search({ objectTypes: ['ITEM', 'CATEGORY'] });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=ITEM%2CCATEGORY',
        expect.anything()
      );
    });

    it('should search with query string', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.search({ query: 'coffee' });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?query=coffee',
        expect.anything()
      );
    });

    it('should search with category IDs', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.search({ categoryIds: ['CAT_1', 'CAT_2'] });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?categoryIds=CAT_1%2CCAT_2',
        expect.anything()
      );
    });

    it('should search with limit', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.search({ limit: 20 });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?limit=20',
        expect.anything()
      );
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Catalog unavailable' }),
      });

      const { result } = renderHook(() => useCatalog());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.search();
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Catalog unavailable');
      expect(result.current.error?.message).toBe('Catalog unavailable');
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Failed' }),
      });

      const { result } = renderHook(() => useCatalog({ onError }));

      await act(async () => {
        try {
          await result.current.search();
        } catch {
          // Error expected
        }
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('get', () => {
    it('should get catalog item successfully', async () => {
      const mockItem = {
        id: 'ITEM_123',
        type: 'ITEM' as const,
        name: 'Latte',
        variations: [
          { id: 'VAR_1', name: 'Small', price: { amount: 350, currency: 'USD' } },
          { id: 'VAR_2', name: 'Large', price: { amount: 450, currency: 'USD' } },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockItem),
      });

      const { result } = renderHook(() => useCatalog());

      let item;
      await act(async () => {
        item = await result.current.get('ITEM_123');
      });

      expect(item).toEqual(mockItem);
      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog/ITEM_123',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle get error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Item not found' }),
      });

      const { result } = renderHook(() => useCatalog());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.get('INVALID');
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Item not found');
    });
  });

  describe('list', () => {
    it('should list items by type', async () => {
      const mockItems = [
        { id: 'ITEM_1', type: 'ITEM' as const, name: 'Latte' },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: mockItems }),
      });

      const { result } = renderHook(() => useCatalog());

      let items;
      await act(async () => {
        items = await result.current.list('ITEM');
      });

      expect(items).toEqual(mockItems);
      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=ITEM',
        expect.anything()
      );
    });

    it('should list with limit', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() => useCatalog());

      await act(async () => {
        await result.current.list('CATEGORY', 10);
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=CATEGORY&limit=10',
        expect.anything()
      );
    });
  });

  describe('fetchOnMount', () => {
    it('should not fetch on mount by default', () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      renderHook(() => useCatalog());

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fetch on mount when enabled', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() =>
        useCatalog({ fetchOnMount: true })
      );

      // Wait for fetch to complete and loading to be false
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetch).toHaveBeenCalled();
    });

    it('should use initial options on mount', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result, unmount } = renderHook(() =>
        useCatalog({
          fetchOnMount: true,
          initialOptions: { objectTypes: ['ITEM'], limit: 50 },
        })
      );

      // Wait for fetch to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=ITEM&limit=50',
        expect.anything()
      );

      // Clean up
      unmount();
    });
  });

  describe('refetch', () => {
    it('should refetch with initial options', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() =>
        useCatalog({ initialOptions: { objectTypes: ['ITEM'] } })
      );

      await act(async () => {
        await result.current.refetch();
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/catalog?types=ITEM',
        expect.anything()
      );
    });
  });

  describe('custom endpoint', () => {
    it('should use custom API endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      });

      const { result } = renderHook(() =>
        useCatalog({ apiEndpoint: '/custom/catalog' })
      );

      await act(async () => {
        await result.current.search();
      });

      expect(fetch).toHaveBeenCalledWith('/custom/catalog', expect.anything());
    });
  });
});
