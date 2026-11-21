[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / PaymentRefund

# Interface: PaymentRefund

Defined in: [squareup/src/core/types/index.ts:379](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L379)

A refund of a payment, as the Refunds API returns it.

## Properties

### amountMoney

> **amountMoney**: `object`

Defined in: [squareup/src/core/types/index.ts:384](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L384)

#### amount?

> `optional` **amount?**: `bigint` \| `null`

#### currency?

> `optional` **currency?**: `string`

***

### createdAt?

> `optional` **createdAt?**: `string`

Defined in: [squareup/src/core/types/index.ts:388](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L388)

***

### id

> **id**: `string`

Defined in: [squareup/src/core/types/index.ts:380](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L380)

***

### locationId?

> `optional` **locationId?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:383](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L383)

***

### orderId?

> `optional` **orderId?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:386](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L386)

***

### paymentId?

> `optional` **paymentId?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:385](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L385)

***

### reason?

> `optional` **reason?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:387](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L387)

***

### status?

> `optional` **status?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:382](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L382)

`PENDING`, `COMPLETED`, `REJECTED` or `FAILED`.

***

### updatedAt?

> `optional` **updatedAt?**: `string`

Defined in: [squareup/src/core/types/index.ts:389](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L389)
