[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / OAuthTokens

# Interface: OAuthTokens

Defined in: [clover/src/core/oauth.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L98)

An expiring token pair returned by [CloverOAuthClient.obtainToken](../classes/CloverOAuthClient.md#obtaintoken) and
[CloverOAuthClient.refreshToken](../classes/CloverOAuthClient.md#refreshtoken).

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [clover/src/core/oauth.ts:100](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L100)

Merchant access token. Use as `apiToken` in `createCloverClient`.

***

### expiresAt

> **expiresAt**: `Date`

Defined in: [clover/src/core/oauth.ts:102](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L102)

When `accessToken` expires. Refresh before this.

***

### refreshToken

> **refreshToken**: `string`

Defined in: [clover/src/core/oauth.ts:107](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L107)

Refresh token. Single use: each refresh returns a new pair and invalidates
this one, so store the new value every time.

***

### refreshTokenExpiresAt

> **refreshTokenExpiresAt**: `Date`

Defined in: [clover/src/core/oauth.ts:109](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L109)

When `refreshToken` expires
