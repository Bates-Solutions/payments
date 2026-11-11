[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / BuildAuthorizeUrlOptions

# Interface: BuildAuthorizeUrlOptions

Defined in: [core/services/oauth.service.ts:13](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L13)

Options for [buildAuthorizeUrl](../functions/buildAuthorizeUrl.md)

## Properties

### alwaysPrompt?

> `optional` **alwaysPrompt?**: `boolean`

Defined in: [core/services/oauth.service.ts:32](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L32)

Force the account picker even if the user is already connected

***

### clientId

> **clientId**: `string`

Defined in: [core/services/oauth.service.ts:15](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L15)

Your platform's Connect client ID (`ca_…`, Dashboard → Connect settings)

***

### email?

> `optional` **email?**: `string`

Defined in: [core/services/oauth.service.ts:34](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L34)

Prefill the email field on the Stripe sign-up form

***

### redirectUri?

> `optional` **redirectUri?**: `string`

Defined in: [core/services/oauth.service.ts:28](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L28)

Must match a redirect URI configured in your Connect settings, if set

***

### scope?

> `optional` **scope?**: [`ConnectOAuthScope`](../type-aliases/ConnectOAuthScope.md)

Defined in: [core/services/oauth.service.ts:26](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L26)

#### Default

```ts
'read_write'
```

***

### state

> **state**: `string`

Defined in: [core/services/oauth.service.ts:24](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L24)

Unguessable CSRF token, random per attempt (e.g. `crypto.randomUUID()`),
returned unchanged on the redirect. Store it server side, then in the
callback, before calling [OAuthService.exchangeCode](../classes/OAuthService.md#exchangecode): require a
stored value, delete it so it works only once, and require the query
`state` to be a string equal to it. A bare `query.state !== stored`
check passes when both are `undefined`.

***

### stripeLanding?

> `optional` **stripeLanding?**: `"login"` \| `"register"`

Defined in: [core/services/oauth.service.ts:30](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/oauth.service.ts#L30)

Which page the user lands on: sign in (`login`) or create an account (`register`)
