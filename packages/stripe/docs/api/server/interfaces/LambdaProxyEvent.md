[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / LambdaProxyEvent

# Interface: LambdaProxyEvent

Defined in: server/middleware/lambda.ts:14

Minimal API Gateway proxy event shape (avoids an aws-lambda dependency).

## Properties

### body

> **body**: `string` \| `null`

Defined in: server/middleware/lambda.ts:17

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `undefined`\> \| `null`

Defined in: server/middleware/lambda.ts:16

***

### httpMethod

> **httpMethod**: `string`

Defined in: server/middleware/lambda.ts:15

***

### isBase64Encoded?

> `optional` **isBase64Encoded?**: `boolean`

Defined in: server/middleware/lambda.ts:18
