[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookVerificationResult

# Interface: WebhookVerificationResult

Defined in: [server/types.ts:83](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L83)

Result of webhook signature verification.

## Properties

### error?

> `optional` **error?**: `string`

Defined in: [server/types.ts:87](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L87)

Error message if invalid

***

### valid

> **valid**: `boolean`

Defined in: [server/types.ts:85](https://github.com/mbates/stripe/blob/5c0411e48cf3edbc8319fbc8c4243148781f78cd/src/server/types.ts#L85)

Whether the signature is valid
