import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { PricesService } from '../services/prices.service.js';
import { StripeApiError, StripeValidationError } from '../errors.js';

function createMockClient(
  overrides: Record<string, unknown> = {},
  productOverrides: Record<string, unknown> = {}
): Stripe {
  return {
    prices: {
      list: vi.fn(),
      retrieve: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      ...overrides,
    },
    products: {
      update: vi.fn(),
      ...productOverrides,
    },
  } as unknown as Stripe;
}

const oldPrice = {
  id: 'price_old',
  billing_scheme: 'per_unit',
  currency: 'usd',
  unit_amount: 899,
  nickname: 'Loaf',
  metadata: { sku: 'SD-001' },
  tax_behavior: 'exclusive',
  lookup_key: 'loaf',
  recurring: null,
  product: { id: 'prod_1', default_price: 'price_other' },
};

describe('PricesService', () => {
  it('lists active prices with the product expanded', async () => {
    const client = createMockClient({
      list: vi.fn().mockResolvedValue({
        data: [{ id: "price_1", product: { id: "prod_1", metadata: { tier: "pro" } } }],
        has_more: true,
      }),
    });

    const service = new PricesService(client);
    const result = await service.list({ active: true, expandProduct: true });

    expect(result.data).toHaveLength(1);
    expect(result.nextCursor).toBe('price_1');
    expect(client.prices.list).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, expand: ['data.product'] })
    );
  });

  it('omits expand when not requested', async () => {
    const client = createMockClient({
      list: vi.fn().mockResolvedValue({ data: [], has_more: false }),
    });
    await new PricesService(client).list({ active: true });
    const params = (client.prices.list as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(params.expand).toBeUndefined();
  });

  it('retrieves a price with product expansion', async () => {
    const client = createMockClient({ retrieve: vi.fn().mockResolvedValue({ id: 'price_1' }) });
    await new PricesService(client).get('price_1', { expandProduct: true });
    expect(client.prices.retrieve).toHaveBeenCalledWith('price_1', { expand: ['product'] });
  });

  it('rethrows API errors', async () => {
    const client = createMockClient({
      list: vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 }),
    });
    await expect(new PricesService(client).list()).rejects.toThrow();
  });

  describe('create', () => {
    it('creates a one-time price', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({ id: 'price_1' }) });

      await new PricesService(client).create({
        product: 'prod_1',
        unitAmount: 899,
        currency: 'usd',
        metadata: { sku: 'SD-001' },
      });

      expect(client.prices.create).toHaveBeenCalledWith(
        {
          product: 'prod_1',
          unit_amount: 899,
          currency: 'usd',
          recurring: undefined,
          nickname: undefined,
          lookup_key: undefined,
          transfer_lookup_key: undefined,
          active: undefined,
          metadata: { sku: 'SD-001' },
        },
        { idempotencyKey: expect.any(String) }
      );
    });

    it('maps a recurring interval and the optional fields', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({ id: 'price_1' }) });

      await new PricesService(client).create({
        product: 'prod_1',
        unitAmount: 0,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 3 },
        nickname: 'Quarterly',
        lookupKey: 'quarterly',
        transferLookupKey: true,
        active: false,
        idempotencyKey: 'k1',
      });

      expect(client.prices.create).toHaveBeenCalledWith(
        expect.objectContaining({
          unit_amount: 0,
          recurring: { interval: 'month', interval_count: 3 },
          nickname: 'Quarterly',
          lookup_key: 'quarterly',
          transfer_lookup_key: true,
          active: false,
        }),
        { idempotencyKey: 'k1' }
      );
    });

    it('validates product, unitAmount and currency', async () => {
      const service = new PricesService(createMockClient());
      const base = { product: 'prod_1', unitAmount: 100, currency: 'usd' };

      await expect(service.create({ ...base, product: '' })).rejects.toMatchObject({
        field: 'product',
      });
      await expect(service.create({ ...base, currency: '' })).rejects.toMatchObject({
        field: 'currency',
      });
      for (const unitAmount of [-1, 1.5, Number.NaN, '100' as unknown as number]) {
        await expect(service.create({ ...base, unitAmount })).rejects.toMatchObject({
          field: 'unitAmount',
        });
      }
    });

    it('normalizes API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(
        new PricesService(client).create({ product: 'prod_1', unitAmount: 1, currency: 'usd' })
      ).rejects.toThrow(StripeApiError);
    });
  });

  describe('update and archive', () => {
    it('updates the mutable fields', async () => {
      const client = createMockClient({ update: vi.fn().mockResolvedValue({ id: 'price_1' }) });

      await new PricesService(client).update('price_1', {
        nickname: 'New',
        lookupKey: 'new',
        transferLookupKey: true,
        metadata: { a: 'b' },
        idempotencyKey: 'k1',
      });

      expect(client.prices.update).toHaveBeenCalledWith(
        'price_1',
        {
          active: undefined,
          nickname: 'New',
          lookup_key: 'new',
          transfer_lookup_key: true,
          metadata: { a: 'b' },
        },
        { idempotencyKey: 'k1' }
      );
    });

    it('archives a price', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ id: 'price_1', active: false }),
      });
      await new PricesService(client).archive('price_1');
      expect(client.prices.update).toHaveBeenCalledWith(
        'price_1',
        expect.objectContaining({ active: false }),
        { idempotencyKey: expect.any(String) }
      );
    });

    it('throws when priceId is missing', async () => {
      const service = new PricesService(createMockClient());
      await expect(service.update('', { active: true })).rejects.toMatchObject({
        field: 'priceId',
      });
      await expect(service.archive('')).rejects.toThrow(StripeValidationError);
    });

    it('normalizes API errors', async () => {
      const client = createMockClient({
        update: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      await expect(new PricesService(client).archive('price_x')).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });
  });

  describe('replace', () => {
    it('creates a copy with the new amount, then deactivates the old price', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(oldPrice),
        create: vi.fn().mockResolvedValue({ id: 'price_new' }),
        update: vi.fn().mockResolvedValue({ id: 'price_old', active: false }),
      });

      const result = await new PricesService(client).replace('price_old', {
        unitAmount: 949,
        idempotencyKey: 'reprice-1',
      });

      expect(result.price.id).toBe('price_new');
      expect(result.previous.active).toBe(false);
      expect(client.prices.retrieve).toHaveBeenCalledWith('price_old', { expand: ['product'] });
      expect(client.prices.create).toHaveBeenCalledWith(
        {
          product: 'prod_1',
          unit_amount: 949,
          currency: 'usd',
          recurring: undefined,
          nickname: 'Loaf',
          metadata: { sku: 'SD-001' },
          tax_behavior: 'exclusive',
          lookup_key: 'loaf',
          transfer_lookup_key: true,
        },
        { idempotencyKey: 'reprice-1:create' }
      );
      expect(client.prices.update).toHaveBeenCalledWith(
        'price_old',
        { active: false },
        { idempotencyKey: 'reprice-1:archive' }
      );
      // Not the default price, so the product is left alone.
      expect(client.products.update).not.toHaveBeenCalled();
    });

    it('creates the new price before deactivating the old one', async () => {
      const order: string[] = [];
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(oldPrice),
        create: vi.fn().mockImplementation(() => {
          order.push('create');
          return Promise.resolve({ id: 'price_new' });
        }),
        update: vi.fn().mockImplementation(() => {
          order.push('archive');
          return Promise.resolve({ id: 'price_old' });
        }),
      });
      await new PricesService(client).replace('price_old', { unitAmount: 949 });
      expect(order).toEqual(['create', 'archive']);
    });

    it('moves the default price to the new price first', async () => {
      const order: string[] = [];
      const client = createMockClient(
        {
          retrieve: vi.fn().mockResolvedValue({
            ...oldPrice,
            lookup_key: null,
            nickname: null,
            tax_behavior: null,
            product: { id: 'prod_1', default_price: { id: 'price_old' } },
          }),
          create: vi.fn().mockResolvedValue({ id: 'price_new' }),
          update: vi.fn().mockImplementation(() => {
            order.push('archive');
            return Promise.resolve({ id: 'price_old' });
          }),
        },
        {
          update: vi.fn().mockImplementation(() => {
            order.push('default');
            return Promise.resolve({ id: 'prod_1' });
          }),
        }
      );

      await new PricesService(client).replace('price_old', {
        unitAmount: 949,
        idempotencyKey: 'r2',
      });

      expect(client.products.update).toHaveBeenCalledWith(
        'prod_1',
        { default_price: 'price_new' },
        { idempotencyKey: 'r2:default-price' }
      );
      expect(order).toEqual(['default', 'archive']);
      const params = (client.prices.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(params.lookup_key).toBeUndefined();
      expect(params.transfer_lookup_key).toBeUndefined();
      expect(params.nickname).toBeUndefined();
      expect(params.tax_behavior).toBeUndefined();
    });

    it('copies a recurring interval unless overridden', async () => {
      const recurringPrice = {
        ...oldPrice,
        recurring: { interval: 'month', interval_count: 1 },
      };
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(recurringPrice),
        create: vi.fn().mockResolvedValue({ id: 'price_new' }),
        update: vi.fn().mockResolvedValue({ id: 'price_old' }),
      });
      const service = new PricesService(client);

      await service.replace('price_old', { unitAmount: 2900 });
      await service.replace('price_old', {
        unitAmount: 29000,
        currency: 'cad',
        nickname: 'Yearly',
        metadata: { plan: 'y' },
        recurring: { interval: 'year' },
      });

      const calls = (client.prices.create as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls[0][0]).toMatchObject({ recurring: { interval: 'month', interval_count: 1 } });
      expect(calls[1][0]).toMatchObject({
        currency: 'cad',
        nickname: 'Yearly',
        metadata: { plan: 'y' },
        recurring: { interval: 'year', interval_count: undefined },
      });
    });

    it('works when the product is not expanded', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ ...oldPrice, product: 'prod_1' }),
        create: vi.fn().mockResolvedValue({ id: 'price_new' }),
        update: vi.fn().mockResolvedValue({ id: 'price_old' }),
      });
      await new PricesService(client).replace('price_old', { unitAmount: 1 });
      expect(client.prices.create).toHaveBeenCalledWith(
        expect.objectContaining({ product: 'prod_1' }),
        expect.anything()
      );
      expect(client.products.update).not.toHaveBeenCalled();
    });

    it('derives step keys from a generated key when none is given', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(oldPrice),
        create: vi.fn().mockResolvedValue({ id: 'price_new' }),
        update: vi.fn().mockResolvedValue({ id: 'price_old' }),
      });
      await new PricesService(client).replace('price_old', { unitAmount: 1 });
      const createKey = (client.prices.create as ReturnType<typeof vi.fn>).mock.calls[0][1]
        .idempotencyKey as string;
      const archiveKey = (client.prices.update as ReturnType<typeof vi.fn>).mock.calls[0][2]
        .idempotencyKey as string;
      expect(createKey).toMatch(/^[0-9a-f-]{36}:create$/);
      expect(archiveKey).toBe(createKey.replace(':create', ':archive'));
    });

    it('refuses tiered prices', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ ...oldPrice, billing_scheme: 'tiered' }),
      });
      await expect(
        new PricesService(client).replace('price_old', { unitAmount: 1 })
      ).rejects.toThrow(StripeValidationError);
      expect(client.prices.create).not.toHaveBeenCalled();
    });

    it('refuses a price with no product', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ ...oldPrice, product: null }),
      });
      await expect(
        new PricesService(client).replace('price_old', { unitAmount: 1 })
      ).rejects.toThrow('price has no product');
    });

    it('validates its input before calling Stripe', async () => {
      const client = createMockClient();
      const service = new PricesService(client);
      await expect(service.replace('', { unitAmount: 1 })).rejects.toMatchObject({
        field: 'priceId',
      });
      await expect(service.replace('price_old', { unitAmount: -5 })).rejects.toMatchObject({
        field: 'unitAmount',
      });
      expect(client.prices.retrieve).not.toHaveBeenCalled();
    });

    it('does not deactivate the old price when the create fails', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(oldPrice),
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(
        new PricesService(client).replace('price_old', { unitAmount: 1 })
      ).rejects.toThrow(StripeApiError);
      expect(client.prices.update).not.toHaveBeenCalled();
    });
  });
});
