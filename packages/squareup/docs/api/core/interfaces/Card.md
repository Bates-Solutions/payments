[**@bates-solutions/squareup API Reference v3.0.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / Card

# Interface: Card

Defined in: [squareup/src/core/types/index.ts:316](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L316)

A card on file, as the Cards API returns it.

## Properties

### billingAddress?

> `optional` **billingAddress?**: `Address`

Defined in: [squareup/src/core/types/index.ts:324](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L324)

***

### bin?

> `optional` **bin?**: `string`

Defined in: [squareup/src/core/types/index.ts:336](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L336)

***

### cardBrand?

> `optional` **cardBrand?**: `string`

Defined in: [squareup/src/core/types/index.ts:319](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L319)

For example `VISA`, `MASTERCARD` or `AMERICAN_EXPRESS`.

***

### cardholderName?

> `optional` **cardholderName?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:323](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L323)

***

### cardType?

> `optional` **cardType?**: `string`

Defined in: [squareup/src/core/types/index.ts:333](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L333)

`CREDIT`, `DEBIT` or `UNKNOWN_CARD_TYPE`.

***

### createdAt?

> `optional` **createdAt?**: `string`

Defined in: [squareup/src/core/types/index.ts:337](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L337)

***

### customerId?

> `optional` **customerId?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:327](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L327)

***

### disabledAt?

> `optional` **disabledAt?**: `string`

Defined in: [squareup/src/core/types/index.ts:338](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L338)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [squareup/src/core/types/index.ts:331](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L331)

`false` once the card is disabled; a disabled card cannot be charged.

***

### expMonth?

> `optional` **expMonth?**: `bigint` \| `null`

Defined in: [squareup/src/core/types/index.ts:321](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L321)

***

### expYear?

> `optional` **expYear?**: `bigint` \| `null`

Defined in: [squareup/src/core/types/index.ts:322](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L322)

***

### fingerprint?

> `optional` **fingerprint?**: `string`

Defined in: [squareup/src/core/types/index.ts:326](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L326)

Identifies the card number across customers and merchants.

***

### id?

> `optional` **id?**: `string`

Defined in: [squareup/src/core/types/index.ts:317](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L317)

***

### last4?

> `optional` **last4?**: `string`

Defined in: [squareup/src/core/types/index.ts:320](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L320)

***

### merchantId?

> `optional` **merchantId?**: `string`

Defined in: [squareup/src/core/types/index.ts:328](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L328)

***

### prepaidType?

> `optional` **prepaidType?**: `string`

Defined in: [squareup/src/core/types/index.ts:335](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L335)

`PREPAID`, `NOT_PREPAID` or `UNKNOWN_PREPAID_TYPE`.

***

### referenceId?

> `optional` **referenceId?**: `string` \| `null`

Defined in: [squareup/src/core/types/index.ts:329](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L329)

***

### version?

> `optional` **version?**: `bigint`

Defined in: [squareup/src/core/types/index.ts:339](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/core/types/index.ts#L339)
