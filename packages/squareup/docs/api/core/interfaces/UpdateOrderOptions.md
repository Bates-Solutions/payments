[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / UpdateOrderOptions

# Interface: UpdateOrderOptions

Defined in: [squareup/src/core/types/index.ts:243](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L243)

Options for `orders.update()`. Square applies them as a sparse update: only
the fields you set change.

## Properties

### fieldsToClear?

> `optional` **fieldsToClear?**: `string`[]

Defined in: [squareup/src/core/types/index.ts:258](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L258)

Fields to remove, as Square dot paths, e.g.
`'fulfillments[FULFILLMENT_UID].shipment_details.tracking_url'`.

***

### fulfillments?

> `optional` **fulfillments?**: [`UpdateOrderFulfillmentInput`](UpdateOrderFulfillmentInput.md)[]

Defined in: [squareup/src/core/types/index.ts:253](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L253)

Fulfillments to change, each matched on `uid`.

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: [squareup/src/core/types/index.ts:263](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L263)

Reuse it only when resending the identical request; a retry with a new
`version` needs a new key.

***

### referenceId?

> `optional` **referenceId?**: `string`

Defined in: [squareup/src/core/types/index.ts:249](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L249)

***

### state?

> `optional` **state?**: `OrderState`

Defined in: [squareup/src/core/types/index.ts:251](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L251)

Order state, e.g. `'CANCELED'` to cancel an open order or DRAFT template.

***

### version

> **version**: `number`

Defined in: [squareup/src/core/types/index.ts:248](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L248)

The order's current version. Square rejects a stale one, which is how a
concurrent change is detected.
