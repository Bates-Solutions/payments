[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / LambdaProxyEvent

# Interface: LambdaProxyEvent

Defined in: [squareup/src/server/middleware/lambda.ts:40](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L40)

Minimal API Gateway proxy event shape (avoids aws-lambda dependency)

## Properties

### body

> **body**: `string` \| `null`

Defined in: [squareup/src/server/middleware/lambda.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L43)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `undefined`\> \| `null`

Defined in: [squareup/src/server/middleware/lambda.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L42)

***

### httpMethod

> **httpMethod**: `string`

Defined in: [squareup/src/server/middleware/lambda.ts:41](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L41)

***

### isBase64Encoded?

> `optional` **isBase64Encoded?**: `boolean`

Defined in: [squareup/src/server/middleware/lambda.ts:44](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L44)
