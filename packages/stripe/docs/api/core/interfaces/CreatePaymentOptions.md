[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreatePaymentOptions

# Interface: CreatePaymentOptions

<<<<<<< HEAD
Defined in: [core/types/index.ts:50](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L50)
=======
Defined in: [core/types/index.ts:50](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L50)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Options for creating a payment (PaymentIntent)

## Properties

### amount

> **amount**: `number`

<<<<<<< HEAD
Defined in: [core/types/index.ts:52](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L52)
=======
Defined in: [core/types/index.ts:52](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L52)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Amount in the smallest currency unit (e.g. cents)

***

### confirm?

> `optional` **confirm?**: `boolean`

<<<<<<< HEAD
Defined in: [core/types/index.ts:63](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L63)
=======
Defined in: [core/types/index.ts:63](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L63)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Confirm the PaymentIntent immediately after creation.

#### Default

```ts
false
```

***

### currency?

> `optional` **currency?**: [`CurrencyCode`](../type-aliases/CurrencyCode.md)

<<<<<<< HEAD
Defined in: [core/types/index.ts:54](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L54)
=======
Defined in: [core/types/index.ts:54](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L54)
>>>>>>> feat/edge-webhook-and-subscription-helpers

ISO currency code (default: `usd`)

***

### customerId?

> `optional` **customerId?**: `string`

<<<<<<< HEAD
Defined in: [core/types/index.ts:56](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L56)
=======
Defined in: [core/types/index.ts:56](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L56)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Customer to attach the payment to

***

### description?

> `optional` **description?**: `string`

<<<<<<< HEAD
Defined in: [core/types/index.ts:65](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L65)
=======
Defined in: [core/types/index.ts:65](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L65)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Arbitrary description shown in the Stripe dashboard

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

<<<<<<< HEAD
Defined in: [core/types/index.ts:71](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L71)
=======
Defined in: [core/types/index.ts:71](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L71)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Idempotency key (defaults to a generated UUID)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

<<<<<<< HEAD
Defined in: [core/types/index.ts:69](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L69)
=======
Defined in: [core/types/index.ts:69](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L69)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Key/value metadata attached to the PaymentIntent

***

### paymentMethod?

> `optional` **paymentMethod?**: `string`

<<<<<<< HEAD
Defined in: [core/types/index.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L58)
=======
Defined in: [core/types/index.ts:58](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L58)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Payment method to charge (e.g. `pm_…`)

***

### receiptEmail?

> `optional` **receiptEmail?**: `string`

<<<<<<< HEAD
Defined in: [core/types/index.ts:67](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/core/types/index.ts#L67)
=======
Defined in: [core/types/index.ts:67](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/core/types/index.ts#L67)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Email address to send the receipt to
