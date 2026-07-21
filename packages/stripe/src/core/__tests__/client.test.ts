import { describe, it, expect } from 'vitest';
import { createStripeClient, StripeClient } from '../client.js';
import { PaymentsService } from '../services/payments.service.js';
import { CustomersService } from '../services/customers.service.js';
import { RefundsService } from '../services/refunds.service.js';

describe('StripeClient', () => {
  it('creates a client and wires up services', () => {
    const client = createStripeClient({ apiKey: 'sk_test_123' });

    expect(client).toBeInstanceOf(StripeClient);
    expect(client.payments).toBeInstanceOf(PaymentsService);
    expect(client.customers).toBeInstanceOf(CustomersService);
    expect(client.refunds).toBeInstanceOf(RefundsService);
  });

  it('derives the test environment from a test key', () => {
    const client = createStripeClient({ apiKey: 'sk_test_123' });
    expect(client.environment).toBe('test');
  });

  it('derives the live environment from a live key', () => {
    const client = createStripeClient({ apiKey: 'sk_live_123' });
    expect(client.environment).toBe('live');
  });

  it('exposes the underlying SDK', () => {
    const client = createStripeClient({ apiKey: 'sk_test_123' });
    expect(client.sdk).toBeDefined();
    expect(typeof client.sdk.paymentIntents.create).toBe('function');
  });

  it('throws when apiKey is missing', () => {
    expect(() => createStripeClient({ apiKey: '' })).toThrow('apiKey is required');
  });
});
