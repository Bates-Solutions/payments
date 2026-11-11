[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListRefundsOptions

# Interface: ListRefundsOptions

Defined in: [core/services/refunds.service.ts:39](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/refunds.service.ts#L39)

Options for listing refunds

## Properties

### chargeId?

> `optional` **chargeId?**: `string`

Defined in: [core/services/refunds.service.ts:44](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/refunds.service.ts#L44)

Only return refunds for this charge

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/refunds.service.ts:40](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/refunds.service.ts#L40)

***

### paymentIntentId?

> `optional` **paymentIntentId?**: `string`

Defined in: [core/services/refunds.service.ts:42](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/refunds.service.ts#L42)

Only return refunds for this PaymentIntent

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/refunds.service.ts:46](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/refunds.service.ts#L46)

Cursor: return records after this refund ID
