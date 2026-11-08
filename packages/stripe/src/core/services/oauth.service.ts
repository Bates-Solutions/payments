import type Stripe from 'stripe';
import { parseStripeError, StripeError, StripeValidationError } from '../errors.js';

/**
 * Connect OAuth scope. `read_write` lets your platform act on the connected
 * account; `read_only` only lets it read.
 */
export type ConnectOAuthScope = 'read_write' | 'read_only';

/**
 * Options for {@link buildAuthorizeUrl}
 */
export interface BuildAuthorizeUrlOptions {
  /** Your platform's Connect client ID (`ca_…`, Dashboard → Connect settings) */
  clientId: string;
  /**
   * Unguessable CSRF token, random per attempt (e.g. `crypto.randomUUID()`),
   * returned unchanged on the redirect. Store it server side, then in the
   * callback, before calling {@link OAuthService.exchangeCode}: require a
   * stored value, delete it so it works only once, and require the query
   * `state` to be a string equal to it. A bare `query.state !== stored`
   * check passes when both are `undefined`.
   */
  state: string;
  /** @default 'read_write' */
  scope?: ConnectOAuthScope;
  /** Must match a redirect URI configured in your Connect settings, if set */
  redirectUri?: string;
  /** Which page the user lands on: sign in (`login`) or create an account (`register`) */
  stripeLanding?: 'login' | 'register';
  /** Force the account picker even if the user is already connected */
  alwaysPrompt?: boolean;
  /** Prefill the email field on the Stripe sign-up form */
  email?: string;
}

/**
 * Result of exchanging an authorization code.
 *
 * Stripe is deprecating Connect OAuth access and refresh tokens, so they are
 * deliberately not returned: store `stripeUserId` and act on the account with
 * `stripe.forAccount(stripeUserId)`, which sends the `Stripe-Account` header.
 */
export interface ConnectedAccountGrant {
  /** The connected account's ID (`acct_…`) */
  stripeUserId: string;
  /** Scope that was granted */
  scope?: string;
  /** Whether the grant is for live mode */
  livemode?: boolean;
}

/**
 * Options for {@link OAuthService.deauthorize}
 */
export interface DeauthorizeOptions {
  /**
   * Connect client ID (`ca_…`). Defaults to `connectClientId` from the client
   * config.
   */
  clientId?: string;
}

const AUTHORIZE_URL = 'https://connect.stripe.com/oauth/authorize';

function requireNonEmpty(value: string | undefined, field: string): void {
  if (!value) {
    throw new StripeValidationError(`${field} is required`, field);
  }
}

/**
 * Build the URL that sends a user to Stripe to connect their existing Stripe
 * account to your platform (Connect OAuth, Standard accounts). Pure function,
 * no network call, so it works without an API key.
 *
 * @throws {StripeValidationError} When `clientId` or `state` is missing
 *
 * @example
 * ```typescript
 * const url = buildAuthorizeUrl({
 *   clientId: process.env.STRIPE_CONNECT_CLIENT_ID!,
 *   state: csrfToken, // random per attempt; store it server side to check in the callback
 *   redirectUri: 'https://app.example.com/stripe/callback',
 * });
 * // redirect the user to `url`
 * ```
 *
 * @see https://docs.stripe.com/connect/oauth-reference
 */
export function buildAuthorizeUrl(options: BuildAuthorizeUrlOptions): string {
  requireNonEmpty(options.clientId, 'clientId');
  requireNonEmpty(options.state, 'state');

  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', options.clientId);
  url.searchParams.set('scope', options.scope ?? 'read_write');
  url.searchParams.set('state', options.state);
  if (options.redirectUri) url.searchParams.set('redirect_uri', options.redirectUri);
  if (options.stripeLanding) url.searchParams.set('stripe_landing', options.stripeLanding);
  if (options.alwaysPrompt) url.searchParams.set('always_prompt', 'true');
  if (options.email) url.searchParams.set('stripe_user[email]', options.email);

  return url.toString();
}

/**
 * Connect OAuth service: finish the connect flow and disconnect accounts.
 *
 * These calls authenticate with your platform's secret key, so they always go
 * out as the platform, even on a client returned by `forAccount`.
 *
 * @example
 * ```typescript
 * // OAuth redirect handler. First check `state`: require a stored value,
 * // delete it (one use), then compare it with the query value. Then handle a
 * // deny (`error=access_denied`, no `code`) and require `code` to be a
 * // string. See docs/guides/core/connect.md.
 * const { stripeUserId } = await stripe.oauth.exchangeCode(code);
 * await db.saveRetailer({ stripeAccountId: stripeUserId });
 *
 * // Later, act as the connected account
 * const retailer = stripe.forAccount(stripeUserId);
 * const { data: products } = await retailer.products.list({ active: true });
 * ```
 */
export class OAuthService {
  /**
   * @param getClient - Returns an SDK client authenticated as the platform
   *   (no `Stripe-Account` header)
   * @param defaultClientId - Connect client ID used by `deauthorize` when the
   *   call doesn't pass one
   */
  constructor(
    private readonly getClient: () => Stripe,
    private readonly defaultClientId?: string
  ) {}

  /**
   * Exchange the authorization `code` from the OAuth redirect for the
   * connected account's ID.
   *
   * @throws {StripeValidationError} When `code` is missing
   * @throws {StripeError} When Stripe's response has no `stripe_user_id`
   */
  async exchangeCode(code: string): Promise<ConnectedAccountGrant> {
    requireNonEmpty(code, 'code');

    let token: Stripe.OAuthToken;
    try {
      token = await this.getClient().oauth.token({ grant_type: 'authorization_code', code });
    } catch (error) {
      throw parseStripeError(error);
    }

    if (!token.stripe_user_id) {
      throw new StripeError('Stripe returned an incomplete token response');
    }

    return {
      stripeUserId: token.stripe_user_id,
      scope: token.scope,
      livemode: token.livemode,
    };
  }

  /**
   * Disconnect a connected account from your platform. Your platform can no
   * longer act on it afterwards.
   *
   * @throws {StripeValidationError} When `stripeUserId` is missing, or no
   *   client ID is passed or configured
   * @throws {StripeError} When Stripe does not confirm the account
   *
   * @example
   * ```typescript
   * await stripe.oauth.deauthorize(retailer.stripeAccountId);
   * ```
   */
  async deauthorize(stripeUserId: string, options?: DeauthorizeOptions): Promise<void> {
    requireNonEmpty(stripeUserId, 'stripeUserId');
    const clientId = options?.clientId ?? this.defaultClientId;
    if (!clientId) {
      throw new StripeValidationError(
        'clientId is required (pass it or set connectClientId on the client)',
        'clientId'
      );
    }

    let result: Stripe.OAuthDeauthorization;
    try {
      result = await this.getClient().oauth.deauthorize({
        client_id: clientId,
        stripe_user_id: stripeUserId,
      });
    } catch (error) {
      throw parseStripeError(error);
    }

    if (result.stripe_user_id !== stripeUserId) {
      throw new StripeError('Stripe did not confirm the deauthorization');
    }
  }
}
