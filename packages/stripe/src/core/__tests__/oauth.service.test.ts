import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { OAuthService, buildAuthorizeUrl } from '../services/oauth.service.js';
import { StripeError, StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    oauth: {
      token: vi.fn(),
      deauthorize: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

function service(client: Stripe, clientId?: string): OAuthService {
  return new OAuthService(() => client, clientId);
}

describe('buildAuthorizeUrl', () => {
  it('builds a Standard Connect authorize URL with defaults', () => {
    const url = new URL(buildAuthorizeUrl({ clientId: 'ca_123', state: 'csrf-1' }));

    expect(url.origin + url.pathname).toBe('https://connect.stripe.com/oauth/authorize');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('client_id')).toBe('ca_123');
    expect(url.searchParams.get('scope')).toBe('read_write');
    expect(url.searchParams.get('state')).toBe('csrf-1');
    expect(url.searchParams.has('redirect_uri')).toBe(false);
    expect(url.searchParams.has('stripe_landing')).toBe(false);
    expect(url.searchParams.has('always_prompt')).toBe(false);
    expect(url.searchParams.has('stripe_user[email]')).toBe(false);
  });

  it('adds the optional parameters', () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: 'ca_123',
        state: 's',
        scope: 'read_only',
        redirectUri: 'https://app.example.com/cb?x=1',
        stripeLanding: 'register',
        alwaysPrompt: true,
        email: 'shop@example.com',
      })
    );

    expect(url.searchParams.get('scope')).toBe('read_only');
    expect(url.searchParams.get('redirect_uri')).toBe('https://app.example.com/cb?x=1');
    expect(url.searchParams.get('stripe_landing')).toBe('register');
    expect(url.searchParams.get('always_prompt')).toBe('true');
    expect(url.searchParams.get('stripe_user[email]')).toBe('shop@example.com');
  });

  it('omits always_prompt when false', () => {
    const url = new URL(buildAuthorizeUrl({ clientId: 'ca_1', state: 's', alwaysPrompt: false }));
    expect(url.searchParams.has('always_prompt')).toBe(false);
  });

  it('requires clientId and state', () => {
    expect(() => buildAuthorizeUrl({ clientId: '', state: 's' })).toThrow(StripeValidationError);
    expect(() => buildAuthorizeUrl({ clientId: 'ca_1', state: '' })).toThrow('state is required');
  });
});

describe('OAuthService', () => {
  describe('exchangeCode', () => {
    it('returns the connected account id without exposing tokens', async () => {
      const client = createMockClient({
        token: vi.fn().mockResolvedValue({
          stripe_user_id: 'acct_1',
          scope: 'read_write',
          livemode: false,
          access_token: 'sk_test_secret',
          refresh_token: 'rt_secret',
        }),
      });

      const grant = await service(client).exchangeCode('ac_123');

      expect(grant).toEqual({ stripeUserId: 'acct_1', scope: 'read_write', livemode: false });
      expect(client.oauth.token).toHaveBeenCalledWith({
        grant_type: 'authorization_code',
        code: 'ac_123',
      });
    });

    it('requires a code', async () => {
      const client = createMockClient();
      await expect(service(client).exchangeCode('')).rejects.toMatchObject({ field: 'code' });
      expect(client.oauth.token).not.toHaveBeenCalled();
    });

    it('throws when the response has no stripe_user_id', async () => {
      const client = createMockClient({ token: vi.fn().mockResolvedValue({ scope: 'read_write' }) });
      await expect(service(client).exchangeCode('ac_1')).rejects.toThrow(
        'Stripe returned an incomplete token response'
      );
    });

    it('normalizes SDK errors', async () => {
      const client = createMockClient({
        token: vi.fn().mockRejectedValue(new Error('invalid_grant')),
      });
      await expect(service(client).exchangeCode('ac_1')).rejects.toThrow(StripeError);
    });
  });

  describe('deauthorize', () => {
    it('deauthorizes with the configured client id', async () => {
      const client = createMockClient({
        deauthorize: vi.fn().mockResolvedValue({ stripe_user_id: 'acct_1' }),
      });

      await service(client, 'ca_default').deauthorize('acct_1');

      expect(client.oauth.deauthorize).toHaveBeenCalledWith({
        client_id: 'ca_default',
        stripe_user_id: 'acct_1',
      });
    });

    it('prefers a client id passed to the call', async () => {
      const client = createMockClient({
        deauthorize: vi.fn().mockResolvedValue({ stripe_user_id: 'acct_1' }),
      });
      await service(client, 'ca_default').deauthorize('acct_1', { clientId: 'ca_other' });
      expect(client.oauth.deauthorize).toHaveBeenCalledWith(
        expect.objectContaining({ client_id: 'ca_other' })
      );
    });

    it('requires a stripeUserId and a client id', async () => {
      const client = createMockClient();
      await expect(service(client, 'ca_1').deauthorize('')).rejects.toMatchObject({
        field: 'stripeUserId',
      });
      await expect(service(client).deauthorize('acct_1')).rejects.toMatchObject({
        field: 'clientId',
      });
      expect(client.oauth.deauthorize).not.toHaveBeenCalled();
    });

    it('throws when Stripe does not confirm the account', async () => {
      const client = createMockClient({
        deauthorize: vi.fn().mockResolvedValue({ stripe_user_id: 'acct_other' }),
      });
      await expect(service(client, 'ca_1').deauthorize('acct_1')).rejects.toThrow(
        'Stripe did not confirm the deauthorization'
      );
    });

    it('normalizes SDK errors', async () => {
      const client = createMockClient({
        deauthorize: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(service(client, 'ca_1').deauthorize('acct_1')).rejects.toMatchObject({
        code: 'BAD_REQUEST',
      });
    });
  });
});
