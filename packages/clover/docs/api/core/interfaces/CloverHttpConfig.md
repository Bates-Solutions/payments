[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / CloverHttpConfig

# Interface: CloverHttpConfig

Defined in: core/http.ts:23

Configuration for the Clover HTTP client.

## Properties

### apiToken

> **apiToken**: `string`

Defined in: core/http.ts:25

Clover API token (OAuth access token or API key)

***

### environment

> **environment**: [`CloverEnvironment`](../type-aliases/CloverEnvironment.md)

Defined in: core/http.ts:29

Environment (default `sandbox`)

***

### fetchImpl?

> `optional` **fetchImpl?**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: core/http.ts:31

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

***

### merchantId?

> `optional` **merchantId?**: `string`

Defined in: core/http.ts:27

Merchant id — required for platform (`/v3/merchants/{mId}`) endpoints
