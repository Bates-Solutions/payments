[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateCheckoutSessionOptions

# Interface: CreateCheckoutSessionOptions

Defined in: core/services/checkout.service.ts:24

Options for creating a Checkout Session

## Properties

### cancelUrl

> **cancelUrl**: `string`

Defined in: core/services/checkout.service.ts:35

URL to redirect to on cancel

***

### clientReferenceId?

> `optional` **clientReferenceId?**: `string`

Defined in: core/services/checkout.service.ts:41

Your own reference id echoed back on the session

***

### customerEmail?

> `optional` **customerEmail?**: `string`

Defined in: core/services/checkout.service.ts:39

Prefill the email for a new customer (ignored when `customerId` is set)

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: core/services/checkout.service.ts:37

Existing customer to attach the session to

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/services/checkout.service.ts:45

Idempotency key (defaults to a generated UUID)

***

### lineItems

> **lineItems**: [`CheckoutLineItem`](CheckoutLineItem.md)[]

Defined in: core/services/checkout.service.ts:31

Line items (price + quantity)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: core/services/checkout.service.ts:43

Key/value metadata attached to the session

***

### mode?

> `optional` **mode?**: `Mode`

Defined in: core/services/checkout.service.ts:29

Checkout mode.

#### Default

```ts
'subscription'
```

***

### successUrl

> **successUrl**: `string`

Defined in: core/services/checkout.service.ts:33

URL to redirect to on success
