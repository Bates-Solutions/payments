[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookLogger

# Interface: WebhookLogger

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:57](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L57)
=======
Defined in: [server/middleware/lambda.ts:57](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L57)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Logger interface for the Lambda webhook handler.

## Properties

### error

> **error**: (`message`, `data?`) => `void`

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:59](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L59)
=======
Defined in: [server/middleware/lambda.ts:59](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L59)
>>>>>>> feat/edge-webhook-and-subscription-helpers

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

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L58)
=======
Defined in: [server/middleware/lambda.ts:58](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L58)
>>>>>>> feat/edge-webhook-and-subscription-helpers

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
