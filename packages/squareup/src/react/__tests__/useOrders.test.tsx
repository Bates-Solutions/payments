import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrders } from '../hooks/useOrders.js';

describe('useOrders', () => {
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
      const { result } = renderHook(() => useOrders());

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should have create, get, and reset functions', () => {
      const { result } = renderHook(() => useOrders());

      expect(typeof result.current.create).toBe('function');
      expect(typeof result.current.get).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('create', () => {
    it('should create order successfully', async () => {
      const mockOrder = {
        id: 'ORD_123',
        status: 'OPEN',
        totalMoney: { amount: 800, currency: 'USD' },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      });

      const { result } = renderHook(() => useOrders());

      let order;
      await act(async () => {
        order = await result.current.create({
          lineItems: [{ name: 'Latte', amount: 450 }],
        });
      });

      expect(order).toEqual(mockOrder);
      expect(result.current.data).toEqual(mockOrder);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should use default /api/orders endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'ORD_123' }),
      });

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.create({ lineItems: [{ name: 'Test' }] });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'ORD_123' }),
      });

      const { result } = renderHook(() => useOrders({ apiEndpoint: '/custom/orders' }));

      await act(async () => {
        await result.current.create({ lineItems: [{ name: 'Test' }] });
      });

      expect(fetch).toHaveBeenCalledWith('/custom/orders', expect.anything());
    });

    it('should send order input in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'ORD_123' }),
      });

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.create({
          lineItems: [
            { name: 'Latte', amount: 450 },
            { catalogObjectId: 'CAT_123', quantity: 2 },
          ],
          customerId: 'CUST_456',
          referenceId: 'REF_789',
          paymentToken: 'cnon:card-nonce',
        });
      });

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call?.[1]?.body as string);

      expect(body.lineItems).toHaveLength(2);
      expect(body.lineItems[0].name).toBe('Latte');
      expect(body.lineItems[0].amount).toBe(450);
      expect(body.lineItems[1].catalogObjectId).toBe('CAT_123');
      expect(body.customerId).toBe('CUST_456');
      expect(body.referenceId).toBe('REF_789');
      expect(body.paymentToken).toBe('cnon:card-nonce');
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid order' }),
      });

      const { result } = renderHook(() => useOrders());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.create({ lineItems: [] });
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Invalid order');
      expect(result.current.error?.message).toBe('Invalid order');
      expect(result.current.data).toBeNull();
    });

    it('should call onSuccess callback', async () => {
      const mockOrder = { id: 'ORD_123', status: 'OPEN' };
      const onSuccess = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      });

      const { result } = renderHook(() => useOrders({ onSuccess }));

      await act(async () => {
        await result.current.create({ lineItems: [{ name: 'Test' }] });
      });

      expect(onSuccess).toHaveBeenCalledWith(mockOrder);
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Order failed' }),
      });

      const { result } = renderHook(() => useOrders({ onError }));

      await act(async () => {
        try {
          await result.current.create({ lineItems: [] });
        } catch {
          // Error expected
        }
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError.mock.calls[0]?.[0]?.message).toBe('Order failed');
    });
  });

  describe('get', () => {
    it('should get order successfully', async () => {
      const mockOrder = {
        id: 'ORD_123',
        status: 'COMPLETED',
        totalMoney: { amount: 1000, currency: 'USD' },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      });

      const { result } = renderHook(() => useOrders());

      let order;
      await act(async () => {
        order = await result.current.get('ORD_123');
      });

      expect(order).toEqual(mockOrder);
      expect(result.current.data).toEqual(mockOrder);
      expect(fetch).toHaveBeenCalledWith(
        '/api/orders/ORD_123',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should handle get error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Order not found' }),
      });

      const { result } = renderHook(() => useOrders());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.get('INVALID');
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Order not found');
      expect(result.current.error?.message).toBe('Order not found');
    });
  });

  describe('reset', () => {
    it('should reset state', async () => {
      const mockOrder = { id: 'ORD_123', status: 'OPEN' };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      });

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.create({ lineItems: [{ name: 'Test' }] });
      });

      expect(result.current.data).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
