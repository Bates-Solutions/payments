[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / LambdaWebhookHandler

# Type Alias: LambdaWebhookHandler

> **LambdaWebhookHandler** = (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [server/middleware/lambda.ts:42](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/lambda.ts#L42)

Handler for a Lambda webhook event.

## Parameters

### event

[`WebhookEvent`](WebhookEvent.md)

### context

[`WebhookEventContext`](../interfaces/WebhookEventContext.md)

## Returns

`void` \| `Promise`\<`void`\>
