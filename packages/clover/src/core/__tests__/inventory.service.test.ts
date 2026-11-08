import { describe, it, expect, vi } from 'vitest';
import { CloverHttp } from '../http.js';
import { InventoryService } from '../services/inventory.service.js';
import { CloverApiError, CloverValidationError } from '../errors.js';

type FetchMock = ReturnType<typeof vi.fn>;

function response(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
    headers: { get: () => null },
  };
}

function mockFetch(body: unknown, status = 200): FetchMock {
  return vi.fn().mockResolvedValue(response(body, status));
}

function makeService(fetchImpl: FetchMock, merchantId: string | null = 'MERCH_1') {
  return new InventoryService(
    new CloverHttp({
      apiToken: 'tok',
      merchantId: merchantId ?? undefined,
      environment: 'production',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
  );
}

function call(fetchImpl: FetchMock, index = 0) {
  const [url, init] = fetchImpl.mock.calls[index] as [URL, RequestInit & { headers: Record<string, string> }];
  return {
    url: new URL(String(url)),
    init,
    body: init.body === undefined ? undefined : (JSON.parse(init.body as string) as Record<string, unknown>),
  };
}

const BASE = 'https://api.clover.com/v3/merchants/MERCH_1';

describe('InventoryService', () => {
  it('throws a clear error when merchantId is missing', async () => {
    const service = makeService(mockFetch(undefined), null);
    await expect(service.listItems()).rejects.toThrow(/merchantId is required for inventory/);
  });

  describe('listItems', () => {
    it('sends repeated filters, a comma-joined expand and pagination', async () => {
      const fetchImpl = mockFetch({ elements: [{ id: 'I1' }, { id: 'I2' }], href: 'x' });
      const result = await makeService(fetchImpl).listItems({
        filter: ['sku=A&B', 'hidden=false'],
        expand: ['itemStock', 'tags'],
        limit: 50,
        offset: 100,
      });

      expect(result.data.map((i) => i.id)).toEqual(['I1', 'I2']);
      const { url, init } = call(fetchImpl);
      expect(init.method).toBe('GET');
      expect(url.origin + url.pathname).toBe(`${BASE}/items`);
      expect(url.searchParams.getAll('filter')).toEqual(['sku=A&B', 'hidden=false']);
      expect(url.searchParams.get('expand')).toBe('itemStock,tags');
      expect(url.searchParams.get('limit')).toBe('50');
      expect(url.searchParams.get('offset')).toBe('100');
    });

    it('omits empty options and handles a missing elements array', async () => {
      const fetchImpl = mockFetch({});
      const result = await makeService(fetchImpl).listItems({ expand: [], filter: [] });
      expect(result.data).toEqual([]);
      expect(String(call(fetchImpl).url)).toBe(`${BASE}/items`);
    });
  });

  describe('getItem', () => {
    it('gets an item with expand, encoding the id', async () => {
      const fetchImpl = mockFetch({ id: 'I/1', itemStock: { quantity: 3 } });
      const item = await makeService(fetchImpl).getItem('I/1', { expand: ['itemStock'] });
      expect(item.itemStock?.quantity).toBe(3);
      expect(String(call(fetchImpl).url)).toBe(`${BASE}/items/I%2F1?expand=itemStock`);
    });

    it('requires an item id', async () => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).getItem('')).rejects.toThrow('itemId is required');
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe('findItemsByCode', () => {
    it('queries each code and SKU with its own filter and dedupes items', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(response({ elements: [{ id: 'I1', code: '0123' }] }))
        .mockResolvedValueOnce(response({ elements: [{ id: 'I1', sku: 'S1' }, { id: 'I2' }] }));

      const items = await makeService(fetchImpl).findItemsByCode({
        codes: [' 0123 ', '0123', ''],
        skus: ['S1'],
        expand: ['itemStock'],
      });

      expect(fetchImpl).toHaveBeenCalledTimes(2);
      const first = call(fetchImpl, 0).url;
      expect(first.pathname).toBe('/v3/merchants/MERCH_1/items');
      expect(first.searchParams.getAll('filter')).toEqual(['itemCode=0123']);
      expect(first.searchParams.get('expand')).toBe('itemStock');
      expect(first.searchParams.get('limit')).toBe('1000');
      expect(first.searchParams.get('offset')).toBe('0');
      expect(call(fetchImpl, 1).url.searchParams.getAll('filter')).toEqual(['sku=S1']);
      // Later matches replace earlier ones; each id appears once.
      expect(items).toEqual([{ id: 'I1', sku: 'S1' }, { id: 'I2' }]);
    });

    it('pages until a page comes back short', async () => {
      const full = Array.from({ length: 1000 }, (_, i) => ({ id: `I${String(i)}` }));
      const fetchImpl = vi
        .fn()
        .mockResolvedValueOnce(response({ elements: full }))
        .mockResolvedValueOnce(response({ elements: [{ id: 'LAST' }] }));

      const items = await makeService(fetchImpl).findItemsByCode({ skus: ['S1'] });

      expect(fetchImpl).toHaveBeenCalledTimes(2);
      expect(call(fetchImpl, 1).url.searchParams.get('offset')).toBe('1000');
      expect(items).toHaveLength(1001);
    });

    it('keeps items without an id', async () => {
      const fetchImpl = mockFetch({ elements: [{ name: 'no id' }, { name: 'also no id' }] });
      const items = await makeService(fetchImpl).findItemsByCode({ codes: ['1'] });
      expect(items).toHaveLength(2);
    });

    it('requires at least one non-blank code or SKU', async () => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).findItemsByCode({ codes: [' '], skus: [] })).rejects.toThrow(
        CloverValidationError
      );
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('rethrows API errors', async () => {
      const fetchImpl = mockFetch({ message: 'boom' }, 500);
      await expect(makeService(fetchImpl).findItemsByCode({ codes: ['1'] })).rejects.toThrow(
        CloverApiError
      );
    });
  });

  describe('createItem', () => {
    it('posts only the given fields with an idempotency key', async () => {
      const fetchImpl = mockFetch({ id: 'I1' });
      const item = await makeService(fetchImpl).createItem({
        name: 'Dill pickles',
        price: 599,
        sku: 'PICKLE-DILL-500',
        code: '012345678905',
        cost: 0,
        hidden: false,
      });

      expect(item.id).toBe('I1');
      const { url, init, body } = call(fetchImpl);
      expect(String(url)).toBe(`${BASE}/items`);
      expect(init.method).toBe('POST');
      expect(init.headers['idempotency-key']).toEqual(expect.any(String));
      expect(body).toEqual({
        name: 'Dill pickles',
        price: 599,
        sku: 'PICKLE-DILL-500',
        code: '012345678905',
        cost: 0,
        hidden: false,
      });
    });

    it('uses the given idempotency key and does not send it in the body', async () => {
      const fetchImpl = mockFetch({ id: 'I1' });
      await makeService(fetchImpl).createItem({ name: 'A', price: 0, idempotencyKey: 'idem-1' });
      const { init, body } = call(fetchImpl);
      expect(init.headers['idempotency-key']).toBe('idem-1');
      expect(body).toEqual({ name: 'A', price: 0 });
    });

    it.each([
      [{ name: ' ', price: 100 }, 'name is required'],
      [{ name: 'A', price: 1.5 }, 'price must be a non-negative integer'],
      [{ name: 'A', price: -1 }, 'price must be a non-negative integer'],
      [{ name: 'A' } as { name: string; price: number }, 'price is required'],
      [{ name: 'A', price: 100, cost: -5 }, 'cost must be a non-negative integer'],
    ])('rejects %j', async (options, message) => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).createItem(options)).rejects.toThrow(message);
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('posts only the given fields to the item', async () => {
      const fetchImpl = mockFetch({ id: 'I1' });
      await makeService(fetchImpl).updateItem('I1', { price: 649, sku: 'NEW' });
      const { url, init, body } = call(fetchImpl);
      expect(String(url)).toBe(`${BASE}/items/I1`);
      expect(init.method).toBe('POST');
      expect(init.headers['idempotency-key']).toEqual(expect.any(String));
      expect(body).toEqual({ price: 649, sku: 'NEW' });
    });

    it.each([
      [{}, 'Give at least one field to update'],
      [{ idempotencyKey: 'k' }, 'Give at least one field to update'],
      [{ name: '' }, 'name cannot be empty'],
      [{ price: 9.99 }, 'price must be a non-negative integer'],
      [{ cost: 1.5 }, 'cost must be a non-negative integer'],
    ])('rejects %j', async (options, message) => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).updateItem('I1', options)).rejects.toThrow(message);
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe('item stock', () => {
    it('gets the stock of an item', async () => {
      const fetchImpl = mockFetch({ item: { id: 'I1' }, quantity: 12.5 });
      const stock = await makeService(fetchImpl).getItemStock('I1');
      expect(stock.quantity).toBe(12.5);
      const { url, init } = call(fetchImpl);
      expect(String(url)).toBe(`${BASE}/item_stocks/I1`);
      expect(init.method).toBe('GET');
    });

    it('sets the stock with PUT and the quantity only', async () => {
      const fetchImpl = mockFetch({ item: { id: 'I1' }, quantity: 24 });
      const stock = await makeService(fetchImpl).updateItemStock('I1', { quantity: 24 });
      expect(stock).toEqual({ item: { id: 'I1' }, quantity: 24 });
      const { url, init, body } = call(fetchImpl);
      expect(String(url)).toBe(`${BASE}/item_stocks/I1`);
      expect(init.method).toBe('PUT');
      expect(init.headers['idempotency-key']).toEqual(expect.any(String));
      expect(body).toEqual({ quantity: 24 });
    });

    it('encodes the item id on the item_stocks path', async () => {
      const fetchImpl = mockFetch({ quantity: 1 });
      const service = makeService(fetchImpl);
      await service.getItemStock('A/B');
      await service.updateItemStock('A/B', { quantity: 1 });
      expect(String(call(fetchImpl, 0).url)).toBe(`${BASE}/item_stocks/A%2FB`);
      expect(String(call(fetchImpl, 1).url)).toBe(`${BASE}/item_stocks/A%2FB`);
    });

    it('falls back to the sent stock when Clover returns no body', async () => {
      const fetchImpl = mockFetch(undefined);
      const stock = await makeService(fetchImpl).updateItemStock('I1', { quantity: 0 });
      expect(stock).toEqual({ item: { id: 'I1' }, quantity: 0 });
    });

    it.each([NaN, Infinity, '3' as unknown as number])('rejects quantity %s', async (quantity) => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).updateItemStock('I1', { quantity })).rejects.toThrow(
        'quantity must be a finite number'
      );
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('requires an item id', async () => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).getItemStock('')).rejects.toThrow('itemId is required');
      await expect(makeService(fetchImpl).updateItemStock('', { quantity: 1 })).rejects.toThrow(
        'itemId is required'
      );
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('rethrows API errors', async () => {
      const fetchImpl = mockFetch({ message: 'Not found' }, 404);
      await expect(makeService(fetchImpl).getItemStock('I1')).rejects.toThrow('Not found');
    });
  });
});
