[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / getInvoiceId

# Function: getInvoiceId()

> **getInvoiceId**(`event`): `string` \| `undefined`

Defined in: [server/webhook.ts:362](https://github.com/Bates-Solutions/stripe/blob/964221c430bc064fc82fc04138a48dfee1651d35/src/server/webhook.ts#L362)

Extract the Invoice ID from a webhook event, when present.

Works on `invoice.*` events (the object is the invoice) and on objects that
reference an invoice (e.g. Checkout Sessions, PaymentIntents).

## Parameters

### event

`Event`

## Returns

`string` \| `undefined`
