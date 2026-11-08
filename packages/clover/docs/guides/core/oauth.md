# OAuth

A third-party app that acts on a merchant's behalf gets its access token through Clover's **v2 OAuth** code flow, which issues **expiring** token pairs (an access token plus a single-use refresh token). Clover requires expiring tokens for production apps.

The library gives you two pieces, mirroring `@bates-solutions/squareup`:

- `buildAuthorizeUrl()` builds the URL that sends the merchant to Clover. Pure function, no network call.
- `createCloverOAuthClient()` returns a client for the app-credential endpoints: `obtainToken()` and `refreshToken()`. It authenticates with your App ID and App Secret, not a merchant token, so it is separate from `createCloverClient()`.

Hosts are the North America ones: `sandbox.dev.clover.com` / `www.clover.com` for the authorize page and `apisandbox.dev.clover.com` / `api.clover.com` for the token endpoints.

## 1. Send the merchant to Clover

```typescript
import { buildAuthorizeUrl } from '@bates-solutions/clover';

const state = crypto.randomUUID();
session.cloverOAuthState = state; // checked in the callback
const url = buildAuthorizeUrl({
  clientId: process.env.CLOVER_APP_ID!,
  environment: 'production',
  state,
  redirectUri: 'https://example.com/clover/callback', // optional; must be on the app's site URL
});
// redirect the merchant to `url`
```

Clover has no per-request scopes. The permissions your app gets are the ones set for it in the Developer Dashboard.

## 2. Exchange the code

Clover redirects back with `code`, `merchant_id` and `state` query parameters. Check `state` first, then exchange the code. The token response does **not** include the merchant id, so keep `merchant_id` from the redirect.

```typescript
import { createCloverClient, createCloverOAuthClient } from '@bates-solutions/clover';

const oauth = createCloverOAuthClient({
  clientId: process.env.CLOVER_APP_ID!,
  clientSecret: process.env.CLOVER_APP_SECRET!,
  environment: 'production',
});

// A missing stored state must fail too: comparing two missing values would pass.
const expectedState = session.cloverOAuthState;
delete session.cloverOAuthState; // one use only
if (!expectedState || req.query.state !== expectedState) throw new Error('state mismatch');

const tokens = await oauth.obtainToken({ code: req.query.code });
// { accessToken, expiresAt, refreshToken, refreshTokenExpiresAt }

const clover = createCloverClient({
  apiToken: tokens.accessToken,
  merchantId: req.query.merchant_id,
  environment: 'production',
});
```

## 3. Refresh before the access token expires

```typescript
const refreshed = await oauth.refreshToken({ refreshToken: stored.refreshToken });
await save({
  accessToken: refreshed.accessToken,
  expiresAt: refreshed.expiresAt,
  refreshToken: refreshed.refreshToken, // the old refresh token no longer works
  refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt,
});
```

- Refresh tokens are **single use**. Every refresh returns a new pair and invalidates the old refresh token, so always store the new one. If two workers refresh the same merchant at once, one of them will fail; serialize refreshes per merchant.
- Clover does not publish fixed lifetimes, so use `expiresAt` / `refreshTokenExpiresAt` instead of hard-coding durations.
- Clover limits how many active refresh tokens an app may hold per merchant; going over it invalidates older ones.

## Errors

Failures use the normal error hierarchy: a rejected code or refresh token is a `CloverAuthError` (401/403) or `CloverApiError`, missing input is a `CloverValidationError`, and a token response without the expected fields is a `CloverError`. The app secret is never included in errors.

## Not covered yet

- The low-trust PKCE flow (`code_challenge` / `code_verifier`, no client secret)
- Europe (`www.eu.clover.com` / `api.eu.clover.com`) and Latin America (`www.la.clover.com` / `api.la.clover.com`) hosts
- Migrating legacy non-expiring tokens (`/oauth/token/migrate_v2`)
