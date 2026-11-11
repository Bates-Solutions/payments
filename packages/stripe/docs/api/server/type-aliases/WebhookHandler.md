[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookHandler

# Type Alias: WebhookHandler\<E\>

> **WebhookHandler**\<`E`\> = (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [server/types.ts:19](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/types.ts#L19)

Handler for a webhook event of a specific type.

## Type Parameters

### E

`E` *extends* [`WebhookEvent`](WebhookEvent.md) = [`WebhookEvent`](WebhookEvent.md)

## Parameters

### event

`E`

## Returns

`void` \| `Promise`\<`void`\>
