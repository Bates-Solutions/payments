import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { PricesService } from '../services/prices.service.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    prices: {
      list: vi.fn(),
      retrieve: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

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
});
