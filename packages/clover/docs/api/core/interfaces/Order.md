[**@bates-solutions/clover API Reference v1.1.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / Order

# Interface: Order

Defined in: [core/services/orders.service.ts:90](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L90)

A Clover Platform order (`/v3/merchants/{mId}/orders`).

## Properties

### clientCreatedTime?

> `optional` **clientCreatedTime?**: `number`

Defined in: [core/services/orders.service.ts:128](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L128)

Created on the device, in milliseconds since the epoch

***

### createdTime?

> `optional` **createdTime?**: `number`

Defined in: [core/services/orders.service.ts:126](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L126)

Created on Clover's servers, in milliseconds since the epoch

***

### credits?

> `optional` **credits?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:118](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L118)

With `expand: ['credits']`

***

### currency?

> `optional` **currency?**: `string`

Defined in: [core/services/orders.service.ts:93](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L93)

ISO 4217 currency code

***

### customers?

> `optional` **customers?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:110](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L110)

With `expand: ['customers']`

***

### discounts?

> `optional` **discounts?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:122](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L122)

With `expand: ['discounts']`

***

### employee?

> `optional` **employee?**: `object`

Defined in: [core/services/orders.service.ts:104](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L104)

#### id

> **id**: `string`

***

### externalReferenceId?

> `optional` **externalReferenceId?**: `string`

Defined in: [core/services/orders.service.ts:103](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L103)

***

### id?

> `optional` **id?**: `string`

Defined in: [core/services/orders.service.ts:91](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L91)

***

### lineItems?

> `optional` **lineItems?**: [`LineItem`](LineItem.md)[]

Defined in: [core/services/orders.service.ts:112](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L112)

With `expand: ['lineItems']`

***

### manualTransaction?

> `optional` **manualTransaction?**: `boolean`

Defined in: [core/services/orders.service.ts:123](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L123)

***

### modifiedTime?

> `optional` **modifiedTime?**: `number`

Defined in: [core/services/orders.service.ts:129](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L129)

***

### note?

> `optional` **note?**: `string`

Defined in: [core/services/orders.service.ts:102](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L102)

***

### payments?

> `optional` **payments?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:114](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L114)

With `expand: ['payments']`

***

### paymentState?

> `optional` **paymentState?**: [`OrderPaymentState`](../type-aliases/OrderPaymentState.md)

Defined in: [core/services/orders.service.ts:99](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L99)

***

### payType?

> `optional` **payType?**: `"SPLIT_GUEST"` \| `"SPLIT_ITEM"` \| `"SPLIT_CUSTOM"` \| `"FULL"`

Defined in: [core/services/orders.service.ts:100](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L100)

***

### refunds?

> `optional` **refunds?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:116](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L116)

With `expand: ['refunds']`

***

### state?

> `optional` **state?**: `string`

Defined in: [core/services/orders.service.ts:98](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L98)

Order state, e.g. `open` or `locked`

***

### testMode?

> `optional` **testMode?**: `boolean`

Defined in: [core/services/orders.service.ts:124](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L124)

***

### title?

> `optional` **title?**: `string`

Defined in: [core/services/orders.service.ts:101](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L101)

***

### total?

> `optional` **total?**: `number`

Defined in: [core/services/orders.service.ts:95](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L95)

Total in cents

***

### unpaidBalance?

> `optional` **unpaidBalance?**: `number`

Defined in: [core/services/orders.service.ts:96](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L96)

***

### voids?

> `optional` **voids?**: `CloverObject`[]

Defined in: [core/services/orders.service.ts:120](https://github.com/Bates-Solutions/payments/blob/main/packages/clover/src/core/services/orders.service.ts#L120)

With `expand: ['voids']`
