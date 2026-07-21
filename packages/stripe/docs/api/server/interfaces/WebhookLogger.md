[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookLogger

# Interface: WebhookLogger

Defined in: [server/middleware/lambda.ts:57](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L57)

Logger interface for the Lambda webhook handler.

## Properties

### error

> **error**: (`message`, `data?`) => `void`

Defined in: [server/middleware/lambda.ts:59](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L59)

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

Defined in: [server/middleware/lambda.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L58)

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
