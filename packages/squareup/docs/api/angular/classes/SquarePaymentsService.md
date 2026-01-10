[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquarePaymentsService

# Class: SquarePaymentsService

Defined in: [src/angular/services/square-payments.service.ts:45](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L45)

Service for Square payment operations

## Example

```typescript
@Component({...})
export class CheckoutComponent implements OnInit, OnDestroy {
  constructor(private payments: SquarePaymentsService) {}

  ngOnInit() {
    this.payments.attachCard(this.cardContainer.nativeElement).subscribe();
  }

  ngOnDestroy() {
    this.payments.destroyCard();
  }

  pay() {
    this.payments.tokenize().pipe(
      switchMap(token => this.payments.createPayment({
        sourceId: token,
        amount: 1000
      }))
    ).subscribe();
  }
}
```

## Constructors

### Constructor

> **new SquarePaymentsService**(`config`, `sdk`): `SquarePaymentsService`

Defined in: [src/angular/services/square-payments.service.ts:60](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L60)

#### Parameters

##### config

[`SquareConfig`](../interfaces/SquareConfig.md)

##### sdk

[`SquareSdkService`](SquareSdkService.md)

#### Returns

`SquarePaymentsService`

## Properties

### error$

> `readonly` **error$**: `Observable`\<`Error` \| `null`\>

Defined in: [src/angular/services/square-payments.service.ts:55](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L55)

Observable of errors

***

### loading$

> `readonly` **loading$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-payments.service.ts:52](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L52)

Observable of loading state

***

### ready$

> `readonly` **ready$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-payments.service.ts:58](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L58)

Observable of card ready state

## Methods

### attachCard()

> **attachCard**(`element`, `options?`): `Observable`\<`void`\>

Defined in: [src/angular/services/square-payments.service.ts:72](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L72)

Attach a card input to an element

#### Parameters

##### element

`HTMLElement`

The container element for the card input

##### options?

[`CardOptions`](../interfaces/CardOptions.md)

Optional card styling options

#### Returns

`Observable`\<`void`\>

Observable that completes when card is attached

***

### createPayment()

> **createPayment**\<`T`\>(`request`, `apiEndpoint`): `Observable`\<`T`\>

Defined in: [src/angular/services/square-payments.service.ts:153](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L153)

Create a payment via backend API

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### request

[`CreatePaymentRequest`](../interfaces/CreatePaymentRequest.md)

Payment creation request

##### apiEndpoint

`string` = `'/api/payments'`

Backend API endpoint (default: '/api/payments')

#### Returns

`Observable`\<`T`\>

Observable of the payment response

***

### destroyCard()

> **destroyCard**(): `void`

Defined in: [src/angular/services/square-payments.service.ts:100](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L100)

Destroy the current card instance

#### Returns

`void`

***

### tokenize()

> **tokenize**(): `Observable`\<`string`\>

Defined in: [src/angular/services/square-payments.service.ts:113](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-payments.service.ts#L113)

Tokenize the card input

#### Returns

`Observable`\<`string`\>

Observable of the payment token
