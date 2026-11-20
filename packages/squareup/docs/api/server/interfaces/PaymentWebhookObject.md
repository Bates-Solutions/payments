[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / PaymentWebhookObject

# Interface: PaymentWebhookObject

Defined in: [squareup/src/server/types.ts:162](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L162)

Payment object in a webhook event payload

## Properties

### payment

> **payment**: `object`

Defined in: [squareup/src/server/types.ts:163](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L163)

#### amount\_money?

> `optional` **amount\_money?**: `object`

##### amount\_money.amount

> **amount**: `number`

##### amount\_money.currency

> **currency**: `string`

#### created\_at?

> `optional` **created\_at?**: `string`

#### customer\_id?

> `optional` **customer\_id?**: `string`

#### id

> **id**: `string`

#### location\_id?

> `optional` **location\_id?**: `string`

#### order\_id?

> `optional` **order\_id?**: `string`

#### source\_type?

> `optional` **source\_type?**: `string`

#### status

> **status**: `string`

#### updated\_at?

> `optional` **updated\_at?**: `string`
