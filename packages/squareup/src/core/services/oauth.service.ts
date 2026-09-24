import type { SquareClient } from 'square';
import { assertNoResponseErrors, parseSquareError } from '../errors.js';
import { parseSquareDate, type OAuthTokenStatus } from '../oauth.js';

/**
 * OAuth operations authenticated with the client's merchant access token.
 *
 * Code exchange, refresh and revocation use application credentials instead.
 * They live on {@link SquareOAuthClient} (`createSquareOAuthClient`).
 *
 * @example
 * ```typescript
 * const square = createSquareClient({ accessToken: tenant.accessToken });
 * const status = await square.oauth.tokenStatus();
 * ```
 */
export class OAuthService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Get the scopes, expiry and merchant of this client's access token. Use it
   * as a connection health check, or to confirm a required scope was granted.
   *
   * @returns Token status
   * @throws {SquareAuthError} If the token is invalid, expired or revoked
   *
   * @example
   * ```typescript
   * const { scopes, expiresAt } = await square.oauth.tokenStatus();
   * if (!scopes.includes('MERCHANT_PROFILE_READ')) {
   *   // ask the seller to reconnect with the missing permission
   * }
   * ```
   */
  async tokenStatus(): Promise<OAuthTokenStatus> {
    let response;
    try {
      response = await this.client.oAuth.retrieveTokenStatus();
    } catch (error) {
      throw parseSquareError(error);
    }

    assertNoResponseErrors(response);

    return {
      scopes: response.scopes ?? [],
      ...(response.expiresAt && { expiresAt: parseSquareDate(response.expiresAt, 'expires_at') }),
      ...(response.clientId && { clientId: response.clientId }),
      ...(response.merchantId && { merchantId: response.merchantId }),
    };
  }
}
