[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverClientConfig

# Interface: CloverClientConfig

Defined in: core/client.ts:10

Configuration options for the Clover client.

## Properties

### apiToken

> **apiToken**: `string`

Defined in: core/client.ts:12

Clover API token (OAuth access token or API key)

***

### environment?

> `optional` **environment?**: [`CloverEnvironment`](../type-aliases/CloverEnvironment.md)

Defined in: core/client.ts:22

Environment.

#### Default

```ts
'sandbox'
```

***

### fetchImpl?

> `optional` **fetchImpl?**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: core/client.ts:24

Override the `fetch` implementation (mainly for tests).

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

***

### merchantId?

> `optional` **merchantId?**: `string`

Defined in: core/client.ts:17

Merchant id. Required for platform (`/v3/merchants/{mId}`) operations such
as `customers`; not needed for Ecommerce charges/refunds.
