[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookVerificationResult

# Interface: WebhookVerificationResult

Defined in: [server/types.ts:83](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/types.ts#L83)

Result of webhook signature verification.

## Properties

### error?

> `optional` **error?**: `string`

Defined in: [server/types.ts:87](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/types.ts#L87)

Error message if invalid

***

### valid

> **valid**: `boolean`

Defined in: [server/types.ts:85](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/types.ts#L85)

Whether the signature is valid
