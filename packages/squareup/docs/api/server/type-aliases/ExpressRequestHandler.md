[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ExpressRequestHandler

# Type Alias: ExpressRequestHandler

> **ExpressRequestHandler** = (`req`, `res`, `next`) => `void` \| `Promise`\<`void`\>

Defined in: [squareup/src/server/middleware/express.ts:70](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L70)

Minimal structural stand-in for the Express `RequestHandler`.

## Parameters

### req

[`ExpressRequestLike`](../interfaces/ExpressRequestLike.md)

### res

[`ExpressResponseLike`](../interfaces/ExpressResponseLike.md)

### next

[`ExpressNextFunction`](ExpressNextFunction.md)

## Returns

`void` \| `Promise`\<`void`\>
