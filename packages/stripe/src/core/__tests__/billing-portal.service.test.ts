import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { BillingPortalService } from '../services/billing-portal.service.js';
import { StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    billingPortal: {
      sessions: {
        create: vi.fn(),
        ...overrides,
      },
    },
  } as unknown as Stripe;
}

describe('BillingPortalService', () => {
  it('creates a portal session', async () => {
    const client = createMockClient({
      create: vi.fn().mockResolvedValue({ id: 'bps_1', url: 'https://portal' }),
    });

    const service = new BillingPortalService(client);
    const result = await service.create({ customerId: 'cus_1', returnUrl: 'https://a/account' });

    expect(result.url).toBe('https://portal');
    expect(client.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ customer: 'cus_1', return_url: 'https://a/account' }),
      expect.objectContaining({ idempotencyKey: expect.any(String) })
    );
  });

  it('throws when customerId is missing', async () => {
    const service = new BillingPortalService(createMockClient());
    await expect(service.create({ customerId: '' })).rejects.toThrow(StripeValidationError);
  });

  it('rethrows API errors', async () => {
    const client = createMockClient({
      create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
    });
    await expect(new BillingPortalService(client).create({ customerId: 'cus_1' })).rejects.toThrow();
  });
});
