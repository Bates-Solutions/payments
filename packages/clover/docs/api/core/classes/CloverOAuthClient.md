[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverOAuthClient

# Class: CloverOAuthClient

Defined in: [core/oauth.ts:142](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L142)

OAuth client for the app-credential endpoints: exchanging an authorization
code and refreshing an expiring token pair (Clover v2 OAuth, high-trust
code flow).

These endpoints authenticate with the app's `clientId` / `clientSecret`, not
a merchant token, which is why this is separate from [CloverClient](CloverClient.md).

## Example

```typescript
const oauth = createCloverOAuthClient({
  clientId: process.env.CLOVER_APP_ID!,
  clientSecret: process.env.CLOVER_APP_SECRET!,
  environment: 'production',
});

// In the redirect handler, after verifying `state`
const tokens = await oauth.obtainToken({ code: req.query.code });
const clover = createCloverClient({
  apiToken: tokens.accessToken,
  merchantId: req.query.merchant_id,
  environment: 'production',
});
```

## Constructors

### Constructor

> **new CloverOAuthClient**(`config`): `CloverOAuthClient`

Defined in: [core/oauth.ts:149](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L149)

#### Parameters

##### config

[`CloverOAuthClientConfig`](../interfaces/CloverOAuthClientConfig.md)

#### Returns

`CloverOAuthClient`

## Methods

### obtainToken()

> **obtainToken**(`options`): `Promise`\<[`OAuthTokens`](../interfaces/OAuthTokens.md)\>

Defined in: [core/oauth.ts:172](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L172)

Exchange the authorization `code` from the OAuth redirect for an expiring
token pair.

#### Parameters

##### options

###### code

`string`

`code` query parameter from the redirect

#### Returns

`Promise`\<[`OAuthTokens`](../interfaces/OAuthTokens.md)\>

#### Example

```typescript
const { accessToken, refreshToken, expiresAt } =
  await oauth.obtainToken({ code: req.query.code });
```

***

### refreshToken()

> **refreshToken**(`options`): `Promise`\<[`OAuthTokens`](../interfaces/OAuthTokens.md)\>

Defined in: [core/oauth.ts:191](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L191)

Get a new token pair using a refresh token. The refresh token is single
use: store the returned `refreshToken`, the old one stops working.

#### Parameters

##### options

###### refreshToken

`string`

#### Returns

`Promise`\<[`OAuthTokens`](../interfaces/OAuthTokens.md)\>

#### Example

```typescript
const refreshed = await oauth.refreshToken({ refreshToken: stored.refreshToken });
```
