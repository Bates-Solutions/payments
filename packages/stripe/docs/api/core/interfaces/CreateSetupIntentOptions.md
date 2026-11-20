[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateSetupIntentOptions

# Interface: CreateSetupIntentOptions

Defined in: [stripe/src/core/services/setup-intents.service.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L14)

Options for creating a SetupIntent

## Properties

### confirm?

> `optional` **confirm?**: `boolean`

Defined in: [stripe/src/core/services/setup-intents.service.ts:36](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L36)

Confirm immediately. Requires `paymentMethod`.

#### Default

```ts
false
```

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L16)

Customer the saved payment method is attached to on success

***

### description?

> `optional` **description?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:43](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L43)

Arbitrary description

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:47](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L47)

Idempotency key (defaults to a generated UUID)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [stripe/src/core/services/setup-intents.service.ts:45](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L45)

Key/value metadata

***

### paymentMethod?

> `optional` **paymentMethod?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:31](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L31)

An existing payment method to set up (e.g. from Stripe.js)

***

### paymentMethodTypes?

> `optional` **paymentMethodTypes?**: `string`[]

Defined in: [stripe/src/core/services/setup-intents.service.ts:29](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L29)

Payment method types to accept, e.g. `['card']`. Sent as
`allowed_payment_method_types`. When omitted, Stripe
uses the types enabled in your Dashboard (automatic payment methods).

***

### returnUrl?

> `optional` **returnUrl?**: `string`

Defined in: [stripe/src/core/services/setup-intents.service.ts:41](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L41)

Where to send the customer after a redirect-based authentication. Only
used when confirming here, so it requires `confirm: true`.

***

### usage?

> `optional` **usage?**: `"off_session"` \| `"on_session"`

Defined in: [stripe/src/core/services/setup-intents.service.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/stripe/src/core/services/setup-intents.service.ts#L23)

How the saved payment method will be used. `off_session` (charging the
customer when they aren't present) asks for the authentication needed up
front.

#### Default

```ts
'off_session'
```
