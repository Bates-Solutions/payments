[**@bates-solutions/stripe API Reference v1.0.3**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / PaymentLinksService

# Class: PaymentLinksService

Defined in: [core/services/payment-links.service.ts:25](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/payment-links.service.ts#L25)

Payment Links service wrapping Stripe
[Payment Links](https://docs.stripe.com/api/payment-link) (read-only).

A Payment Link's line items are what it offers. What was actually sold
through it is on the Checkout Sessions it created:
`checkout.list({ paymentLinkId, status: 'complete' })`.

## Example

```typescript
const link = await stripe.paymentLinks.get('plink_123');
const offered = await stripe.paymentLinks.listLineItems(link.id);
```

## Constructors

### Constructor

> **new PaymentLinksService**(`client`): `PaymentLinksService`

Defined in: [core/services/payment-links.service.ts:26](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/payment-links.service.ts#L26)

#### Parameters

##### client

`Stripe`

#### Returns

`PaymentLinksService`

## Methods

### get()

> **get**(`paymentLinkId`): `Promise`\<`PaymentLink`\>

Defined in: [core/services/payment-links.service.ts:31](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/payment-links.service.ts#L31)

Retrieve a Payment Link by ID.

#### Parameters

##### paymentLinkId

`string`

#### Returns

`Promise`\<`PaymentLink`\>

***

### listLineItems()

> **listLineItems**(`paymentLinkId`, `options?`): `Promise`\<`LineItem`[]\>

Defined in: [core/services/payment-links.service.ts:44](https://github.com/Bates-Solutions/stripe/blob/f16fab00a2fcf006c7a6c7fcfcb9abd308a81c41/src/core/services/payment-links.service.ts#L44)

List all line items of a Payment Link (every page, fetched for you).

#### Parameters

##### paymentLinkId

`string`

##### options?

[`ListLineItemsOptions`](../interfaces/ListLineItemsOptions.md)

#### Returns

`Promise`\<`LineItem`[]\>

#### Throws

When `paymentLinkId` is missing
