[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / WebhookLogger

# Interface: WebhookLogger

Defined in: [squareup/src/server/middleware/lambda.ts:83](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L83)

Logger interface for Lambda webhook handler

## Properties

### error

> **error**: (`message`, `data?`) => `void`

Defined in: [squareup/src/server/middleware/lambda.ts:85](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L85)

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### info

> **info**: (`message`, `data?`) => `void`

Defined in: [squareup/src/server/middleware/lambda.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/middleware/lambda.ts#L84)

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
