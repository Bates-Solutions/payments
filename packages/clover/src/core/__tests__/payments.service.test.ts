import { describe, it, expect, vi } from 'vitest';
import { CloverHttp } from '../http.js';
import { PaymentsService } from '../services/payments.service.js';
import { CloverValidationError, CloverPaymentError } from '../errors.js';

interface MockResponseInit {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

function mockFetch(init: MockResponseInit = {}) {
  const status = init.status ?? 200;
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(init.body === undefined ? '' : JSON.stringify(init.body)),
    headers: { get: (k: string) => init.headers?.[k] ?? null },
  });
}

function makeService(fetchImpl: typeof fetch) {
  const http = new CloverHttp({ apiToken: 'tok_test', environment: 'sandbox', fetchImpl });
  return new PaymentsService(http);
}

describe('PaymentsService', () => {
  describe('create', () => {
    it('creates a charge against the ecommerce host', async () => {
      const fetchImpl = mockFetch({ body: { id: 'CHG_1', amount: 1000, paid: true } });
      const service = makeService(fetchImpl as unknown as typeof fetch);

      const result = await service.create({ amount: 1000, source: 'clv_tok', description: 'Test' });

      expect(result).toEqual({ id: 'CHG_1', amount: 1000, paid: true });

      const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(String(url)).toBe('https://scl-sandbox.dev.clover.com/v1/charges');
      expect(init.method).toBe('POST');
      expect(init.headers.Authorization).toBe('Bearer tok_test');
      expect(init.headers['idempotency-key']).toEqual(expect.any(String));
      expect(JSON.parse(init.body)).toMatchObject({
        amount: 1000,
        currency: 'usd',
        source: 'clv_tok',
        capture: true,
        description: 'Test',
      });
    });

    it('honors a custom idempotency key and capture:false', async () => {
      const fetchImpl = mockFetch({ body: { id: 'CHG_1' } });
      const service = makeService(fetchImpl as unknown as typeof fetch);

      await service.create({ amount: 500, source: 'clv_tok', capture: false, idempotencyKey: 'key-1' });

      const [, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(init.headers['idempotency-key']).toBe('key-1');
      expect(JSON.parse(init.body).capture).toBe(false);
    });

    it('throws for a missing source', async () => {
      const service = makeService(mockFetch() as unknown as typeof fetch);
      await expect(service.create({ amount: 1000, source: '' })).rejects.toThrow(CloverValidationError);
    });

    it('throws for a non-positive amount', async () => {
      const service = makeService(mockFetch() as unknown as typeof fetch);
      await expect(service.create({ amount: 0, source: 'clv_tok' })).rejects.toThrow(
        CloverValidationError
      );
    });

    it('maps a 402 to CloverPaymentError', async () => {
      const fetchImpl = mockFetch({
        status: 402,
        body: { error: { code: 'card_declined', message: 'Your card was declined', decline_code: 'insufficient_funds' } },
      });
      const service = makeService(fetchImpl as unknown as typeof fetch);
      await expect(service.create({ amount: 1000, source: 'clv_tok' })).rejects.toThrow(
        CloverPaymentError
      );
    });
  });

  describe('get', () => {
    it('retrieves a charge by id', async () => {
      const fetchImpl = mockFetch({ body: { id: 'CHG_1' } });
      const service = makeService(fetchImpl as unknown as typeof fetch);

      const result = await service.get('CHG_1');

      expect(result.id).toBe('CHG_1');
      const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(String(url)).toBe('https://scl-sandbox.dev.clover.com/v1/charges/CHG_1');
      expect(init.method).toBe('GET');
    });

    it('maps a 404 to a thrown error', async () => {
      const fetchImpl = mockFetch({ status: 404, body: { message: 'Not found' } });
      const service = makeService(fetchImpl as unknown as typeof fetch);
      await expect(service.get('CHG_x')).rejects.toThrow();
    });
  });

  describe('capture', () => {
    it('captures with an amount', async () => {
      const fetchImpl = mockFetch({ body: { id: 'CHG_1', captured: true } });
      const service = makeService(fetchImpl as unknown as typeof fetch);

      const result = await service.capture('CHG_1', { amount: 800 });

      expect(result.captured).toBe(true);
      const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(String(url)).toBe('https://scl-sandbox.dev.clover.com/v1/charges/CHG_1/capture');
      expect(JSON.parse(init.body)).toEqual({ amount: 800 });
    });
  });
});
