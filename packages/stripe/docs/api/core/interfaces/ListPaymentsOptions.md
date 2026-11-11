[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPaymentsOptions

# Interface: ListPaymentsOptions

Defined in: [core/services/payments.service.ts:14](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payments.service.ts#L14)

Options for listing payments

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/payments.service.ts:17](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payments.service.ts#L17)

Only return payments for this customer

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/payments.service.ts:15](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payments.service.ts#L15)

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/payments.service.ts:19](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payments.service.ts#L19)

Cursor: return records after this PaymentIntent ID
