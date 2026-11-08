[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / Charge

# Interface: Charge

Defined in: core/services/payments.service.ts:9

A Clover Ecommerce charge (a payment).

## Properties

### amount?

> `optional` **amount?**: `number`

Defined in: core/services/payments.service.ts:11

***

### captured?

> `optional` **captured?**: `boolean`

Defined in: core/services/payments.service.ts:16

***

### created?

> `optional` **created?**: `number`

Defined in: core/services/payments.service.ts:22

***

### currency?

> `optional` **currency?**: `string`

Defined in: core/services/payments.service.ts:12

***

### description?

> `optional` **description?**: `string`

Defined in: core/services/payments.service.ts:23

***

### id?

> `optional` **id?**: `string`

Defined in: core/services/payments.service.ts:10

***

### paid?

> `optional` **paid?**: `boolean`

Defined in: core/services/payments.service.ts:15

***

### source?

> `optional` **source?**: `object`

Defined in: core/services/payments.service.ts:17

#### brand?

> `optional` **brand?**: `string`

#### id?

> `optional` **id?**: `string`

#### last4?

> `optional` **last4?**: `string`

***

### status?

> `optional` **status?**: `string`

Defined in: core/services/payments.service.ts:14

Charge status (e.g. `paid`, `succeeded`)
