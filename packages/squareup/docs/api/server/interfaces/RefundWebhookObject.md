[**@bates-solutions/squareup API Reference v1.13.1**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [server](../README.md) / RefundWebhookObject

# Interface: RefundWebhookObject

Defined in: [server/types.ts:180](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L180)

Refund object in a webhook event payload

## Properties

### refund

> **refund**: `object`

Defined in: [server/types.ts:181](https://github.com/mbates/squareup/blob/26c398e8822da078165ab8a6372621257716b376/src/server/types.ts#L181)

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
