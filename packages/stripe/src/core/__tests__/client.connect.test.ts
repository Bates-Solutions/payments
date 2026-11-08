import { describe, it, expect, vi, beforeEach } from 'vitest';

// Record every SDK instance the wrapper constructs, so the tests can check
// which config (and so which Stripe-Account header) each call goes out with.
const instances: { apiKey: string; config: Record<string, unknown>; oauth: Record<string, unknown> }[] =
  [];

vi.mock('stripe', () => {
  class FakeStripe {
    oauth = {
      token: vi.fn().mockResolvedValue({ stripe_user_id: 'acct_new' }),
      deauthorize: vi.fn(),
    };
    constructor(apiKey: string, config: Record<string, unknown>) {
      instances.push({ apiKey, config, oauth: this.oauth });
    }
  }
  return { default: FakeStripe };
});

const { createStripeClient } = await import('../client.js');
const { StripeValidationError } = await import('../errors.js');

describe('StripeClient connected accounts', () => {
  beforeEach(() => {
    instances.length = 0;
  });

  it('sends no Stripe-Account by default', () => {
    const client = createStripeClient({ apiKey: 'sk_test_1' });
    expect(client.accountId).toBeUndefined();
    expect(instances).toHaveLength(1);
    expect(instances[0].config.stripeAccount).toBeUndefined();
  });

  it('passes a configured stripeAccount to the SDK', () => {
    const client = createStripeClient({ apiKey: 'sk_test_1', stripeAccount: 'acct_1' });
    expect(client.accountId).toBe('acct_1');
    expect(instances[0].config).toMatchObject({ stripeAccount: 'acct_1', maxNetworkRetries: 1 });
  });

  it('forAccount returns a scoped client and leaves the original alone', () => {
    const platform = createStripeClient({
      apiKey: 'sk_live_1',
      apiVersion: '2026-01-01',
      maxNetworkRetries: 3,
    });
    const scoped = platform.forAccount('acct_2');

    expect(scoped).not.toBe(platform);
    expect(scoped.accountId).toBe('acct_2');
    expect(scoped.environment).toBe('live');
    expect(platform.accountId).toBeUndefined();
    expect(instances).toHaveLength(2);
    expect(instances[1]).toMatchObject({
      apiKey: 'sk_live_1',
      config: { stripeAccount: 'acct_2', apiVersion: '2026-01-01', maxNetworkRetries: 3 },
    });
    expect((scoped.sdk as unknown as { oauth: unknown }).oauth).toBe(instances[1].oauth);
  });

  it('forAccount on a scoped client switches account', () => {
    const scoped = createStripeClient({ apiKey: 'sk_test_1' }).forAccount('acct_a');
    expect(scoped.forAccount('acct_b').accountId).toBe('acct_b');
  });

  it('forAccount rejects ids that are not connected accounts', () => {
    const client = createStripeClient({ apiKey: 'sk_test_1' });
    expect(() => client.forAccount('')).toThrow(StripeValidationError);
    expect(() => client.forAccount('cus_1')).toThrow(StripeValidationError);
    expect(() => client.forAccount(undefined as unknown as string)).toThrow(StripeValidationError);
  });

  it('runs OAuth as the platform on the platform client', async () => {
    const client = createStripeClient({ apiKey: 'sk_test_1' });
    await client.oauth.exchangeCode('ac_1');
    expect(instances).toHaveLength(1);
    expect(instances[0].oauth.token).toHaveBeenCalled();
  });

  it('runs OAuth as the platform even on a scoped client', async () => {
    const scoped = createStripeClient({
      apiKey: 'sk_test_1',
      connectClientId: 'ca_1',
    }).forAccount('acct_2');
    const before = instances.length;

    await scoped.oauth.exchangeCode('ac_1');
    await scoped.oauth.exchangeCode('ac_2');

    // One extra, unscoped SDK instance, created once and reused.
    expect(instances).toHaveLength(before + 1);
    const platformSdk = instances[before];
    expect(platformSdk.config.stripeAccount).toBeUndefined();
    expect(platformSdk.apiKey).toBe('sk_test_1');
    expect(platformSdk.oauth.token).toHaveBeenCalledTimes(2);
    expect(instances[before - 1].oauth.token).not.toHaveBeenCalled();
  });

  it('passes connectClientId to oauth.deauthorize', async () => {
    const client = createStripeClient({ apiKey: 'sk_test_1', connectClientId: 'ca_9' });
    const oauth = instances[0].oauth as { deauthorize: ReturnType<typeof vi.fn> };
    oauth.deauthorize.mockResolvedValue({ stripe_user_id: 'acct_1' });
    await client.oauth.deauthorize('acct_1');
    expect(oauth.deauthorize).toHaveBeenCalledWith({ client_id: 'ca_9', stripe_user_id: 'acct_1' });
  });
});
