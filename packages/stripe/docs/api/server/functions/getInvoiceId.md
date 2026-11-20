[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / getInvoiceId

# Function: getInvoiceId()

> **getInvoiceId**(`event`): `string` \| `undefined`

Defined in: [stripe/src/server/webhook.ts:296](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/webhook.ts#L296)

Extract the Invoice ID from a webhook event, when present.

Works on `invoice.*` events (the object is the invoice) and on objects that
reference an invoice (e.g. Checkout Sessions, PaymentIntents).

## Parameters

### event

`Event`

## Returns

`string` \| `undefined`
