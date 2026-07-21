import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { ProductsService } from '../services/products.service.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    products: {
      list: vi.fn(),
      retrieve: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

describe('ProductsService', () => {
  it('lists active products', async () => {
    const client = createMockClient({
      list: vi.fn().mockResolvedValue({ data: [{ id: 'prod_1' }], has_more: false }),
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
});
