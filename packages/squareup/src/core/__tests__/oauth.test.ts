import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { buildAuthorizeUrl, createSquareOAuthClient, SquareOAuthClient } from '../oauth.js';
import { SquareApiError, SquareAuthError, SquareError, SquareValidationError } from '../errors.js';

const SECRET = 'sq0csp-TOP-SECRET';
const config = { clientId: 'sq0idp-APP', clientSecret: SECRET, environment: 'production' as const };

describe('buildAuthorizeUrl', () => {
  it('builds a production code-flow URL with + separated scopes and session=false', () => {
    const url = buildAuthorizeUrl({
      clientId: 'sq0idp-APP',
      environment: 'production',
      scopes: ['ORDERS_READ', 'MERCHANT_PROFILE_READ'],
      state: 'csrf/123',
    });

    expect(url).toBe(
      'https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-APP&scope=ORDERS_READ+MERCHANT_PROFILE_READ&session=false&state=csrf%2F123'
    );
  });

  it('defaults to the sandbox host', () => {
    const url = new URL(buildAuthorizeUrl({ clientId: 'sandbox-sq0idb-APP', scopes: ['ITEMS_READ'], state: 's' }));

    expect(url.origin).toBe('https://connect.squareupsandbox.com');
    expect(url.pathname).toBe('/oauth2/authorize');
  });

  it('includes optional session, locale and redirect_uri', () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: 'APP',
        scopes: ['ITEMS_READ'],
        state: 's',
        session: true,
        locale: 'fr-CA',
        redirectUri: 'https://app.example.com/square/callback',
      })
    );

    expect(url.searchParams.get('session')).toBe('true');
    expect(url.searchParams.get('locale')).toBe('fr-CA');
    expect(url.searchParams.get('redirect_uri')).toBe('https://app.example.com/square/callback');
  });

  it.each([
    ['clientId', { clientId: '', scopes: ['ITEMS_READ'], state: 's' }],
    ['state', { clientId: 'APP', scopes: ['ITEMS_READ'], state: '' }],
    ['scopes', { clientId: 'APP', scopes: [], state: 's' }],
  ])('rejects a missing %s', (field, options) => {
    expect(() => buildAuthorizeUrl(options)).toThrow(SquareValidationError);
    expect(() => buildAuthorizeUrl(options)).toThrow(expect.objectContaining({ field }));
  });
});

describe('SquareOAuthClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  function respond(status: number, body: unknown) {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
    );
  }

  function lastRequest() {
    const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
    const headers = new Headers(init.headers as HeadersInit);
    return { url, headers, body: JSON.parse(init.body as string) as Record<string, unknown> };
  }

  const tokenBody = {
    access_token: 'EAAA-ACCESS',
    token_type: 'bearer',
    expires_at: '2026-10-23T17:00:00Z',
    merchant_id: 'MERCHANT_1',
    refresh_token: 'EQAA-REFRESH',
  };

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('validates credentials on construction', () => {
    expect(() => createSquareOAuthClient({ ...config, clientId: '' })).toThrow(SquareValidationError);
    expect(() => createSquareOAuthClient({ ...config, clientSecret: '' })).toThrow(SquareValidationError);
    expect(createSquareOAuthClient(config)).toBeInstanceOf(SquareOAuthClient);
  });

  it('does not expose the client secret when serialized or inspected', () => {
    const oauth = createSquareOAuthClient(config);

    expect(JSON.stringify(oauth)).not.toContain(SECRET);
    expect(Object.values(oauth)).not.toContain(SECRET);
  });

  describe('obtainToken', () => {
    it('exchanges a code with grant_type authorization_code and returns typed tokens', async () => {
      respond(200, tokenBody);
      const oauth = createSquareOAuthClient(config);

      const tokens = await oauth.obtainToken({ code: 'CODE', redirectUri: 'https://app.example.com/cb' });

      expect(tokens).toEqual({
        accessToken: 'EAAA-ACCESS',
        tokenType: 'bearer',
        expiresAt: new Date('2026-10-23T17:00:00Z'),
        merchantId: 'MERCHANT_1',
        refreshToken: 'EQAA-REFRESH',
      });
      const req = lastRequest();
      expect(req.url).toBe('https://connect.squareup.com/oauth2/token');
      expect(req.body).toMatchObject({
        client_id: 'sq0idp-APP',
        client_secret: SECRET,
        grant_type: 'authorization_code',
        code: 'CODE',
        redirect_uri: 'https://app.example.com/cb',
      });
      expect(req.body).not.toHaveProperty('refresh_token');
    });

    it('uses the sandbox host by default', async () => {
      respond(200, tokenBody);
      await createSquareOAuthClient({ clientId: 'APP', clientSecret: SECRET }).obtainToken({ code: 'C' });

      expect(lastRequest().url).toBe('https://connect.squareupsandbox.com/oauth2/token');
    });

    it('returns refreshTokenExpiresAt when Square sets it (PKCE)', async () => {
      respond(200, { ...tokenBody, refresh_token_expires_at: '2026-12-22T17:00:00Z' });

      const tokens = await createSquareOAuthClient(config).obtainToken({ code: 'C' });

      expect(tokens.refreshTokenExpiresAt).toEqual(new Date('2026-12-22T17:00:00Z'));
    });

    it('rejects an empty code without calling Square', async () => {
      await expect(createSquareOAuthClient(config).obtainToken({ code: '' })).rejects.toThrow(SquareValidationError);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('throws when the response is missing a required field', async () => {
      const { expires_at: _omit, ...incomplete } = tokenBody;
      respond(200, incomplete);

      await expect(createSquareOAuthClient(config).obtainToken({ code: 'C' })).rejects.toThrow(
        'Square returned an incomplete token response'
      );
    });

    it('throws a typed error for a 200 body carrying errors', async () => {
      respond(200, { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'INVALID_VALUE', detail: 'bad code', field: 'code' }] });

      const error = await createSquareOAuthClient(config).obtainToken({ code: 'C' }).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(SquareApiError);
      expect(error).toMatchObject({ code: 'INVALID_VALUE', statusCode: 200, message: 'bad code' });
    });

    it('maps an HTTP error and never includes the client secret', async () => {
      respond(401, { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED', detail: 'Invalid client secret' }] });

      const error = await createSquareOAuthClient(config).obtainToken({ code: 'C' }).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(SquareAuthError);
      expect(JSON.stringify(error)).not.toContain(SECRET);
      expect(String((error as Error).message)).not.toContain(SECRET);
      expect((error as Error).stack).not.toContain(SECRET);
    });
  });

  describe('refreshToken', () => {
    it('sends grant_type refresh_token without a code', async () => {
      respond(200, tokenBody);

      const tokens = await createSquareOAuthClient(config).refreshToken({ refreshToken: 'EQAA-REFRESH' });

      expect(tokens.accessToken).toBe('EAAA-ACCESS');
      const { body } = lastRequest();
      expect(body).toMatchObject({ grant_type: 'refresh_token', refresh_token: 'EQAA-REFRESH' });
      expect(body).not.toHaveProperty('code');
    });

    it('keeps the existing refresh token when Square omits it', async () => {
      const { refresh_token: _omit, ...withoutRefresh } = tokenBody;
      respond(200, withoutRefresh);

      const tokens = await createSquareOAuthClient(config).refreshToken({ refreshToken: 'EQAA-KEEP' });

      expect(tokens.refreshToken).toBe('EQAA-KEEP');
    });

    it('rejects an empty refresh token', async () => {
      await expect(createSquareOAuthClient(config).refreshToken({ refreshToken: '' })).rejects.toThrow(
        SquareValidationError
      );
    });
  });

  describe('revokeToken', () => {
    it('revokes by merchant with the Client authorization header', async () => {
      respond(200, { success: true });

      await createSquareOAuthClient(config).revokeToken({ merchantId: 'MERCHANT_1' });

      const req = lastRequest();
      expect(req.url).toBe('https://connect.squareup.com/oauth2/revoke');
      expect(req.headers.get('authorization')).toBe(`Client ${SECRET}`);
      expect(req.body).toEqual({ client_id: 'sq0idp-APP', merchant_id: 'MERCHANT_1' });
    });

    it('revokes by access token, optionally only that token', async () => {
      respond(200, { success: true });

      await createSquareOAuthClient(config).revokeToken({ accessToken: 'EAAA-ACCESS', revokeOnlyAccessToken: true });

      expect(lastRequest().body).toEqual({
        client_id: 'sq0idp-APP',
        access_token: 'EAAA-ACCESS',
        revoke_only_access_token: true,
      });
    });

    it('requires merchantId or accessToken', async () => {
      await expect(
        createSquareOAuthClient(config).revokeToken({} as { merchantId: string })
      ).rejects.toThrow(SquareValidationError);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('throws when Square does not confirm success', async () => {
      respond(200, { success: false });

      await expect(createSquareOAuthClient(config).revokeToken({ merchantId: 'M' })).rejects.toThrow(SquareError);
    });

    it('throws a typed error for a 200 body carrying errors', async () => {
      respond(200, { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND', detail: 'no such merchant' }] });

      await expect(createSquareOAuthClient(config).revokeToken({ merchantId: 'M' })).rejects.toBeInstanceOf(
        SquareApiError
      );
    });

    it('maps HTTP errors', async () => {
      respond(401, { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] });

      await expect(createSquareOAuthClient(config).revokeToken({ merchantId: 'M' })).rejects.toBeInstanceOf(
        SquareAuthError
      );
    });
  });
});
