[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListPaymentMethodsOptions

# Interface: ListPaymentMethodsOptions

Defined in: [core/services/payment-methods.service.ts:14](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L14)

Options for listing payment methods

## Properties

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/payment-methods.service.ts:16](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L16)

Only payment methods attached to this customer

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/payment-methods.service.ts:19](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L19)

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/payment-methods.service.ts:20](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L20)

***

### type?

> `optional` **type?**: `Type`

Defined in: [core/services/payment-methods.service.ts:18](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/payment-methods.service.ts#L18)

Only payment methods of this type, e.g. `'card'`
