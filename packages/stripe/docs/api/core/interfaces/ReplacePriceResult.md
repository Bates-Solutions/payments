[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / ReplacePriceResult

# Interface: ReplacePriceResult

Defined in: [core/services/prices.service.ts:119](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L119)

Result of [PricesService.replace](../classes/PricesService.md#replace).

## Properties

### previous

> **previous**: `Price`

Defined in: [core/services/prices.service.ts:123](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L123)

The old price, now inactive

***

### price

> **price**: `Price`

Defined in: [core/services/prices.service.ts:121](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L121)

The newly created, active price
