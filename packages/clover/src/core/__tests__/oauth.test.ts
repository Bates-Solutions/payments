import { describe, it, expect, vi } from 'vitest';
import { buildAuthorizeUrl, createCloverOAuthClient, CloverOAuthClient } from '../oauth.js';
import { CloverApiError, CloverAuthError, CloverError, CloverValidationError } from '../errors.js';

function mockFetch(body: unknown, status = 200, raw?: string) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(raw ?? (body === undefined ? '' : JSON.stringify(body))),
    headers: { get: (name: string) => (name === 'x-request-id' ? 'req_1' : null) },
  });
}

const TOKEN_BODY = {
  access_token: 'AT_1',
  access_token_expiration: 1677875430,
  refresh_token: 'RT_1',
  refresh_token_expiration: 1709497830,
};

function makeClient(fetchImpl: ReturnType<typeof vi.fn>, environment?: 'sandbox' | 'production') {
  return createCloverOAuthClient({
    clientId: 'APP_1',
    clientSecret: 'SECRET_1',
    environment,
    fetchImpl: fetchImpl as unknown as typeof fetch,
  });
}

function lastCall(fetchImpl: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchImpl.mock.calls[0] as [URL, RequestInit];
  return { url: String(url), init, body: JSON.parse(init.body as string) as Record<string, string> };
}

describe('buildAuthorizeUrl', () => {
  it('builds the sandbox v2 authorize URL by default', () => {
    const url = new URL(buildAuthorizeUrl({ clientId: 'APP_1', state: 'csrf_1' }));
    expect(url.origin).toBe('https://sandbox.dev.clover.com');
    expect(url.pathname).toBe('/oauth/v2/authorize');
    expect(url.searchParams.get('client_id')).toBe('APP_1');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('state')).toBe('csrf_1');
    expect(url.searchParams.has('redirect_uri')).toBe(false);
  });

  it('uses the North America production host and encodes the redirect URI', () => {
    const url = buildAuthorizeUrl({
      clientId: 'APP_1',
      environment: 'production',
      state: 'a b&c',
      redirectUri: 'https://example.com/cb?x=1',
    });
    expect(url).toBe(
      'https://www.clover.com/oauth/v2/authorize?client_id=APP_1&response_type=code&state=a+b%26c&redirect_uri=https%3A%2F%2Fexample.com%2Fcb%3Fx%3D1'
    );
  });

  it('requires clientId and state', () => {
    expect(() => buildAuthorizeUrl({ clientId: '', state: 's' })).toThrow(CloverValidationError);
    expect(() => buildAuthorizeUrl({ clientId: '', state: 's' })).toThrow('clientId is required');
    expect(() => buildAuthorizeUrl({ clientId: 'APP_1', state: '' })).toThrow('state is required');
  });
});

describe('CloverOAuthClient', () => {
  it('requires clientId and clientSecret', () => {
    expect(() => new CloverOAuthClient({ clientId: '', clientSecret: 's' })).toThrow(
      'clientId is required'
    );
    expect(() => new CloverOAuthClient({ clientId: 'APP_1', clientSecret: '' })).toThrow(
      'clientSecret is required'
    );
  });

  it('keeps the client secret out of serialized output', () => {
    const client = makeClient(mockFetch(TOKEN_BODY));
    expect(JSON.stringify(client)).not.toContain('SECRET_1');
    expect(Object.values(client)).not.toContain('SECRET_1');
  });

  describe('obtainToken', () => {
    it('posts the code with the app credentials to the sandbox token endpoint', async () => {
      const fetchImpl = mockFetch(TOKEN_BODY);
      const tokens = await makeClient(fetchImpl).obtainToken({ code: 'CODE_1' });

      const { url, init, body } = lastCall(fetchImpl);
      expect(url).toBe('https://apisandbox.dev.clover.com/oauth/v2/token');
      expect(init.method).toBe('POST');
      expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
      expect(body).toEqual({ client_id: 'APP_1', client_secret: 'SECRET_1', code: 'CODE_1' });

      expect(tokens).toEqual({
        accessToken: 'AT_1',
        expiresAt: new Date(1677875430 * 1000),
        refreshToken: 'RT_1',
        refreshTokenExpiresAt: new Date(1709497830 * 1000),
      });
    });

    it('uses the production API host', async () => {
      const fetchImpl = mockFetch(TOKEN_BODY);
      await makeClient(fetchImpl, 'production').obtainToken({ code: 'CODE_1' });
      expect(lastCall(fetchImpl).url).toBe('https://api.clover.com/oauth/v2/token');
    });

    it('requires a code without calling Clover', async () => {
      const fetchImpl = mockFetch(TOKEN_BODY);
      await expect(makeClient(fetchImpl).obtainToken({ code: '' })).rejects.toThrow(
        'code is required'
      );
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('posts the refresh token without the client secret', async () => {
      const fetchImpl = mockFetch({ ...TOKEN_BODY, access_token: 'AT_2', refresh_token: 'RT_2' });
      const tokens = await makeClient(fetchImpl).refreshToken({ refreshToken: 'RT_1' });

      const { url, body } = lastCall(fetchImpl);
      expect(url).toBe('https://apisandbox.dev.clover.com/oauth/v2/refresh');
      expect(body).toEqual({ client_id: 'APP_1', refresh_token: 'RT_1' });
      expect(tokens.accessToken).toBe('AT_2');
      expect(tokens.refreshToken).toBe('RT_2');
    });

    it('requires a refresh token without calling Clover', async () => {
      const fetchImpl = mockFetch(TOKEN_BODY);
      await expect(makeClient(fetchImpl).refreshToken({ refreshToken: '' })).rejects.toThrow(
        'refreshToken is required'
      );
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('maps a 401 to CloverAuthError with the request id', async () => {
      const fetchImpl = mockFetch({ message: 'Invalid code' }, 401);
      const error = await makeClient(fetchImpl)
        .obtainToken({ code: 'BAD' })
        .catch((e: unknown) => e);
      expect(error).toBeInstanceOf(CloverAuthError);
      expect((error as CloverAuthError).message).toBe('Invalid code');
      expect((error as CloverAuthError).requestId).toBe('req_1');
      expect(String((error as Error).message)).not.toContain('SECRET_1');
    });

    it('keeps the HTTP status when the error body is not JSON', async () => {
      const fetchImpl = mockFetch(undefined, 503, '<html>Service Unavailable</html>');
      const error = await makeClient(fetchImpl)
        .refreshToken({ refreshToken: 'RT_1' })
        .catch((e: unknown) => e);
      expect(error).toBeInstanceOf(CloverApiError);
      expect((error as CloverApiError).statusCode).toBe(503);
    });

    it('wraps network failures as CloverError', async () => {
      const fetchImpl = vi.fn().mockRejectedValue(new Error('socket hang up'));
      await expect(makeClient(fetchImpl).obtainToken({ code: 'CODE_1' })).rejects.toThrow(
        new CloverError('socket hang up')
      );
    });

    it.each([
      ['access_token', { ...TOKEN_BODY, access_token: '' }],
      ['refresh_token', { ...TOKEN_BODY, refresh_token: undefined }],
      ['refresh_token', { ...TOKEN_BODY, refresh_token: '' }],
    ])('rejects a response missing %s', async (_field, body) => {
      const fetchImpl = mockFetch(body);
      await expect(makeClient(fetchImpl).obtainToken({ code: 'CODE_1' })).rejects.toThrow(
        'Clover returned an incomplete token response'
      );
    });

    it('rejects an empty 200 body', async () => {
      const fetchImpl = mockFetch(undefined);
      await expect(makeClient(fetchImpl).obtainToken({ code: 'CODE_1' })).rejects.toThrow(
        'incomplete token response'
      );
    });

    it.each([
      ['access_token_expiration', { ...TOKEN_BODY, access_token_expiration: '1677875430' }],
      ['refresh_token_expiration', { ...TOKEN_BODY, refresh_token_expiration: undefined }],
      ['access_token_expiration', { ...TOKEN_BODY, access_token_expiration: null }],
    ])('rejects an invalid %s', async (field, body) => {
      const fetchImpl = mockFetch(body);
      await expect(makeClient(fetchImpl).obtainToken({ code: 'CODE_1' })).rejects.toThrow(
        `Clover returned an invalid ${field}`
      );
    });
  });
});
