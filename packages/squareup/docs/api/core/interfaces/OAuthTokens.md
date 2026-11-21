[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OAuthTokens

# Interface: OAuthTokens

Defined in: [squareup/src/core/oauth.ts:157](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L157)

Tokens returned by [SquareOAuthClient.obtainToken](../classes/SquareOAuthClient.md#obtaintoken) and
[SquareOAuthClient.refreshToken](../classes/SquareOAuthClient.md#refreshtoken).

## Properties

### accessToken

> **accessToken**: `string`

Defined in: [squareup/src/core/oauth.ts:159](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L159)

Merchant access token — use as `accessToken` in `createSquareClient`

***

### expiresAt

> **expiresAt**: `Date`

Defined in: [squareup/src/core/oauth.ts:163](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L163)

When `accessToken` expires (30 days after issue). Refresh well before this.

***

### merchantId

> **merchantId**: `string`

Defined in: [squareup/src/core/oauth.ts:165](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L165)

Merchant the tokens belong to

***

### refreshToken

> **refreshToken**: `string`

Defined in: [squareup/src/core/oauth.ts:170](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L170)

Refresh token. For the code flow with a client secret this does not
expire, and Square returns the same value on refresh.

***

### refreshTokenExpiresAt?

> `optional` **refreshTokenExpiresAt?**: `Date`

Defined in: [squareup/src/core/oauth.ts:172](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L172)

Only set when the refresh token itself expires (PKCE flow)

***

### tokenType

> **tokenType**: `string`

Defined in: [squareup/src/core/oauth.ts:161](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L161)

Always `'bearer'`
