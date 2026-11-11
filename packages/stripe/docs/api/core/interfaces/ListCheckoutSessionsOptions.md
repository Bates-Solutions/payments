[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ListCheckoutSessionsOptions

# Interface: ListCheckoutSessionsOptions

Defined in: [core/services/checkout.service.ts:71](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L71)

Options for listing Checkout Sessions

## Properties

### created?

> `optional` **created?**: [`TimeRange`](TimeRange.md)

Defined in: [core/services/checkout.service.ts:80](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L80)

Only sessions created in this time range

***

### customerId?

> `optional` **customerId?**: `string`

Defined in: [core/services/checkout.service.ts:73](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L73)

***

### expandLineItems?

> `optional` **expandLineItems?**: `boolean`

Defined in: [core/services/checkout.service.ts:87](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L87)

Expand each session's `line_items`. Stripe includes only the first page
of line items this way; use [CheckoutService.listLineItems](../classes/CheckoutService.md#listlineitems) to get
all of a session's items.

#### Default

```ts
false
```

***

### limit?

> `optional` **limit?**: `number`

Defined in: [core/services/checkout.service.ts:72](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L72)

***

### paymentLinkId?

> `optional` **paymentLinkId?**: `string`

Defined in: [core/services/checkout.service.ts:76](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L76)

Only sessions created from this Payment Link (`plink_…`)

***

### startingAfter?

> `optional` **startingAfter?**: `string`

Defined in: [core/services/checkout.service.ts:88](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L88)

***

### status?

> `optional` **status?**: `"open"` \| `"complete"` \| `"expired"`

Defined in: [core/services/checkout.service.ts:78](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L78)

Only sessions in this status. Use `'complete'` for finished sales.

***

### subscriptionId?

> `optional` **subscriptionId?**: `string`

Defined in: [core/services/checkout.service.ts:74](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L74)
