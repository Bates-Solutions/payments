import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePayments } from '../hooks/usePayments.js';

describe('usePayments', () => {
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
      const { result } = renderHook(() => usePayments());

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should have create and reset functions', () => {
      const { result } = renderHook(() => usePayments());

      expect(typeof result.current.create).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('create', () => {
    it('should create payment successfully', async () => {
      const mockPayment = {
        id: 'PAY_123',
        status: 'COMPLETED',
        amount: 1000,
        currency: 'USD',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPayment),
      });

      const { result } = renderHook(() => usePayments());

      let payment;
      await act(async () => {
        payment = await result.current.create({
          sourceId: 'cnon:card-nonce',
          amount: 1000,
        });
      });

      expect(payment).toEqual(mockPayment);
      expect(result.current.data).toEqual(mockPayment);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should use default /api/payments endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'PAY_123' }),
      });

      const { result } = renderHook(() => usePayments());

      await act(async () => {
        await result.current.create({ sourceId: 'token', amount: 500 });
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/payments',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'PAY_123' }),
      });

      const { result } = renderHook(() => usePayments({ apiEndpoint: '/custom/payments' }));

      await act(async () => {
        await result.current.create({ sourceId: 'token', amount: 500 });
      });

      expect(fetch).toHaveBeenCalledWith('/custom/payments', expect.anything());
    });

    it('should send payment input in body', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'PAY_123' }),
      });

      const { result } = renderHook(() => usePayments());

      await act(async () => {
        await result.current.create({
          sourceId: 'cnon:card-nonce',
          amount: 1500,
          currency: 'EUR',
          customerId: 'CUST_456',
          orderId: 'ORDER_789',
          referenceId: 'REF_123',
          note: 'Test payment',
          autocomplete: true,
        });
      });

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call?.[1]?.body as string);

      expect(body.sourceId).toBe('cnon:card-nonce');
      expect(body.amount).toBe(1500);
      expect(body.currency).toBe('EUR');
      expect(body.customerId).toBe('CUST_456');
      expect(body.orderId).toBe('ORDER_789');
      expect(body.referenceId).toBe('REF_123');
      expect(body.note).toBe('Test payment');
      expect(body.autocomplete).toBe(true);
    });

    it('should set loading state during request', async () => {
      let resolvePromise: (value: unknown) => void;
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      globalThis.fetch = vi.fn().mockReturnValue(fetchPromise);

      const { result } = renderHook(() => usePayments());

      // Start the create call
      let createPromise: Promise<unknown>;
      act(() => {
        createPromise = result.current.create({ sourceId: 'token', amount: 100 });
      });

      // Check loading state while request is pending
      expect(result.current.loading).toBe(true);

      // Resolve the fetch promise
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () => Promise.resolve({ id: 'PAY_123' }),
        });
        await createPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid card' }),
      });

      const { result } = renderHook(() => usePayments());

      let error: Error | undefined;
      await act(async () => {
        try {
          await result.current.create({ sourceId: 'invalid', amount: 100 });
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Invalid card');
      expect(result.current.error?.message).toBe('Invalid card');
      expect(result.current.data).toBeNull();
    });

    it('should use statusText when no message in response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
      });

      const { result } = renderHook(() => usePayments());

      await expect(
        act(async () => {
          await result.current.create({ sourceId: 'token', amount: 100 });
        })
      ).rejects.toThrow('Payment failed: Internal Server Error');
    });

    it('should call onSuccess callback', async () => {
      const mockPayment = { id: 'PAY_123', status: 'COMPLETED', amount: 1000, currency: 'USD' };
      const onSuccess = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPayment),
      });

      const { result } = renderHook(() => usePayments({ onSuccess }));

      await act(async () => {
        await result.current.create({ sourceId: 'token', amount: 1000 });
      });

      expect(onSuccess).toHaveBeenCalledWith(mockPayment);
    });

    it('should call onError callback', async () => {
      const onError = vi.fn();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Payment declined' }),
      });

      const { result } = renderHook(() => usePayments({ onError }));

      await act(async () => {
        try {
          await result.current.create({ sourceId: 'token', amount: 100 });
        } catch {
          // Error expected
        }
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError.mock.calls[0]?.[0]?.message).toBe('Payment declined');
    });
  });

  describe('reset', () => {
    it('should reset state', async () => {
      const mockPayment = { id: 'PAY_123', status: 'COMPLETED', amount: 1000, currency: 'USD' };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPayment),
      });

      const { result } = renderHook(() => usePayments());

      await act(async () => {
        await result.current.create({ sourceId: 'token', amount: 1000 });
      });

      expect(result.current.data).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should clear error state', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Error',
        json: () => Promise.resolve({ message: 'Failed' }),
      });

      const { result } = renderHook(() => usePayments());

      await act(async () => {
        try {
          await result.current.create({ sourceId: 'token', amount: 100 });
        } catch {
          // Error expected
        }
      });

      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
