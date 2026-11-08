import { describe, it, expect, vi } from 'vitest';
import { CloverHttp } from '../http.js';
import { OrdersService } from '../services/orders.service.js';
import { CloverApiError, CloverValidationError } from '../errors.js';

type FetchMock = ReturnType<typeof vi.fn>;

function mockFetch(body: unknown, status = 200): FetchMock {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
    headers: { get: () => null },
  });
}

function makeService(fetchImpl: FetchMock, merchantId: string | null = 'MERCH_1') {
  return new OrdersService(
    new CloverHttp({
      apiToken: 'tok',
      merchantId: merchantId ?? undefined,
      environment: 'production',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
  );
}

function requestUrl(fetchImpl: FetchMock, index = 0): URL {
  return new URL(String((fetchImpl.mock.calls[index] as [URL])[0]));
}

const BASE = 'https://api.clover.com/v3/merchants/MERCH_1/orders';

describe('OrdersService', () => {
  it('throws a clear error when merchantId is missing', async () => {
    const service = makeService(mockFetch(undefined), null);
    await expect(service.list()).rejects.toThrow(/merchantId is required for order/);
  });

  describe('list', () => {
    it('lists orders with no options', async () => {
      const fetchImpl = mockFetch({ elements: [{ id: 'O1' }], href: 'x' });
      const result = await makeService(fetchImpl).list();
      expect(result.data).toEqual([{ id: 'O1' }]);
      const [url, init] = fetchImpl.mock.calls[0] as [URL, RequestInit];
      expect(String(url)).toBe(BASE);
      expect(init.method).toBe('GET');
    });

    it('turns the time window and state into filters, before extra filters', async () => {
      const fetchImpl = mockFetch({ elements: [] });
      await makeService(fetchImpl).list({
        createdTimeFrom: new Date('2026-10-01T00:00:00Z'),
        createdTimeTo: 1793491200000,
        state: 'locked',
        filter: ['total>1000'],
        expand: ['lineItems', 'payments'],
        limit: 100,
        offset: 200,
      });

      const url = requestUrl(fetchImpl);
      expect(url.searchParams.getAll('filter')).toEqual([
        `createdTime>=${String(Date.parse('2026-10-01T00:00:00Z'))}`,
        'createdTime<1793491200000',
        'state=locked',
        'total>1000',
      ]);
      expect(url.searchParams.get('expand')).toBe('lineItems,payments');
      expect(url.searchParams.get('limit')).toBe('100');
      expect(url.searchParams.get('offset')).toBe('200');
    });

    it('accepts a window with only one end', async () => {
      const fetchImpl = mockFetch({ elements: [] });
      await makeService(fetchImpl).list({ createdTimeTo: 5 });
      expect(requestUrl(fetchImpl).searchParams.getAll('filter')).toEqual(['createdTime<5']);
    });

    it('accepts epoch 0 as a start time', async () => {
      const fetchImpl = mockFetch({ elements: [] });
      await makeService(fetchImpl).list({ createdTimeFrom: 0 });
      expect(requestUrl(fetchImpl).searchParams.getAll('filter')).toEqual(['createdTime>=0']);
    });

    it('unwraps line items from the elements envelope', async () => {
      const fetchImpl = mockFetch({
        elements: [
          { id: 'O1', lineItems: { elements: [{ id: 'L1', item: { id: 'I1' }, price: 599 }] } },
          { id: 'O2', lineItems: [{ id: 'L2' }] },
          { id: 'O3', lineItems: {} },
          { id: 'O4' },
        ],
      });
      const { data } = await makeService(fetchImpl).list({ expand: ['lineItems'] });
      expect(data).toEqual([
        { id: 'O1', lineItems: [{ id: 'L1', item: { id: 'I1' }, price: 599 }] },
        { id: 'O2', lineItems: [{ id: 'L2' }] },
        { id: 'O3', lineItems: [] },
        { id: 'O4' },
      ]);
      expect('lineItems' in data[3]!).toBe(false);
    });

    it('handles a missing elements array', async () => {
      const { data } = await makeService(mockFetch({})).list();
      expect(data).toEqual([]);
    });

    it.each([
      [{ createdTimeFrom: new Date('nope') }, 'createdTimeFrom must be a valid Date'],
      [{ createdTimeTo: 1.5 }, 'createdTimeTo must be a valid Date'],
      [{ createdTimeFrom: -1 }, 'createdTimeFrom must be a valid Date'],
      [{ createdTimeFrom: 10, createdTimeTo: 10 }, 'createdTimeFrom must be before createdTimeTo'],
      [{ createdTimeFrom: 20, createdTimeTo: 10 }, 'createdTimeFrom must be before createdTimeTo'],
    ])('rejects %j without calling Clover', async (options, message) => {
      const fetchImpl = mockFetch({ elements: [] });
      const error = await makeService(fetchImpl)
        .list(options)
        .catch((e: unknown) => e);
      expect(error).toBeInstanceOf(CloverValidationError);
      expect((error as Error).message).toContain(message);
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('rethrows API errors', async () => {
      const fetchImpl = mockFetch({ message: 'boom' }, 500);
      await expect(makeService(fetchImpl).list()).rejects.toThrow(CloverApiError);
    });
  });

  describe('get', () => {
    it('gets an order with expand, encoding the id and unwrapping line items', async () => {
      const fetchImpl = mockFetch({ id: 'O/1', lineItems: { elements: [{ id: 'L1', unitQty: 2500 }] } });
      const order = await makeService(fetchImpl).get('O/1', { expand: ['lineItems'] });
      expect(order.lineItems).toEqual([{ id: 'L1', unitQty: 2500 }]);
      expect(String(requestUrl(fetchImpl))).toBe(`${BASE}/O%2F1?expand=lineItems`);
    });

    it('sends no expand when none is given', async () => {
      const fetchImpl = mockFetch({ id: 'O1' });
      await makeService(fetchImpl).get('O1', { expand: [] });
      expect(String(requestUrl(fetchImpl))).toBe(`${BASE}/O1`);
    });

    it('requires an order id', async () => {
      const fetchImpl = mockFetch({});
      await expect(makeService(fetchImpl).get('')).rejects.toThrow('orderId is required');
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('rethrows API errors', async () => {
      const fetchImpl = mockFetch({ message: 'Not found' }, 404);
      await expect(makeService(fetchImpl).get('O1')).rejects.toThrow('Not found');
    });
  });
});
