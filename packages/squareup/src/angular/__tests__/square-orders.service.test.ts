import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SquareOrdersService } from '../services/square-orders.service.js';
import { firstValueFrom } from 'rxjs';

describe('SquareOrdersService', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function createService(): SquareOrdersService {
    // Create service directly - no DI dependencies
    return new SquareOrdersService();
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

  describe('create', () => {
    it('should post order to API', async () => {
      const mockOrder = { id: 'ORDER_123', state: 'OPEN' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.create({
          lineItems: [{ name: 'Coffee', quantity: '1', basePriceMoney: { amount: 500 } }],
        })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual({ order: mockOrder });
    });

    it('should include idempotencyKey', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.create({ lineItems: [] }));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.idempotencyKey).toBeDefined();
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.create({ lineItems: [] }, '/custom/orders'));

      expect(fetch).toHaveBeenCalledWith('/custom/orders', expect.anything());
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid order' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.create({ lineItems: [] }))).rejects.toThrow(
        'Invalid order'
      );
    });

    it('should set loading state', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      const loadingStates: boolean[] = [];
      service.loading$.subscribe((l) => loadingStates.push(l));

      await firstValueFrom(service.create({ lineItems: [] }));

      expect(loadingStates).toContain(true);
      expect(loadingStates[loadingStates.length - 1]).toBe(false);
    });
  });

  describe('retrieve', () => {
    it('should get order by ID', async () => {
      const mockOrder = { id: 'ORDER_123', state: 'COMPLETED' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder }),
      });

      const service = createService();

      const result = await firstValueFrom(service.retrieve('ORDER_123'));

      expect(fetch).toHaveBeenCalledWith(
        '/api/orders/ORDER_123',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ order: mockOrder });
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.retrieve('ORDER_123', '/custom/orders'));

      expect(fetch).toHaveBeenCalledWith('/custom/orders/ORDER_123', expect.anything());
    });

    it('should handle not found errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Order not found' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.retrieve('INVALID_ID'))).rejects.toThrow(
        'Order not found'
      );
    });
  });

  describe('update', () => {
    it('should update order by ID', async () => {
      const mockOrder = { id: 'ORDER_123', state: 'OPEN' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.update('ORDER_123', {
          lineItems: [{ name: 'Tea', quantity: '2', basePriceMoney: { amount: 300 } }],
        })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/orders/ORDER_123',
        expect.objectContaining({ method: 'PUT' })
      );
      expect(result).toEqual({ order: mockOrder });
    });

    it('should include idempotencyKey', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();
      await firstValueFrom(service.update('ORDER_123', {}));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.idempotencyKey).toBeDefined();
    });
  });

  describe('pay', () => {
    it('should pay for order', async () => {
      const mockOrder = { id: 'ORDER_123', state: 'COMPLETED' };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder }),
      });

      const service = createService();

      const result = await firstValueFrom(service.pay('ORDER_123', ['PAY_123', 'PAY_456']));

      expect(fetch).toHaveBeenCalledWith(
        '/api/orders/ORDER_123/pay',
        expect.objectContaining({ method: 'POST' })
      );

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.paymentIds).toEqual(['PAY_123', 'PAY_456']);
      expect(result).toEqual({ order: mockOrder });
    });

    it('should handle payment errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Payment failed' }),
      });

      const service = createService();

      await expect(firstValueFrom(service.pay('ORDER_123', ['PAY_123']))).rejects.toThrow(
        'Payment failed'
      );
    });
  });
});
