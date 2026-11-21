[**@bates-solutions/stripe API Reference v2.1.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateSetupIntentOptions

# Interface: CreateSetupIntentOptions

Defined in: [stripe/src/core/services/setup-intents.service.ts:15](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L15)

Options for creating a SetupIntent

## Properties

### confirm?

> `optional` **confirm?**: `boolean`

Defined in: [stripe/src/core/services/setup-intents.service.ts:37](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L37)

Confirm immediately. Requires `paymentMethod`.

#### Default

```ts
false
```

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:17](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L17)

Customer the saved payment method is attached to on success

***

### description?

> `optional` **description?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:44](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L44)

Arbitrary description

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:48](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L48)

Idempotency key (defaults to a generated UUID)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [stripe/src/core/services/setup-intents.service.ts:46](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L46)

Key/value metadata

***

### paymentMethod?

> `optional` **paymentMethod?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:32](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L32)

An existing payment method to set up (e.g. from Stripe.js)

***

### paymentMethodTypes?

> `optional` **paymentMethodTypes?**: `string`[]

Defined in: [stripe/src/core/services/setup-intents.service.ts:30](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L30)

Payment method types to accept, e.g. `['card']`. Sent as
`allowed_payment_method_types`. When omitted, Stripe
uses the types enabled in your Dashboard (automatic payment methods).

***

### returnUrl?

> `optional` **returnUrl?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:42](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L42)

Where to send the customer after a redirect-based authentication. Only
used when confirming here, so it requires `confirm: true`.

***

### usage?

> `optional` **usage?**: `"off_session"` \| `"on_session"`

Defined in: [stripe/src/core/services/setup-intents.service.ts:24](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L24)

How the saved payment method will be used. `off_session` (charging the
customer when they aren't present) asks for the authentication needed up
front.

#### Default

```ts
'off_session'
```
