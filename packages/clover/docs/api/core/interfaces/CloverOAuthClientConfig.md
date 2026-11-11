[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverOAuthClientConfig

# Interface: CloverOAuthClientConfig

Defined in: [core/oauth.ts:77](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L77)

Configuration for [CloverOAuthClient](../classes/CloverOAuthClient.md). Uses the app's credentials, not
a merchant access token.

## Properties

### clientId

> **clientId**: `string`

Defined in: [core/oauth.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L79)

App ID

***

### clientSecret

> **clientSecret**: `string`

Defined in: [core/oauth.ts:81](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L81)

App secret (Developer Dashboard, App settings). Never logged or put in errors.

***

### environment?

> `optional` **environment?**: [`CloverEnvironment`](../type-aliases/CloverEnvironment.md)

Defined in: [core/oauth.ts:83](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L83)

#### Default

```ts
'sandbox'
```

***

### fetchImpl?

> `optional` **fetchImpl?**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [core/oauth.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/oauth.ts#L85)

Override the `fetch` implementation (mainly for tests)

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`URL` \| `RequestInfo`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`string` \| `URL` \| `Request`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>
