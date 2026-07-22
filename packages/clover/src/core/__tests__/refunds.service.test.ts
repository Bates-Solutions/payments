import { describe, it, expect, vi } from 'vitest';
import { CloverHttp } from '../http.js';
import { RefundsService } from '../services/refunds.service.js';
import { CloverValidationError } from '../errors.js';

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
    headers: { get: () => null },
  });
}

function makeService(fetchImpl: typeof fetch) {
  return new RefundsService(new CloverHttp({ apiToken: 'tok', environment: 'sandbox', fetchImpl }));
}

describe('RefundsService', () => {
  it('creates a full refund for a charge', async () => {
    const fetchImpl = mockFetch({ id: 'REF_1', charge: 'CHG_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);

    const result = await service.create({ chargeId: 'CHG_1' });

    expect(result.id).toBe('REF_1');
    const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://scl-sandbox.dev.clover.com/v1/refunds');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ charge: 'CHG_1' });
    expect(init.headers['idempotency-key']).toEqual(expect.any(String));
  });

  it('creates a partial refund with a reason', async () => {
    const fetchImpl = mockFetch({ id: 'REF_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);

    await service.create({ chargeId: 'CHG_1', amount: 250, reason: 'requested_by_customer' });

    const [, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({ charge: 'CHG_1', amount: 250, reason: 'requested_by_customer' });
  });

  it('throws when chargeId is missing', async () => {
    const service = makeService(mockFetch(undefined) as unknown as typeof fetch);
    await expect(service.create({ chargeId: '' })).rejects.toThrow(CloverValidationError);
  });

  it('throws for a non-positive amount', async () => {
    const service = makeService(mockFetch(undefined) as unknown as typeof fetch);
    await expect(service.create({ chargeId: 'CHG_1', amount: 0 })).rejects.toThrow(CloverValidationError);
  });

  it('retrieves a refund by id', async () => {
    const fetchImpl = mockFetch({ id: 'REF_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);

    const result = await service.get('REF_1');

    expect(result.id).toBe('REF_1');
    const [url] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://scl-sandbox.dev.clover.com/v1/refunds/REF_1');
  });

  it('rethrows API errors', async () => {
    const service = makeService(mockFetch({ message: 'nope' }, 500) as unknown as typeof fetch);
    await expect(service.get('REF_x')).rejects.toThrow();
  });
});
