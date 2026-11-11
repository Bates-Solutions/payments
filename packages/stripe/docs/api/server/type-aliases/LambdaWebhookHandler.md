[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / LambdaWebhookHandler

# Type Alias: LambdaWebhookHandler

> **LambdaWebhookHandler** = (`event`, `context`) => `void` \| `Promise`\<`void`\>

Defined in: [server/middleware/lambda.ts:42](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/middleware/lambda.ts#L42)

Handler for a Lambda webhook event.

## Parameters

### event

[`WebhookEvent`](WebhookEvent.md)

### context

[`WebhookEventContext`](../interfaces/WebhookEventContext.md)

## Returns

`void` \| `Promise`\<`void`\>
