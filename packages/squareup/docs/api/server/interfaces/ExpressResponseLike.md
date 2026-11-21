[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / ExpressResponseLike

# Interface: ExpressResponseLike

Defined in: [squareup/src/server/middleware/express.ts:61](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L61)

Minimal structural stand-in for the Express `Response` methods used here.

## Methods

### json()

> **json**(`body`): `ExpressResponseLike`

Defined in: [squareup/src/server/middleware/express.ts:63](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L63)

#### Parameters

##### body

`unknown`

#### Returns

`ExpressResponseLike`

***

### status()

> **status**(`code`): `ExpressResponseLike`

Defined in: [squareup/src/server/middleware/express.ts:62](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/express.ts#L62)

#### Parameters

##### code

`number`

#### Returns

`ExpressResponseLike`
