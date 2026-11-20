[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / BuildAuthorizeUrlOptions

# Interface: BuildAuthorizeUrlOptions

Defined in: [squareup/src/core/oauth.ts:71](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L71)

Options for [buildAuthorizeUrl](../functions/buildAuthorizeUrl.md)

## Properties

### clientId

> **clientId**: `string`

Defined in: [squareup/src/core/oauth.ts:73](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L73)

Application ID (sandbox IDs start with `sandbox-`)

***

### environment?

> `optional` **environment?**: [`SquareEnvironment`](../type-aliases/SquareEnvironment.md)

Defined in: [squareup/src/core/oauth.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L79)

Selects the authorize host: `connect.squareup.com` (production) or
`connect.squareupsandbox.com` (sandbox).

#### Default

```ts
'sandbox'
```

***

### locale?

> `optional` **locale?**: `string`

Defined in: [squareup/src/core/oauth.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L96)

Authorization page language, e.g. `en-US`, `en-CA`, `es-US`, `fr-CA`, `ja-JP`

***

### redirectUri?

> `optional` **redirectUri?**: `string`

Defined in: [squareup/src/core/oauth.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L98)

Must match the redirect URL configured for the application, if set

***

### scopes

> **scopes**: [`OAuthScope`](../type-aliases/OAuthScope.md)[]

Defined in: [squareup/src/core/oauth.ts:81](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L81)

Permissions to request from the seller. Must not be empty.

***

### session?

> `optional` **session?**: `boolean`

Defined in: [squareup/src/core/oauth.ts:94](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L94)

Whether an existing Square Dashboard session may be reused. Square
requires `false` for production apps so the seller explicitly picks the
account. Ignored by Square in sandbox.

#### Default

```ts
false
```

***

### state

> **state**: `string`

Defined in: [squareup/src/core/oauth.ts:87](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/oauth.ts#L87)

Unguessable CSRF token, returned unchanged on the redirect. Verify it in
your callback before exchanging the code. You can also use it to carry
which tenant started the flow.
