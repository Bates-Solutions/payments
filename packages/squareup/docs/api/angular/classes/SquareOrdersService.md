[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareOrdersService

# Class: SquareOrdersService

Defined in: [src/angular/services/square-orders.service.ts:30](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L30)

Service for Square order operations

## Example

```typescript
@Component({...})
export class CheckoutComponent {
  constructor(private orders: SquareOrdersService) {}

  createOrder() {
    this.orders.create({
      lineItems: [
        { name: 'Coffee', quantity: '1', basePriceMoney: { amount: 500 } }
      ]
    }).subscribe(order => {
      console.log('Order created:', order);
    });
  }
}
```

## Constructors

### Constructor

> **new SquareOrdersService**(): `SquareOrdersService`

#### Returns

`SquareOrdersService`

## Properties

### error$

> `readonly` **error$**: `Observable`\<`Error` \| `null`\>

Defined in: [src/angular/services/square-orders.service.ts:38](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L38)

Observable of errors

***

### loading$

> `readonly` **loading$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-orders.service.ts:35](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L35)

Observable of loading state

## Methods

### create()

> **create**\<`T`\>(`request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-orders.service.ts:48](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L48)

Create an order via backend API

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`CreateOrderRequest`](../interfaces/CreateOrderRequest.md)

Order creation request

##### apiEndpoint

`string` = `'/api/orders'`

Backend API endpoint (default: '/api/orders')

#### Returns

`Observable`\<`T`\>

Observable of the order response

***

### pay()

> **pay**\<`T`\>(`orderId`, `paymentIds`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-orders.service.ts:177](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L177)

Pay for an order

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### orderId

`string`

The order ID

##### paymentIds

`string`[]

Payment IDs to apply

##### apiEndpoint

`string` = `'/api/orders'`

Backend API endpoint (default: '/api/orders')

#### Returns

`Observable`\<`T`\>

Observable of the paid order

***

### retrieve()

> **retrieve**\<`T`\>(`orderId`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-orders.service.ts:93](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L93)

Retrieve an order by ID

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### orderId

`string`

The order ID

##### apiEndpoint

`string` = `'/api/orders'`

Backend API endpoint (default: '/api/orders')

#### Returns

`Observable`\<`T`\>

Observable of the order

***

### update()

> **update**\<`T`\>(`orderId`, `request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-orders.service.ts:130](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-orders.service.ts#L130)

Update an order

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### orderId

`string`

The order ID

##### request

`Partial`\<[`CreateOrderRequest`](../interfaces/CreateOrderRequest.md)\>

Order update request

##### apiEndpoint

`string` = `'/api/orders'`

Backend API endpoint (default: '/api/orders')

#### Returns

`Observable`\<`T`\>

Observable of the updated order
