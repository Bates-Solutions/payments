[**@bates-solutions/squareup API Reference v2.6.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / OAuthTokenStatus

# Interface: OAuthTokenStatus

Defined in: [squareup/src/core/oauth.ts:178](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L178)

Status of a merchant access token, from `square.oauth.tokenStatus()`.

## Properties

### clientId?

> `optional` **clientId?**: `string`

Defined in: [squareup/src/core/oauth.ts:184](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L184)

Application the token was issued to

***

### expiresAt?

> `optional` **expiresAt?**: `Date`

Defined in: [squareup/src/core/oauth.ts:182](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L182)

When the token expires. Absent for personal access tokens, which do not expire.

***

### merchantId?

> `optional` **merchantId?**: `string`

Defined in: [squareup/src/core/oauth.ts:186](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L186)

Merchant the token belongs to

***

### scopes

> **scopes**: `string`[]

Defined in: [squareup/src/core/oauth.ts:180](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L180)

Permissions granted to the token
