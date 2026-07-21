import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { SubscriptionsService, normalizeSubscription } from '../services/subscriptions.service.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    subscriptions: {
      retrieve: vi.fn(),
      list: vi.fn(),
      cancel: vi.fn(),
      update: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

// Newer API shape: current_period_* live on the item.
function subWithItemPeriod(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub_1',
    status: 'active',
    customer: 'cus_1',
    cancel_at_period_end: false,
    canceled_at: null,
    trial_end: null,
    items: {
      data: [
        {
          id: 'si_1',
          quantity: 2,
          price: { id: 'price_1' },
          current_period_start: 1700000000,
          current_period_end: 1702592000,
        },
      ],
    },
    ...overrides,
  } as unknown as Stripe.Subscription;
}

describe('normalizeSubscription', () => {
  it('normalizes period from the subscription item (newer API)', () => {
    const result = normalizeSubscription(subWithItemPeriod());

    expect(result.id).toBe('sub_1');
    expect(result.status).toBe('active');
    expect(result.customerId).toBe('cus_1');
    expect(result.priceId).toBe('price_1');
    expect(result.quantity).toBe(2);
    expect(result.currentPeriodStart?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
    expect(result.currentPeriodEnd).toBeInstanceOf(Date);
    expect(result.items).toHaveLength(1);
    expect(result.raw.id).toBe('sub_1');
  });

  it('falls back to subscription-level period (older API)', () => {
    const legacy = {
      id: 'sub_2',
      status: 'active',
      customer: { id: 'cus_2' },
      cancel_at_period_end: true,
      canceled_at: null,
      trial_end: null,
      current_period_start: 1700000000,
      current_period_end: 1702592000,
      items: { data: [{ id: 'si_2', quantity: 1, price: { id: 'price_2' } }] },
    } as unknown as Stripe.Subscription;

    const result = normalizeSubscription(legacy);

    expect(result.customerId).toBe('cus_2');
    expect(result.cancelAtPeriodEnd).toBe(true);
    expect(result.currentPeriodStart?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });
});

describe('SubscriptionsService', () => {
  it('retrieves and normalizes', async () => {
    const client = createMockClient({
      retrieve: vi.fn().mockResolvedValue(subWithItemPeriod()),
    });
    const result = await new SubscriptionsService(client).get('sub_1');
    expect(result.priceId).toBe('price_1');
    expect(client.subscriptions.retrieve).toHaveBeenCalledWith('sub_1');
  });

  it('lists and normalizes', async () => {
    const client = createMockClient({
      list: vi.fn().mockResolvedValue({ data: [subWithItemPeriod()], has_more: true }),
    });
    const result = await new SubscriptionsService(client).list({ customerId: 'cus_1' });
    expect(result.data[0].id).toBe('sub_1');
    expect(result.nextCursor).toBe('sub_1');
  });

  it('cancels immediately', async () => {
    const cancel = vi.fn().mockResolvedValue(subWithItemPeriod({ status: 'canceled' }));
    const client = createMockClient({ cancel });
    const result = await new SubscriptionsService(client).cancel('sub_1');
    expect(result.status).toBe('canceled');
    expect(cancel).toHaveBeenCalledWith('sub_1');
  });

  it('cancels at period end via update', async () => {
    const update = vi.fn().mockResolvedValue(subWithItemPeriod({ cancel_at_period_end: true }));
    const client = createMockClient({ update });
    const result = await new SubscriptionsService(client).cancel('sub_1', { atPeriodEnd: true });
    expect(result.cancelAtPeriodEnd).toBe(true);
    expect(update).toHaveBeenCalledWith('sub_1', { cancel_at_period_end: true });
  });

  it('resumes a subscription', async () => {
    const update = vi.fn().mockResolvedValue(subWithItemPeriod());
    const client = createMockClient({ update });
    await new SubscriptionsService(client).resume('sub_1');
    expect(update).toHaveBeenCalledWith('sub_1', { cancel_at_period_end: false });
  });

  it('rethrows API errors', async () => {
    const client = createMockClient({
      retrieve: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
    });
    await expect(new SubscriptionsService(client).get('sub_x')).rejects.toThrow();
  });
});
