[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / WebhookVerificationResult

# Interface: WebhookVerificationResult

Defined in: [stripe/src/server/types.ts:88](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L88)

Result of webhook signature verification.

## Properties

### error?

> `optional` **error?**: `string`

Defined in: [stripe/src/server/types.ts:92](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L92)

Error message if invalid

***

### valid

> **valid**: `boolean`

Defined in: [stripe/src/server/types.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L90)

Whether the signature is valid
