[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / Charge

# Interface: Charge

Defined in: [core/services/payments.service.ts:9](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L9)

A Clover Ecommerce charge (a payment).

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: [core/services/payments.service.ts:11](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L11)

***

### captured?

> `optional` **captured?**: `boolean`

Defined in: [core/services/payments.service.ts:16](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L16)

***

### created?

> `optional` **created?**: `number`

Defined in: [core/services/payments.service.ts:22](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L22)

***

### currency?

> `optional` **currency?**: `string`

Defined in: [core/services/payments.service.ts:12](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L12)

***

### description?

> `optional` **description?**: `string`

Defined in: [core/services/payments.service.ts:23](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L23)

***

### id?

> `optional` **id?**: `string`

Defined in: [core/services/payments.service.ts:10](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L10)

***

### paid?

> `optional` **paid?**: `boolean`

Defined in: [core/services/payments.service.ts:15](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L15)

***

### source?

> `optional` **source?**: `object`

Defined in: [core/services/payments.service.ts:17](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L17)

#### brand?

> `optional` **brand?**: `string`

#### id?

> `optional` **id?**: `string`

#### last4?

> `optional` **last4?**: `string`

***

### status?

> `optional` **status?**: `string`

Defined in: [core/services/payments.service.ts:14](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/payments.service.ts#L14)

Charge status (e.g. `paid`, `succeeded`)
