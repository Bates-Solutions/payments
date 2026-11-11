[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / OAuthTokens

# Interface: OAuthTokens

Defined in: [core/oauth.ts:92](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L92)

An expiring token pair returned by [CloverOAuthClient.obtainToken](../classes/CloverOAuthClient.md#obtaintoken) and
[CloverOAuthClient.refreshToken](../classes/CloverOAuthClient.md#refreshtoken).

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [core/oauth.ts:94](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L94)

Merchant access token. Use as `apiToken` in `createCloverClient`.

***

### expiresAt

> **expiresAt**: `Date`

Defined in: [core/oauth.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L96)

When `accessToken` expires. Refresh before this.

***

### refreshToken

> **refreshToken**: `string`

Defined in: [core/oauth.ts:101](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L101)

Refresh token. Single use: each refresh returns a new pair and invalidates
this one, so store the new value every time.

***

### refreshTokenExpiresAt

> **refreshTokenExpiresAt**: `Date`

Defined in: [core/oauth.ts:103](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L103)

When `refreshToken` expires
