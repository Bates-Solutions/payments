[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / RefundPaymentOptions

# Interface: RefundPaymentOptions

Defined in: [squareup/src/core/types/index.ts:395](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L395)

Options for `refunds.refundPayment()`.

## Properties

### amountMoney

> **amountMoney**: `object`

Defined in: [squareup/src/core/types/index.ts:403](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L403)

How much to refund, in the smallest currency unit (cents). At most the
payment total minus what is already refunded. `currency` defaults to the
client's `defaultCurrency` and must match the payment's.

#### amount

> **amount**: `number` \| `bigint`

#### currency?

> `optional` **currency?**: `"USD"` \| `"CAD"` \| `"GBP"` \| `"EUR"` \| `"AUD"` \| `"JPY"`

***

### idempotencyKey

> **idempotencyKey**: `string`

Defined in: [squareup/src/core/types/index.ts:408](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L408)

Required. Square refunds once per key, so a retry with the same key cannot
refund twice. At most 45 characters.

***

### paymentId

> **paymentId**: `string`

Defined in: [squareup/src/core/types/index.ts:397](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L397)

The payment to refund.

***

### reason?

> `optional` **reason?**: `string`

Defined in: [squareup/src/core/types/index.ts:410](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L410)

Why the payment is refunded, shown to the seller.
