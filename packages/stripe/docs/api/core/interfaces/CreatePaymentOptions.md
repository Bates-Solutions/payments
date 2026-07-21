[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreatePaymentOptions

# Interface: CreatePaymentOptions

Defined in: [core/types/index.ts:50](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L50)

Options for creating a payment (PaymentIntent)

## Properties

### amount

> **amount**: `number`

Defined in: [core/types/index.ts:52](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L52)

Amount in the smallest currency unit (e.g. cents)

***

### confirm?

> `optional` **confirm?**: `boolean`

Defined in: [core/types/index.ts:63](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L63)

Confirm the PaymentIntent immediately after creation.

#### Default

```ts
false
```

***

### currency?

> `optional` **currency?**: [`CurrencyCode`](../type-aliases/CurrencyCode.md)

Defined in: [core/types/index.ts:54](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L54)

ISO currency code (default: `usd`)

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/types/index.ts:56](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L56)

Customer to attach the payment to

***

### description?

> `optional` **description?**: `string`

Defined in: [core/types/index.ts:65](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L65)

Arbitrary description shown in the Stripe dashboard

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/types/index.ts:71](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L71)

Idempotency key (defaults to a generated UUID)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/types/index.ts:69](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L69)

Key/value metadata attached to the PaymentIntent

***

### paymentMethod?

> `optional` **paymentMethod?**: `string`

Defined in: [core/types/index.ts:58](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L58)

Payment method to charge (e.g. `pm_…`)

***

### receiptEmail?

> `optional` **receiptEmail?**: `string`

Defined in: [core/types/index.ts:67](https://github.com/mbates/stripe/blob/35b838ad06a203b36b707ab7be667f9e1c23ec7e/src/core/types/index.ts#L67)

Email address to send the receipt to
