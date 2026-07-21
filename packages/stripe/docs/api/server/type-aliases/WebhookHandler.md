[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookHandler

# Type Alias: WebhookHandler\<E\>

> **WebhookHandler**\<`E`\> = (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [server/types.ts:19](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L19)

Handler for a webhook event of a specific type.

## Type Parameters

### E

`E` *extends* [`WebhookEvent`](WebhookEvent.md) = [`WebhookEvent`](WebhookEvent.md)

## Parameters

### event

`E`

## Returns

`void` \| `Promise`\<`void`\>
