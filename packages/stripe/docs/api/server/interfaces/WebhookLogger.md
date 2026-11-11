[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookLogger

# Interface: WebhookLogger

Defined in: [server/middleware/lambda.ts:57](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/middleware/lambda.ts#L57)

Logger interface for the Lambda webhook handler.

## Properties

### error

> **error**: (`message`, `data?`) => `void`

Defined in: [server/middleware/lambda.ts:59](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/middleware/lambda.ts#L59)

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

Defined in: [server/middleware/lambda.ts:58](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/middleware/lambda.ts#L58)

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
