[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / LineItem

# Interface: LineItem

Defined in: [core/services/orders.service.ts:52](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L52)

A line item on a Clover order.

## Properties

### alternateName?

> `optional` **alternateName?**: `string`

Defined in: [core/services/orders.service.ts:57](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L57)

***

### createdTime?

> `optional` **createdTime?**: `number`

Defined in: [core/services/orders.service.ts:79](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L79)

Created, in milliseconds since the epoch

***

### discountAmount?

> `optional` **discountAmount?**: `number`

Defined in: [core/services/orders.service.ts:77](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L77)

Fixed discount in cents

***

### discounts?

> `optional` **discounts?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:82](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L82)

With `expand: ['lineItems.discounts']`. Always an array (envelope unwrapped).

***

### exchanged?

> `optional` **exchanged?**: `boolean`

Defined in: [core/services/orders.service.ts:73](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L73)

***

### id?

> `optional` **id?**: `string`

Defined in: [core/services/orders.service.ts:53](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L53)

***

### isRevenue?

> `optional` **isRevenue?**: `boolean`

Defined in: [core/services/orders.service.ts:75](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L75)

***

### item?

> `optional` **item?**: `object`

Defined in: [core/services/orders.service.ts:55](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L55)

The inventory item this line was rung up from. Absent for custom items.

#### id

> **id**: `string`

***

### itemCode?

> `optional` **itemCode?**: `string`

Defined in: [core/services/orders.service.ts:70](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L70)

***

### modifications?

> `optional` **modifications?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:84](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L84)

With `expand: ['lineItems.modifications']`. Always an array (envelope unwrapped).

***

### name?

> `optional` **name?**: `string`

Defined in: [core/services/orders.service.ts:56](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L56)

***

### note?

> `optional` **note?**: `string`

Defined in: [core/services/orders.service.ts:71](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L71)

***

### orderClientCreatedTime?

> `optional` **orderClientCreatedTime?**: `number`

Defined in: [core/services/orders.service.ts:80](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L80)

***

### price?

> `optional` **price?**: `number`

Defined in: [core/services/orders.service.ts:59](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L59)

Unit price in cents

***

### priceWithModifiers?

> `optional` **priceWithModifiers?**: `number`

Defined in: [core/services/orders.service.ts:61](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L61)

Price in cents including modifiers (reporting only)

***

### printed?

> `optional` **printed?**: `boolean`

Defined in: [core/services/orders.service.ts:72](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L72)

***

### refunded?

> `optional` **refunded?**: `boolean`

Defined in: [core/services/orders.service.ts:74](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L74)

***

### unitName?

> `optional` **unitName?**: `string`

Defined in: [core/services/orders.service.ts:69](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L69)

Unit name (e.g. `oz`, `lb`) for `PER_UNIT` items

***

### unitQty?

> `optional` **unitQty?**: `number`

Defined in: [core/services/orders.service.ts:67](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L67)

Quantity for `PER_UNIT` items as a fixed-point integer scaled by 1000
(`2500` is 2.5 `unitName`). Absent for other items: Clover adds one line
item per unit sold, so count the lines instead.
