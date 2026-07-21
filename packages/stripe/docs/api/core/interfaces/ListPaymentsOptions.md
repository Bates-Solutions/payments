[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPaymentsOptions

# Interface: ListPaymentsOptions

Defined in: [core/services/payments.service.ts:14](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/payments.service.ts#L14)

Options for listing payments

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/payments.service.ts:17](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/payments.service.ts#L17)

Only return payments for this customer

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/payments.service.ts:15](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/payments.service.ts#L15)

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/payments.service.ts:19](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/services/payments.service.ts#L19)

Cursor: return records after this PaymentIntent ID
