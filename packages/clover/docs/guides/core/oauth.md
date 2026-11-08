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
req.session.oauthState = state; // store it server side, e.g. in the session, with the tenant ID
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

// Take the stored state and delete it, so each value works only once
const storedState = req.session.oauthState;
delete req.session.oauthState;

if (!storedState) throw new Error('OAuth state missing: start the flow again');
if (typeof req.query.state !== 'string' || req.query.state !== storedState) {
  throw new Error('OAuth state mismatch');
}

const tokens = await oauth.obtainToken({ code: req.query.code });
// { accessToken, expiresAt, refreshToken, refreshTokenExpiresAt }

const clover = createCloverClient({
  apiToken: tokens.accessToken,
  merchantId: req.query.merchant_id,
  environment: 'production',
});
```

The state check is what stops a cross-site request forgery: an attacker sending your user to the callback with the attacker's own `code`. Its order matters:

- **Require a stored state.** A plain `req.query.state !== storedState` passes when both are `undefined`: a callback with no `state`, in a session that never started the flow. Reject when nothing is stored.
- **Use it once.** Delete the stored value before comparing, whether or not the check passes, so a captured callback URL can't be replayed.
- **Then compare.** The query value must be a string equal to the stored one.

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
