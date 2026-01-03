import { useState, useCallback, useEffect } from 'react';
import type { QueryState } from '../types.js';

/**
 * Catalog object type
 */
export type CatalogObjectType =
  | 'ITEM'
  | 'ITEM_VARIATION'
  | 'CATEGORY'
  | 'DISCOUNT'
  | 'TAX'
  | 'MODIFIER'
  | 'MODIFIER_LIST'
  | 'IMAGE';

/**
 * Catalog item response
 */
export interface CatalogItemResponse {
  type: CatalogObjectType;
  id: string;
  name?: string;
  description?: string;
  categoryId?: string;
  variations?: Array<{
    id: string;
    name?: string;
    sku?: string;
    price?: {
      amount: number;
      currency: string;
    };
  }>;
  imageUrl?: string;
}

/**
 * Catalog search options
 */
export interface CatalogSearchOptions {
  /** Object types to include */
  objectTypes?: CatalogObjectType[];
  /** Search query string */
  query?: string;
  /** Category IDs to filter by */
  categoryIds?: string[];
  /** Maximum results */
  limit?: number;
}

/**
 * Options for useCatalog hook
 */
export interface UseCatalogOptions {
  /** API endpoint for catalog (default: /api/catalog) */
  apiEndpoint?: string;
  /** Initial search options */
  initialOptions?: CatalogSearchOptions;
  /** Fetch on mount */
  fetchOnMount?: boolean;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useCatalog hook
 */
export interface UseCatalogReturn extends QueryState<CatalogItemResponse[]> {
  /** Search catalog items */
  search: (options?: CatalogSearchOptions) => Promise<CatalogItemResponse[]>;
  /** Get a catalog item by ID */
  get: (objectId: string) => Promise<CatalogItemResponse>;
  /** List items by type */
  list: (type: CatalogObjectType, limit?: number) => Promise<CatalogItemResponse[]>;
}

/**
 * Hook for accessing catalog data via your backend API
 *
 * @param options - Hook configuration
 * @returns Catalog query functions and state
 *
 * @example
 * ```tsx
 * function ProductList() {
 *   const { data: items, loading, error, search } = useCatalog({
 *     initialOptions: { objectTypes: ['ITEM'], limit: 20 },
 *     fetchOnMount: true,
 *   });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         onChange={(e) => search({ query: e.target.value })}
 *         placeholder="Search products..."
 *       />
 *       <ul>
 *         {items?.map((item) => (
 *           <li key={item.id}>{item.name}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCatalog(options: UseCatalogOptions = {}): UseCatalogReturn {
  const {
    apiEndpoint = '/api/catalog',
    initialOptions,
    fetchOnMount = false,
    onError,
  } = options;

  const [data, setData] = useState<CatalogItemResponse[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    async (searchOptions?: CatalogSearchOptions): Promise<CatalogItemResponse[]> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const opts = searchOptions ?? initialOptions ?? {};

        if (opts.objectTypes?.length) {
          params.set('types', opts.objectTypes.join(','));
        }
        if (opts.query) {
          params.set('query', opts.query);
        }
        if (opts.categoryIds?.length) {
          params.set('categoryIds', opts.categoryIds.join(','));
        }
        if (opts.limit) {
          params.set('limit', String(opts.limit));
        }

        const url = params.toString() ? `${apiEndpoint}?${params.toString()}` : apiEndpoint;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Catalog search failed: ${response.statusText}`);
        }

        const result = (await response.json()) as { items: CatalogItemResponse[] };
        const items = result.items;
        setData(items);
        return items;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Catalog search failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, initialOptions, onError]
  );

  const get = useCallback(
    async (objectId: string): Promise<CatalogItemResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiEndpoint}/${objectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Failed to get catalog item: ${response.statusText}`);
        }

        const item = (await response.json()) as CatalogItemResponse;
        return item;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get catalog item');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onError]
  );

  const list = useCallback(
    async (type: CatalogObjectType, limit?: number): Promise<CatalogItemResponse[]> => {
      return search({ objectTypes: [type], limit });
    },
    [search]
  );

  const refetch = useCallback(async () => {
    await search(initialOptions);
  }, [search, initialOptions]);

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchOnMount) {
      void search(initialOptions);
    }
  }, [fetchOnMount, search, initialOptions]);

  return {
    data,
    error,
    loading,
    search,
    get,
    list,
    refetch,
  };
}
