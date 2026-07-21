[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListRefundsOptions

# Interface: ListRefundsOptions

Defined in: core/services/refunds.service.ts:39

Options for listing refunds

## Properties

### chargeId?

> `optional` **chargeId?**: `string`

Defined in: core/services/refunds.service.ts:44

Only return refunds for this charge

***

### limit?

> `optional` **limit?**: `number`

Defined in: core/services/refunds.service.ts:40

***

### paymentIntentId?

> `optional` **paymentIntentId?**: `string`

Defined in: core/services/refunds.service.ts:42

Only return refunds for this PaymentIntent

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: core/services/refunds.service.ts:46

Cursor: return records after this refund ID
