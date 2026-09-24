import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { OAuthService } from '../services/oauth.service.js';
import { SquareApiError, SquareAuthError } from '../errors.js';

function createMockClient(retrieveTokenStatus: ReturnType<typeof vi.fn>): SquareClient {
  return { oAuth: { retrieveTokenStatus } } as unknown as SquareClient;
}

describe('OAuthService', () => {
  describe('tokenStatus', () => {
    it('returns scopes, expiry as a Date, client and merchant', async () => {
      const client = createMockClient(
        vi.fn().mockResolvedValue({
          scopes: ['ORDERS_READ', 'MERCHANT_PROFILE_READ'],
          expiresAt: '2026-10-23T17:00:00Z',
          clientId: 'sq0idp-APP',
          merchantId: 'MERCHANT_1',
        })
      );

      await expect(new OAuthService(client).tokenStatus()).resolves.toEqual({
        scopes: ['ORDERS_READ', 'MERCHANT_PROFILE_READ'],
        expiresAt: new Date('2026-10-23T17:00:00Z'),
        clientId: 'sq0idp-APP',
        merchantId: 'MERCHANT_1',
      });
    });

    it('omits expiresAt for a non-expiring (personal) token and defaults scopes', async () => {
      const client = createMockClient(vi.fn().mockResolvedValue({}));

      await expect(new OAuthService(client).tokenStatus()).resolves.toEqual({ scopes: [] });
    });

    it('throws a typed error for a 200 body carrying errors', async () => {
      const client = createMockClient(
        vi.fn().mockResolvedValue({
          errors: [{ category: 'AUTHENTICATION_ERROR', code: 'ACCESS_TOKEN_EXPIRED', detail: 'expired' }],
        })
      );

      const error = await new OAuthService(client).tokenStatus().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(SquareApiError);
      expect(error).toMatchObject({ code: 'ACCESS_TOKEN_EXPIRED' });
    });

    it('maps a 401 to SquareAuthError', async () => {
      const client = createMockClient(
        vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'ACCESS_TOKEN_REVOKED' }] },
        })
      );

      const error = await new OAuthService(client).tokenStatus().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(SquareAuthError);
      expect(error).toMatchObject({ code: 'ACCESS_TOKEN_REVOKED' });
    });
  });
});
