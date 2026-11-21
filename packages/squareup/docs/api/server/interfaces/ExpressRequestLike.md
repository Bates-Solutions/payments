[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ExpressRequestLike

# Interface: ExpressRequestLike

Defined in: [squareup/src/server/middleware/express.ts:51](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L51)

Minimal structural stand-ins for the Express types this middleware touches.

Express is only a peer/dev dependency, so it is deliberately kept out of the
published type graph. Importing `Request`/`Response`/`RequestHandler` from
`express` here would make the generated declaration file reach back into
untranspiled TypeScript source in the JSR npm tarball, breaking every
`/server` consumer — including ones that never touch Express (see
[#128](https://github.com/Bates-Solutions/squareup/issues/128)). The sibling Next.js
and Lambda middleware already declare their own local types for the same
reason. These interfaces are structurally compatible with Express 4 and 5, so
`createExpressWebhookHandler(...)` still drops straight into
`app.post(path, handler)` with full type-checking.

## Extended by

- [`SquareWebhookRequest`](SquareWebhookRequest.md)

## Properties

### body?

> `optional` **body?**: `unknown`

Defined in: [squareup/src/server/middleware/express.ts:53](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L53)

Parsed or raw request body (Buffer, string, or parsed JSON).

***

### headers

> **headers**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [squareup/src/server/middleware/express.ts:55](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L55)

Request headers, keyed lowercase as Node/Express provide them.

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
