[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CreateCheckoutSessionOptions

# Interface: CreateCheckoutSessionOptions

Defined in: [core/services/checkout.service.ts:42](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L42)

Options for creating a Checkout Session

## Properties

### cancelUrl

> **cancelUrl**: `string`

Defined in: [core/services/checkout.service.ts:55](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L55)

URL to redirect to on cancel

***

### clientReferenceId?

> `optional` **clientReferenceId?**: `string`

Defined in: [core/services/checkout.service.ts:61](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L61)

Your own reference id echoed back on the session

***

### customerEmail?

> `optional` **customerEmail?**: `string`

Defined in: [core/services/checkout.service.ts:59](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L59)

Prefill the email for a new customer (ignored when `customerId` is set)

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/checkout.service.ts:57](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L57)

Existing customer to attach the session to

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [core/services/checkout.service.ts:65](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L65)

Idempotency key (defaults to a generated UUID)

***

### lineItems

> **lineItems**: [`CheckoutLineItem`](CheckoutLineItem.md)[]

Defined in: [core/services/checkout.service.ts:51](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L51)

Line items (price + quantity)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [core/services/checkout.service.ts:63](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L63)

Key/value metadata attached to the session

***

### mode?

> `optional` **mode?**: `Mode`

Defined in: [core/services/checkout.service.ts:49](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L49)

Checkout mode.

#### Default

```ts
'subscription'
```

***

### successUrl

> **successUrl**: `string`

Defined in: [core/services/checkout.service.ts:53](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/checkout.service.ts#L53)

URL to redirect to on success
