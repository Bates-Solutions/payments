import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { CheckoutService } from '../services/checkout.service.js';
import { StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
        expire: vi.fn(),
        list: vi.fn(),
        ...overrides,
      },
    },
  } as unknown as Stripe;
}

const OPTS = {
  lineItems: [{ price: 'price_1', quantity: 1 }],
  successUrl: 'https://a/success',
  cancelUrl: 'https://a/cancel',
};

describe('CheckoutService', () => {
  describe('create', () => {
    it('creates a subscription-mode session', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'cs_1', url: 'https://checkout' }),
      });

      const service = new CheckoutService(client);
      const result = await service.create({ ...OPTS, customerId: 'cus_1', metadata: { user_id: 'u1' } });

      expect(result.url).toBe('https://checkout');
      expect(client.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          line_items: [{ price: 'price_1', quantity: 1 }],
          success_url: 'https://a/success',
          cancel_url: 'https://a/cancel',
          customer: 'cus_1',
          metadata: { user_id: 'u1' },
        }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('omits customer_email when a customer is provided', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'cs_1' }),
      });
      const service = new CheckoutService(client);
      await service.create({ ...OPTS, customerId: 'cus_1', customerEmail: 'a@b.com' });

      const params = (client.checkout.sessions.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(params.customer_email).toBeUndefined();
    });

    it('throws for empty line items', async () => {
      const service = new CheckoutService(createMockClient());
      await expect(
        service.create({ ...OPTS, lineItems: [] })
      ).rejects.toThrow(StripeValidationError);
    });

    it('throws for a missing successUrl', async () => {
      const service = new CheckoutService(createMockClient());
      await expect(service.create({ ...OPTS, successUrl: '' })).rejects.toThrow(StripeValidationError);
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(new CheckoutService(client).create(OPTS)).rejects.toThrow();
    });
  });

  describe('get / expire / list', () => {
    it('retrieves a session', async () => {
      const client = createMockClient({ retrieve: vi.fn().mockResolvedValue({ id: 'cs_1' }) });
      const result = await new CheckoutService(client).get('cs_1');
      expect(result.id).toBe('cs_1');
      expect(client.checkout.sessions.retrieve).toHaveBeenCalledWith('cs_1');
    });

    it('expires a session', async () => {
      const client = createMockClient({ expire: vi.fn().mockResolvedValue({ id: 'cs_1', status: 'expired' }) });
      const result = await new CheckoutService(client).expire('cs_1');
      expect(result.status).toBe('expired');
    });

    it('lists sessions', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ data: [{ id: 'cs_1' }], has_more: false }),
      });
      const result = await new CheckoutService(client).list({ customerId: 'cus_1' });
      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBe('cs_1');
    });

    it('rethrows errors from get, expire, and list', async () => {
      const err = { type: 'invalid_request_error', statusCode: 404 };
      await expect(
        new CheckoutService(createMockClient({ retrieve: vi.fn().mockRejectedValue(err) })).get('cs_x')
      ).rejects.toThrow();
      await expect(
        new CheckoutService(createMockClient({ expire: vi.fn().mockRejectedValue(err) })).expire('cs_x')
      ).rejects.toThrow();
      await expect(
        new CheckoutService(createMockClient({ list: vi.fn().mockRejectedValue(err) })).list()
      ).rejects.toThrow();
    });
  });
});
