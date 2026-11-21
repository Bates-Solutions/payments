[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / BuildAuthorizeUrlOptions

# Interface: BuildAuthorizeUrlOptions

Defined in: [stripe/src/core/services/oauth.service.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L14)

Options for [buildAuthorizeUrl](../functions/buildAuthorizeUrl.md)

## Properties

### alwaysPrompt?

> `optional` **alwaysPrompt?**: `boolean`

Defined in: [stripe/src/core/services/oauth.service.ts:33](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L33)

Force the account picker even if the user is already connected

***

### clientId

> **clientId**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L16)

Your platform's Connect client ID (`ca_…`, Dashboard → Connect settings)

***

### email?

> `optional` **email?**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:35](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L35)

Prefill the email field on the Stripe sign-up form

***

### redirectUri?

> `optional` **redirectUri?**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L29)

Must match a redirect URI configured in your Connect settings, if set

***

### scope?

> `optional` **scope?**: [`ConnectOAuthScope`](../type-aliases/ConnectOAuthScope.md)

Defined in: [stripe/src/core/services/oauth.service.ts:27](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L27)

#### Default

```ts
'read_write'
```

***

### state

> **state**: `string`

Defined in: [stripe/src/core/services/oauth.service.ts:25](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L25)

Unguessable CSRF token, random per attempt (e.g. `crypto.randomUUID()`),
returned unchanged on the redirect. Store it server side, then in the
callback, before calling [OAuthService.exchangeCode](../classes/OAuthService.md#exchangecode): require a
stored value, delete it so it works only once, and require the query
`state` to be a string equal to it. A bare `query.state !== stored`
check passes when both are `undefined`.

***

### stripeLanding?

> `optional` **stripeLanding?**: `"login"` \| `"register"`

Defined in: [stripe/src/core/services/oauth.service.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/oauth.service.ts#L31)

Which page the user lands on: sign in (`login`) or create an account (`register`)
