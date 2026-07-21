[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ParsedWebhookRequest

# Interface: ParsedWebhookRequest

Defined in: server/types.ts:81

A parsed and verified webhook request.

## Properties

### event

> **event**: `Event`

Defined in: server/types.ts:87

The parsed event

***

### rawBody

> **rawBody**: `string`

Defined in: server/types.ts:83

The raw request body

***

### signature

> **signature**: `string`

Defined in: server/types.ts:85

The signature from the `stripe-signature` header
