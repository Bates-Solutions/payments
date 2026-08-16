[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CheckoutService

# Class: CheckoutService

Defined in: [core/services/checkout.service.ts:388](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/services/checkout.service.ts#L388)

Checkout service for Square Checkout API

## Example

```typescript
const square = createSquareClient({ ... });

// Create a payment link
const link = await square.checkout.paymentLinks.create({
  quickPay: {
    name: 'Auto Detailing',
    priceMoney: { amount: BigInt(5000), currency: 'USD' },
    locationId: 'LXXX',
  },
  checkoutOptions: {
    redirectUrl: 'https://example.com/confirmation',
    askForShippingAddress: true,
  },
  prePopulatedData: {
    buyerEmail: 'customer@example.com',
  },
});

console.log('Checkout URL:', link.url);
```

## Constructors

### Constructor

> **new CheckoutService**(`client`): `CheckoutService`

Defined in: [core/services/checkout.service.ts:391](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/services/checkout.service.ts#L391)

#### Parameters

##### client

`SquareClient`

#### Returns

`CheckoutService`

## Properties

### paymentLinks

> `readonly` **paymentLinks**: `PaymentLinksService`

Defined in: [core/services/checkout.service.ts:389](https://github.com/mbates/squareup/blob/a11d73be94c41c40737dd6a6343798e7b8db84de/src/core/services/checkout.service.ts#L389)
