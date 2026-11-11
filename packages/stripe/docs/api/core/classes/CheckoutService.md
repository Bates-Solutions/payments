[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / CheckoutService

# Class: CheckoutService

Defined in: [core/services/checkout.service.ts:107](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L107)

Checkout service wrapping Stripe [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions).

## Example

```typescript
const session = await stripe.checkout.create({
  mode: 'subscription',
  customerId: 'cus_123',
  lineItems: [{ price: 'price_123', quantity: 1 }],
  successUrl: 'https://app.example.com/billing?success=true',
  cancelUrl: 'https://app.example.com/billing?canceled=true',
});

redirect(session.url);
```

## Constructors

### Constructor

> **new CheckoutService**(`client`): `CheckoutService`

Defined in: [core/services/checkout.service.ts:108](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L108)

#### Parameters

##### client

`Stripe`

#### Returns

`CheckoutService`

## Methods

### create()

> **create**(`options`): `Promise`\<`Session`\>

Defined in: [core/services/checkout.service.ts:118](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L118)

Create a Checkout Session.

#### Parameters

##### options

[`CreateCheckoutSessionOptions`](../interfaces/CreateCheckoutSessionOptions.md)

Session creation options

#### Returns

`Promise`\<`Session`\>

The created session (use `session.url` to redirect the customer)

#### Throws

When required fields are missing

***

### expire()

> **expire**(`sessionId`): `Promise`\<`Session`\>

Defined in: [core/services/checkout.service.ts:169](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L169)

Expire an open Checkout Session so it can no longer be completed.

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Session`\>

***

### get()

> **get**(`sessionId`): `Promise`\<`Session`\>

Defined in: [core/services/checkout.service.ts:158](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L158)

Retrieve a Checkout Session by ID.

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Session`\>

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Session`\>\>

Defined in: [core/services/checkout.service.ts:220](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L220)

List Checkout Sessions with cursor-based pagination.

#### Parameters

##### options?

[`ListCheckoutSessionsOptions`](../interfaces/ListCheckoutSessionsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`Session`\>\>

#### Example

```typescript
// Completed sales in March, with their (first page of) line items
const { data } = await stripe.checkout.list({
  status: 'complete',
  created: { gte: new Date('2026-03-01'), lt: new Date('2026-04-01') },
  expandLineItems: true,
});
```

***

### listLineItems()

> **listLineItems**(`sessionId`, `options?`): `Promise`\<`LineItem`[]\>

Defined in: [core/services/checkout.service.ts:190](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/checkout.service.ts#L190)

List all line items of a Checkout Session (every page, fetched for you).

#### Parameters

##### sessionId

`string`

##### options?

[`ListLineItemsOptions`](../interfaces/ListLineItemsOptions.md)

#### Returns

`Promise`\<`LineItem`[]\>

#### Throws

When `sessionId` is missing

#### Example

```typescript
const items = await stripe.checkout.listLineItems('cs_123', { expandProduct: true });
for (const item of items) {
  console.log(item.price?.product, item.quantity, item.amount_total);
}
```
