import { describe, it, expect } from 'vitest';
import { createCloverClient, CloverClient } from '../client.js';
import { PaymentsService } from '../services/payments.service.js';
import { RefundsService } from '../services/refunds.service.js';
import { CustomersService } from '../services/customers.service.js';

describe('CloverClient', () => {
  it('creates a client and wires up services', () => {
    const client = createCloverClient({ apiToken: 'tok', merchantId: 'M1' });
    expect(client).toBeInstanceOf(CloverClient);
    expect(client.payments).toBeInstanceOf(PaymentsService);
    expect(client.refunds).toBeInstanceOf(RefundsService);
    expect(client.customers).toBeInstanceOf(CustomersService);
  });

  it('defaults to the sandbox environment', () => {
    const client = createCloverClient({ apiToken: 'tok' });
    expect(client.environment).toBe('sandbox');
    expect(client.merchantId).toBeUndefined();
  });

  it('exposes the configured environment and merchantId', () => {
    const client = createCloverClient({ apiToken: 'tok', merchantId: 'M1', environment: 'production' });
    expect(client.environment).toBe('production');
    expect(client.merchantId).toBe('M1');
  });

  it('throws when apiToken is missing', () => {
    expect(() => createCloverClient({ apiToken: '' })).toThrow('apiToken is required');
  });
});
