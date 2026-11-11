[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [server](../README.md) / LambdaProxyEvent

# Interface: LambdaProxyEvent

Defined in: [server/middleware/lambda.ts:13](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L13)

Minimal API Gateway proxy event shape (avoids an aws-lambda dependency).

## Properties

### body

> **body**: `string` \| `null`

Defined in: [server/middleware/lambda.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L16)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `undefined`\> \| `null`

Defined in: [server/middleware/lambda.ts:15](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L15)

***

### httpMethod

> **httpMethod**: `string`

Defined in: [server/middleware/lambda.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L14)

***

### isBase64Encoded?

> `optional` **isBase64Encoded?**: `boolean`

Defined in: [server/middleware/lambda.ts:17](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/server/middleware/lambda.ts#L17)
