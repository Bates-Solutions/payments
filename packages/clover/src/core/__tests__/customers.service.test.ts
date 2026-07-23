import { describe, it, expect, vi } from 'vitest';
import { CloverHttp } from '../http.js';
import { CustomersService } from '../services/customers.service.js';
import { CloverValidationError } from '../errors.js';

function mockFetch(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
    headers: { get: () => null },
  });
}

function makeService(fetchImpl: typeof fetch, merchantId: string | undefined = 'MERCH_1') {
  return new CustomersService(
    new CloverHttp({ apiToken: 'tok', merchantId, environment: 'production', fetchImpl })
  );
}

function serviceWithoutMerchant(fetchImpl: typeof fetch) {
  return new CustomersService(new CloverHttp({ apiToken: 'tok', environment: 'production', fetchImpl }));
}

describe('CustomersService', () => {
  it('creates a customer on the platform host, mapping email/phone to arrays', async () => {
    const fetchImpl = mockFetch({ id: 'CUS_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);

    const result = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+15551234567',
    });

    expect(result.id).toBe('CUS_1');
    const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://api.clover.com/v3/merchants/MERCH_1/customers');
    expect(init.method).toBe('POST');
    // A mutating call defaults to a generated idempotency key.
    expect(init.headers['idempotency-key']).toEqual(expect.any(String));
    expect(JSON.parse(init.body)).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      emailAddresses: [{ emailAddress: 'john@example.com' }],
      phoneNumbers: [{ phoneNumber: '+15551234567' }],
    });
  });

  it('throws when no identifying field is provided', async () => {
    const service = makeService(mockFetch(undefined) as unknown as typeof fetch);
    await expect(service.create({})).rejects.toThrow(CloverValidationError);
  });

  it('throws a clear error when merchantId is missing', async () => {
    const service = serviceWithoutMerchant(mockFetch(undefined) as unknown as typeof fetch);
    await expect(service.create({ email: 'a@b.com' })).rejects.toThrow(/merchantId is required/);
  });

  it('retrieves a customer by id', async () => {
    const fetchImpl = mockFetch({ id: 'CUS_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);
    await service.get('CUS_1');
    const [url] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://api.clover.com/v3/merchants/MERCH_1/customers/CUS_1');
  });

  it('updates a customer via POST', async () => {
    const fetchImpl = mockFetch({ id: 'CUS_1' });
    const service = makeService(fetchImpl as unknown as typeof fetch);
    await service.update('CUS_1', { firstName: 'Jane' });
    const [url, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://api.clover.com/v3/merchants/MERCH_1/customers/CUS_1');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({ firstName: 'Jane' });
  });

  it('deletes a customer', async () => {
    const fetchImpl = mockFetch(undefined, 200);
    const service = makeService(fetchImpl as unknown as typeof fetch);
    await service.delete('CUS_1');
    const [, init] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe('DELETE');
  });

  it('lists customers, unwrapping the elements envelope', async () => {
    const fetchImpl = mockFetch({ elements: [{ id: 'CUS_1' }, { id: 'CUS_2' }], href: 'x' });
    const service = makeService(fetchImpl as unknown as typeof fetch);

    const result = await service.list({ limit: 10, offset: 20 });

    expect(result.data).toHaveLength(2);
    const [url] = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toBe('https://api.clover.com/v3/merchants/MERCH_1/customers?limit=10&offset=20');
  });

  it('rethrows API errors', async () => {
    const service = makeService(mockFetch({ message: 'boom' }, 500) as unknown as typeof fetch);
    await expect(service.get('CUS_x')).rejects.toThrow();
  });
});
