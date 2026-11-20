[**@bates-solutions/squareup API Reference v2.5.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / RefundWebhookObject

# Interface: RefundWebhookObject

Defined in: [squareup/src/server/types.ts:190](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L190)

Refund object in a webhook event payload

## Properties

### refund

> **refund**: `object`

Defined in: [squareup/src/server/types.ts:191](https://github.com/Bates-Solutions/payments/blob/main/packages/squareup/src/server/types.ts#L191)

#### amount\_money?

> `optional` **amount\_money?**: `object`

##### amount\_money.amount

> **amount**: `number`

##### amount\_money.currency

> **currency**: `string`

#### id

> **id**: `string`

#### order\_id?

> `optional` **order\_id?**: `string`

#### payment\_id

> **payment\_id**: `string`

#### status

> **status**: `string`
