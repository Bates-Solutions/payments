[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ParsedWebhookRequest

# Interface: ParsedWebhookRequest

Defined in: [server/types.ts:93](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L93)

A parsed and verified webhook request.

## Properties

### event

> **event**: `Event`

Defined in: [server/types.ts:99](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L99)

The parsed event

***

### rawBody

> **rawBody**: `string`

Defined in: [server/types.ts:95](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L95)

The raw request body

***

### signature

> **signature**: `string`

Defined in: [server/types.ts:97](https://github.com/mbates/stripe/blob/1dfc19f47c2036a15d4f534929d617adb51479a3/src/server/types.ts#L97)

The signature from the `stripe-signature` header
