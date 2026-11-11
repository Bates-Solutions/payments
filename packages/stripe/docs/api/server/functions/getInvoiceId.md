[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / getInvoiceId

# Function: getInvoiceId()

> **getInvoiceId**(`event`): `string` \| `undefined`

Defined in: [server/webhook.ts:373](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/server/webhook.ts#L373)

Extract the Invoice ID from a webhook event, when present.

Works on `invoice.*` events (the object is the invoice) and on objects that
reference an invoice (e.g. Checkout Sessions, PaymentIntents).

## Parameters

### event

`Event`

## Returns

`string` \| `undefined`
