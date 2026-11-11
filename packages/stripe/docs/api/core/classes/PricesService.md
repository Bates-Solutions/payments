[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PricesService

# Class: PricesService

Defined in: [core/services/prices.service.ts:181](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L181)

Prices service wrapping Stripe [Prices](https://docs.stripe.com/api/prices).

Prices are immutable once created: to change an amount, create a new price
and deactivate the old one. [PricesService.replace](#replace) does both.

## Example

```typescript
// List active prices with their product expanded (read product metadata)
const { data } = await stripe.prices.list({ active: true, expandProduct: true });
for (const price of data) {
  const product = price.product as Stripe.Product;
  console.log(product.metadata.tier, price.unit_amount, price.recurring?.interval);
}

// Create a price, then change it later
const price = await stripe.prices.create({ product: 'prod_123', unitAmount: 899, currency: 'usd' });
const { price: newPrice } = await stripe.prices.replace(price.id, { unitAmount: 949 });
```

## Constructors

### Constructor

> **new PricesService**(`client`): `PricesService`

Defined in: [core/services/prices.service.ts:182](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L182)

#### Parameters

##### client

`Stripe`

#### Returns

`PricesService`

## Methods

### archive()

> **archive**(`priceId`, `options?`): `Promise`\<`Price`\>

Defined in: [core/services/prices.service.ts:303](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L303)

Deactivate a price (`active: false`) so it can't be used for new
purchases. Existing subscriptions on it keep working.

#### Parameters

##### priceId

`string`

##### options?

###### idempotencyKey?

`string`

#### Returns

`Promise`\<`Price`\>

#### Throws

When `priceId` is missing

***

### create()

> **create**(`options`): `Promise`\<`Price`\>

Defined in: [core/services/prices.service.ts:240](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L240)

Create a price for a product.

#### Parameters

##### options

[`CreatePriceOptions`](../interfaces/CreatePriceOptions.md)

#### Returns

`Promise`\<`Price`\>

#### Throws

When `product` or `currency` is missing, or
`unitAmount` is not a non-negative integer

#### Example

```typescript
// One-time price
await stripe.prices.create({ product: 'prod_123', unitAmount: 899, currency: 'usd' });

// Monthly price
await stripe.prices.create({
  product: 'prod_123',
  unitAmount: 2900,
  currency: 'usd',
  recurring: { interval: 'month' },
});
```

***

### get()

> **get**(`priceId`, `options?`): `Promise`\<`Price`\>

Defined in: [core/services/prices.service.ts:210](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L210)

Retrieve a price by ID, optionally expanding its product.

#### Parameters

##### priceId

`string`

##### options?

###### expandProduct?

`boolean`

#### Returns

`Promise`\<`Price`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Price`\>\>

Defined in: [core/services/prices.service.ts:187](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L187)

List prices with cursor-based pagination.

#### Parameters

##### options?

[`ListPricesOptions`](../interfaces/ListPricesOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Price`\>\>

***

### replace()

> **replace**(`priceId`, `options`): `Promise`\<[`ReplacePriceResult`](../interfaces/ReplacePriceResult.md)\>

Defined in: [core/services/prices.service.ts:341](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L341)

Change a price by replacing it: create a new price on the same product,
then deactivate the old one.

Exactly these are copied from the old price unless you override them:
`currency`, `recurring.interval` and `recurring.interval_count`,
`nickname`, `metadata` and `tax_behavior`. `recurring.trial_period_days`
is always carried over. Its `lookup_key` is moved to the new price. The
returned `price` is the new price's current state (lookup key included),
also on a retry. If the old price was the product's default price, the new
price becomes the default first, since Stripe won't deactivate a default
price. Nothing else is copied.

Only plain per-unit prices in one currency can be replaced. These are
refused with `StripeValidationError` rather than silently simplified:
tiered prices, metered prices (`usage_type: 'metered'` or a `meter`),
customer-chooses-the-amount prices (`custom_unit_amount`), prices with
`transform_quantity`, and prices with extra `currency_options`.

Retry a failed call with the same `idempotencyKey`: each step uses a key
derived from it and sends the same parameters on every attempt, so a
retry finishes the remaining steps without creating a second price.

#### Parameters

##### priceId

`string`

##### options

[`ReplacePriceOptions`](../interfaces/ReplacePriceOptions.md)

#### Returns

`Promise`\<[`ReplacePriceResult`](../interfaces/ReplacePriceResult.md)\>

#### Throws

When `priceId` is missing, `unitAmount` is
not a non-negative integer, or the old price is one of the kinds above

#### Example

```typescript
const { price, previous } = await stripe.prices.replace('price_old', {
  unitAmount: 949,
  idempotencyKey: `reprice-${sku}-${version}`,
});
```

***

### update()

> **update**(`priceId`, `options`): `Promise`\<`Price`\>

Defined in: [core/services/prices.service.ts:275](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/prices.service.ts#L275)

Update a price's mutable fields (active flag, nickname, lookup key,
metadata).

#### Parameters

##### priceId

`string`

##### options

[`UpdatePriceOptions`](../interfaces/UpdatePriceOptions.md)

#### Returns

`Promise`\<`Price`\>

#### Throws

When `priceId` is missing
