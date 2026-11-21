[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / SquareWebhookRequest

# Interface: SquareWebhookRequest

Defined in: [squareup/src/server/middleware/express.ts:86](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L86)

Request object as seen by the webhook middleware, carrying the Square webhook
data it attaches.

This extends the minimal [ExpressRequestLike](ExpressRequestLike.md) rather than Express's full
`Request` (see the note above), so it exposes only `body`, `headers`, `on`,
plus the fields below. If you type your own downstream middleware against it
and need Express's extras (`params`, `query`, `get(...)`, …), intersect it
with the real Express request: `req: SquareWebhookRequest & express.Request`.

## Extends

- [`ExpressRequestLike`](ExpressRequestLike.md)

## Properties

### body?

> `optional` **body?**: `unknown`

Defined in: [squareup/src/server/middleware/express.ts:53](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L53)

Parsed or raw request body (Buffer, string, or parsed JSON).

#### Inherited from

[`ExpressRequestLike`](ExpressRequestLike.md).[`body`](ExpressRequestLike.md#body)

***

### headers

> **headers**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [squareup/src/server/middleware/express.ts:55](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L55)

Request headers, keyed lowercase as Node/Express provide them.

#### Inherited from

[`ExpressRequestLike`](ExpressRequestLike.md).[`headers`](ExpressRequestLike.md#headers)

***

### rawBody?

> `optional` **rawBody?**: `string`

Defined in: [squareup/src/server/middleware/express.ts:88](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L88)

The raw request body as a string

***

### squareEvent?

> `optional` **squareEvent?**: [`WebhookEvent`](WebhookEvent.md)\<`unknown`\>

Defined in: [squareup/src/server/middleware/express.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L90)

The parsed Square webhook event

## Methods

### on()

> **on**(`event`, `listener`): `unknown`

Defined in: [squareup/src/server/middleware/express.ts:57](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L57)

Node stream event subscription, used to capture the raw body.

#### Parameters

##### event

`string`

##### listener

(...`args`) => `void`

#### Returns

`unknown`

#### Inherited from

[`ExpressRequestLike`](ExpressRequestLike.md).[`on`](ExpressRequestLike.md#on)
