import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { ProductsService } from '../services/products.service.js';
import { StripeApiError, StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    products: {
      list: vi.fn(),
      retrieve: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

describe('ProductsService', () => {
  it('lists active products', async () => {
    const client = createMockClient({
      list: vi.fn().mockResolvedValue({ data: [{ id: "prod_1" }], has_more: true }),
    });
    const result = await new ProductsService(client).list({ active: true });
    expect(result.data).toHaveLength(1);
    expect(result.nextCursor).toBe('prod_1');
    expect(client.products.list).toHaveBeenCalledWith(
      expect.objectContaining({ active: true })
    );
  });

  it('retrieves a product', async () => {
    const client = createMockClient({
      retrieve: vi.fn().mockResolvedValue({ id: 'prod_1', metadata: { tier: 'pro' } }),
    });
    const result = await new ProductsService(client).get('prod_1');
    expect(result.metadata.tier).toBe('pro');
    expect(client.products.retrieve).toHaveBeenCalledWith('prod_1');
  });

  it('rethrows API errors', async () => {
    const client = createMockClient({
      retrieve: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
    });
    await expect(new ProductsService(client).get('prod_x')).rejects.toThrow();
  });

  describe('create', () => {
    it('creates a product with metadata and a generated idempotency key', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'prod_1', name: 'Loaf' }),
      });

      const result = await new ProductsService(client).create({
        name: 'Loaf',
        description: 'Sourdough',
        active: false,
        images: ['https://example.com/loaf.png'],
        metadata: { sku: 'SD-001' },
      });

      expect(result.id).toBe('prod_1');
      expect(client.products.create).toHaveBeenCalledWith(
        {
          name: 'Loaf',
          description: 'Sourdough',
          active: false,
          images: ['https://example.com/loaf.png'],
          metadata: { sku: 'SD-001' },
        },
        { idempotencyKey: expect.any(String) }
      );
    });

    it('uses the caller idempotency key', async () => {
      const client = createMockClient({ create: vi.fn().mockResolvedValue({ id: 'prod_1' }) });
      await new ProductsService(client).create({ name: 'Loaf', idempotencyKey: 'sync-SD-001' });
      expect(client.products.create).toHaveBeenCalledWith(expect.anything(), {
        idempotencyKey: 'sync-SD-001',
      });
    });

    it('throws when name is missing or blank', async () => {
      const service = new ProductsService(createMockClient());
      await expect(service.create({ name: '' })).rejects.toThrow(StripeValidationError);
      await expect(service.create({ name: '   ' })).rejects.toMatchObject({ field: 'name' });
      await expect(service.create({} as { name: string })).rejects.toThrow(StripeValidationError);
    });

    it('normalizes API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(new ProductsService(client).create({ name: 'Loaf' })).rejects.toThrow(
        StripeApiError
      );
    });
  });

  describe('update', () => {
    it('sends only the given fields', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ id: 'prod_1', name: 'Big loaf' }),
      });

      await new ProductsService(client).update('prod_1', {
        name: 'Big loaf',
        defaultPriceId: 'price_2',
        idempotencyKey: 'k1',
      });

      expect(client.products.update).toHaveBeenCalledWith(
        'prod_1',
        {
          name: 'Big loaf',
          description: undefined,
          active: undefined,
          images: undefined,
          metadata: undefined,
          default_price: 'price_2',
        },
        { idempotencyKey: 'k1' }
      );
    });

    it('generates an idempotency key when none is given', async () => {
      const client = createMockClient({ update: vi.fn().mockResolvedValue({ id: 'prod_1' }) });
      await new ProductsService(client).update('prod_1', { description: '' });
      expect(client.products.update).toHaveBeenCalledWith(
        'prod_1',
        expect.objectContaining({ description: '' }),
        { idempotencyKey: expect.any(String) }
      );
    });

    it('throws when productId is missing', async () => {
      const service = new ProductsService(createMockClient());
      await expect(service.update('', { name: 'x' })).rejects.toMatchObject({
        field: 'productId',
      });
    });

    it('throws when name is given but blank', async () => {
      const service = new ProductsService(createMockClient());
      await expect(service.update('prod_1', { name: ' ' })).rejects.toMatchObject({
        field: 'name',
      });
    });

    it('normalizes API errors', async () => {
      const client = createMockClient({
        update: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      await expect(
        new ProductsService(client).update('prod_x', { active: true })
      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });
  });

  describe('archive', () => {
    it('sets active to false', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ id: 'prod_1', active: false }),
      });
      const result = await new ProductsService(client).archive('prod_1', { idempotencyKey: 'a1' });
      expect(result.active).toBe(false);
      expect(client.products.update).toHaveBeenCalledWith(
        'prod_1',
        expect.objectContaining({ active: false }),
        { idempotencyKey: 'a1' }
      );
    });

    it('throws when productId is missing', async () => {
      await expect(new ProductsService(createMockClient()).archive('')).rejects.toThrow(
        StripeValidationError
      );
    });
  });
});
