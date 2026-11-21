[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ParsedWebhookRequest

# Interface: ParsedWebhookRequest

Defined in: [stripe/src/server/types.ts:100](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L100)

A parsed and verified webhook request.

## Properties

### event

> **event**: `Event`

Defined in: [stripe/src/server/types.ts:106](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L106)

The parsed event

***

### rawBody

> **rawBody**: `string`

Defined in: [stripe/src/server/types.ts:102](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L102)

The raw request body

***

### signature

> **signature**: `string`

Defined in: [stripe/src/server/types.ts:104](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/types.ts#L104)

The signature from the `stripe-signature` header
