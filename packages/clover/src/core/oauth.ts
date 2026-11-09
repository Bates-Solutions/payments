import type { CloverEnvironment } from './types/index.js';
import { CloverError, CloverValidationError, cloverErrorFromResponse, parseCloverError } from './errors.js';
import { HOSTS } from './http.js';

/**
 * Hosts that serve the merchant-facing authorize page (North America).
 *
 * @see https://docs.clover.com/docs/oauth-flows-in-clover
 */
const AUTHORIZE_HOSTS: Record<CloverEnvironment, string> = {
  sandbox: 'https://sandbox.dev.clover.com',
  production: 'https://www.clover.com',
};

/**
 * Options for {@link buildAuthorizeUrl}
 */
export interface BuildAuthorizeUrlOptions {
  /** App ID from the Clover Developer Dashboard */
  clientId: string;
  /**
   * Selects the authorize host: `www.clover.com` (production) or
   * `sandbox.dev.clover.com` (sandbox).
   * @default 'sandbox'
   */
  environment?: CloverEnvironment;
  /**
   * Unguessable CSRF token, returned unchanged on the redirect. Verify it in
   * your callback before exchanging the code. You can also use it to carry
   * which tenant started the flow.
   */
  state: string;
  /**
   * Where Clover sends the merchant back. Must be on the site URL configured
   * for the app; when omitted Clover uses that site URL.
   */
  redirectUri?: string;
}

/**
 * Build the URL that sends a merchant to Clover to authorize your app (v2
 * OAuth code flow, expiring tokens). Pure function, no network call.
 *
 * Clover has no per-request scopes: the app's permissions are set in the
 * Developer Dashboard. The redirect carries `code`, `merchant_id` and `state`
 * query parameters; keep `merchant_id` for `createCloverClient`, since the
 * token response does not include it.
 *
 * @example
 * ```typescript
 * const url = buildAuthorizeUrl({
 *   clientId: process.env.CLOVER_APP_ID!,
 *   environment: 'production',
 *   state: csrfToken, // random per attempt; store it server side to check in the callback
 *   redirectUri: 'https://example.com/clover/callback',
 * });
 * // redirect the merchant to `url`
 * ```
 */
export function buildAuthorizeUrl(options: BuildAuthorizeUrlOptions): string {
  requireNonEmpty(options.clientId, 'clientId');
  requireNonEmpty(options.state, 'state');

  const url = new URL('/oauth/v2/authorize', AUTHORIZE_HOSTS[options.environment ?? 'sandbox']);
  url.searchParams.set('client_id', options.clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', options.state);
  if (options.redirectUri) url.searchParams.set('redirect_uri', options.redirectUri);

  return url.toString();
}

/**
 * Configuration for {@link CloverOAuthClient}. Uses the app's credentials, not
 * a merchant access token.
 */
export interface CloverOAuthClientConfig {
  /** App ID */
  clientId: string;
  /** App secret (Developer Dashboard, App settings). Never logged or put in errors. */
  clientSecret: string;
  /** @default 'sandbox' */
  environment?: CloverEnvironment;
  /** Override the `fetch` implementation (mainly for tests) */
  fetchImpl?: typeof fetch;
}

/**
 * An expiring token pair returned by {@link CloverOAuthClient.obtainToken} and
 * {@link CloverOAuthClient.refreshToken}.
 */
export interface OAuthTokens {
  /** Merchant access token. Use as `apiToken` in `createCloverClient`. */
  accessToken: string;
  /** When `accessToken` expires. Refresh before this. */
  expiresAt: Date;
  /**
   * Refresh token. Single use: each refresh returns a new pair and invalidates
   * this one, so store the new value every time.
   */
  refreshToken: string;
  /** When `refreshToken` expires */
  refreshTokenExpiresAt: Date;
}

/**
 * Raw `/oauth/v2/token` and `/oauth/v2/refresh` response. Expirations are Unix
 * timestamps in seconds.
 */
interface CloverTokenResponse {
  access_token?: string;
  access_token_expiration?: number;
  refresh_token?: string;
  refresh_token_expiration?: number;
}

/**
 * OAuth client for the app-credential endpoints: exchanging an authorization
 * code and refreshing an expiring token pair (Clover v2 OAuth, high-trust
 * code flow).
 *
 * These endpoints authenticate with the app's `clientId` / `clientSecret`, not
 * a merchant token, which is why this is separate from {@link CloverClient}.
 *
 * @example
 * ```typescript
 * const oauth = createCloverOAuthClient({
 *   clientId: process.env.CLOVER_APP_ID!,
 *   clientSecret: process.env.CLOVER_APP_SECRET!,
 *   environment: 'production',
 * });
 *
 * // In the redirect handler, after verifying `state`
 * const tokens = await oauth.obtainToken({ code: req.query.code });
 * const clover = createCloverClient({
 *   apiToken: tokens.accessToken,
 *   merchantId: req.query.merchant_id,
 *   environment: 'production',
 * });
 * ```
 */
export class CloverOAuthClient {
  readonly #clientId: string;
  // ES private field: kept out of JSON.stringify, console.log and error output.
  readonly #clientSecret: string;
  readonly #baseUrl: string;
  readonly #fetch: typeof fetch;

  constructor(config: CloverOAuthClientConfig) {
    requireNonEmpty(config.clientId, 'clientId');
    requireNonEmpty(config.clientSecret, 'clientSecret');

    this.#clientId = config.clientId;
    this.#clientSecret = config.clientSecret;
    this.#baseUrl = HOSTS.platform[config.environment ?? 'sandbox'];
    // Bind to avoid "Illegal invocation" when a bare global fetch is passed.
    this.#fetch = (config.fetchImpl ?? globalThis.fetch).bind(globalThis);
  }

  /**
   * Exchange the authorization `code` from the OAuth redirect for an expiring
   * token pair.
   *
   * @param options.code - `code` query parameter from the redirect
   *
   * @example
   * ```typescript
   * const { accessToken, refreshToken, expiresAt } =
   *   await oauth.obtainToken({ code: req.query.code });
   * ```
   */
  async obtainToken(options: { code: string }): Promise<OAuthTokens> {
    requireNonEmpty(options.code, 'code');

    return this.requestToken('/oauth/v2/token', {
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
      code: options.code,
    });
  }

  /**
   * Get a new token pair using a refresh token. The refresh token is single
   * use: store the returned `refreshToken`, the old one stops working.
   *
   * @example
   * ```typescript
   * const refreshed = await oauth.refreshToken({ refreshToken: stored.refreshToken });
   * ```
   */
  async refreshToken(options: { refreshToken: string }): Promise<OAuthTokens> {
    requireNonEmpty(options.refreshToken, 'refreshToken');

    return this.requestToken('/oauth/v2/refresh', {
      client_id: this.#clientId,
      refresh_token: options.refreshToken,
    });
  }

  private async requestToken(path: string, body: Record<string, string>): Promise<OAuthTokens> {
    let json: CloverTokenResponse | undefined;
    try {
      const response = await this.#fetch(new URL(path, this.#baseUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await response.text();
      try {
        json = text ? (JSON.parse(text) as CloverTokenResponse) : undefined;
      } catch {
        json = undefined;
      }
      if (!response.ok) {
        throw cloverErrorFromResponse(response.status, json, response.headers.get('x-request-id'));
      }
    } catch (error) {
      throw parseCloverError(error);
    }

    const accessToken = json?.access_token;
    const refreshToken = json?.refresh_token;
    if (!accessToken || !refreshToken) {
      throw new CloverError('Clover returned an incomplete token response');
    }

    return {
      accessToken,
      expiresAt: parseUnixSeconds(json?.access_token_expiration, 'access_token_expiration'),
      refreshToken,
      refreshTokenExpiresAt: parseUnixSeconds(json?.refresh_token_expiration, 'refresh_token_expiration'),
    };
  }
}

/**
 * Create an OAuth client for the app-credential endpoints.
 *
 * @example
 * ```typescript
 * const oauth = createCloverOAuthClient({
 *   clientId: process.env.CLOVER_APP_ID!,
 *   clientSecret: process.env.CLOVER_APP_SECRET!,
 *   environment: 'production',
 * });
 * ```
 */
export function createCloverOAuthClient(config: CloverOAuthClientConfig): CloverOAuthClient {
  return new CloverOAuthClient(config);
}

/**
 * Convert a Clover Unix timestamp (seconds) to a `Date`, throwing rather than
 * returning an `Invalid Date` that would silently break expiry comparisons.
 */
function parseUnixSeconds(value: unknown, field: string): Date {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CloverError(`Clover returned an invalid ${field}`);
  }
  return new Date(value * 1000);
}

function requireNonEmpty(value: string | undefined, field: string): void {
  if (!value) {
    throw new CloverValidationError(`${field} is required`, field);
  }
}
