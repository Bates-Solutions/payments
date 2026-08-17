[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / WebhookSubscription

# Type Alias: WebhookSubscription

> **WebhookSubscription** = `Omit`\<`Square.WebhookSubscription`, `"signatureKey"`\>

Defined in: core/services/webhook-subscriptions.service.ts:13

A webhook subscription as returned by `get`, `list`, and `update`.

Note the absence of `signatureKey`: Square only returns the signature key
**once, on creation**. Persist it then — see [CreatedWebhookSubscription](CreatedWebhookSubscription.md).
A later `get`/`list` never includes it; to recover a usable key without
losing the subscription, rotate it with [WebhookSubscriptionsService.rotateSignatureKey](../classes/WebhookSubscriptionsService.md#rotatesignaturekey).
