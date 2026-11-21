[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / getAccountId

# Function: getAccountId()

> **getAccountId**(`event`): `string` \| `undefined`

Defined in: [stripe/src/server/webhook.ts:297](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/server/webhook.ts#L297)

Extract the connected account ID from a webhook event, when present.

Events from a Connect webhook endpoint carry the connected account they
happened on (`event.account`). Pass it to `stripe.forAccount(id)` to act on
that account. Events on your own platform account return `undefined`.

## Parameters

### event

`Event`

## Returns

`string` \| `undefined`
