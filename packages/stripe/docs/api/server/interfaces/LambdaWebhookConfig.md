[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / LambdaWebhookConfig

# Interface: LambdaWebhookConfig

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:74](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L74)
=======
Defined in: [server/middleware/lambda.ts:74](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L74)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Configuration for Lambda webhook handling.

## Extends

- [`VerifyOptions`](VerifyOptions.md)

## Properties

### corsHeaders?

> `optional` **corsHeaders?**: `Record`\<`string`, `string`\>

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:80](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L80)
=======
Defined in: [server/middleware/lambda.ts:80](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L80)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Custom CORS headers (merged with defaults)

***

### handlers

> **handlers**: [`LambdaWebhookHandlers`](../type-aliases/LambdaWebhookHandlers.md)

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:78](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L78)
=======
Defined in: [server/middleware/lambda.ts:78](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L78)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Event handlers by type

***

### logger?

> `optional` **logger?**: `false` \| [`WebhookLogger`](WebhookLogger.md)

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:82](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L82)
=======
Defined in: [server/middleware/lambda.ts:82](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L82)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Logger instance (defaults to console); pass `false` to disable

***

### onUnhandledEvent?

> `optional` **onUnhandledEvent?**: (`event`, `context`) => `void` \| `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:84](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L84)
=======
Defined in: [server/middleware/lambda.ts:84](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L84)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Callback for events with no registered handler

#### Parameters

##### event

`Event`

##### context

[`WebhookEventContext`](WebhookEventContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### signingSecret

> **signingSecret**: `string`

<<<<<<< HEAD
Defined in: [server/middleware/lambda.ts:76](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L76)
=======
Defined in: [server/middleware/lambda.ts:76](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/lambda.ts#L76)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Stripe webhook signing secret (`whsec_…`)

***

### tolerance?

> `optional` **tolerance?**: `number`

<<<<<<< HEAD
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L50)
=======
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L50)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`VerifyOptions`](VerifyOptions.md).[`tolerance`](VerifyOptions.md#tolerance)
