[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / PaymentButtonComponent

# Class: PaymentButtonComponent

Defined in: [src/angular/components/payment-button.component.ts:53](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L53)

Payment button component for Google Pay / Apple Pay

## Example

```html
<square-payment-button
  type="googlePay"
  (payment)="onPayment($event)"
  (error)="onError($event)"
></square-payment-button>

<square-payment-button
  type="applePay"
  [buttonOptions]="{ buttonColor: 'black' }"
  (payment)="onPayment($event)"
></square-payment-button>
```

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new PaymentButtonComponent**(`sdk`, `cdr`): `PaymentButtonComponent`

Defined in: [src/angular/components/payment-button.component.ts:81](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L81)

#### Parameters

##### sdk

[`SquareSdkService`](SquareSdkService.md)

##### cdr

`ChangeDetectorRef`

#### Returns

`PaymentButtonComponent`

## Properties

### buttonOptions?

> `optional` **buttonOptions**: [`DigitalWalletOptions`](../interfaces/DigitalWalletOptions.md)

Defined in: [src/angular/components/payment-button.component.ts:58](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L58)

Button styling options

***

### buttonReady

> **buttonReady**: `EventEmitter`\<`void`\>

Defined in: [src/angular/components/payment-button.component.ts:61](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L61)

Emits when button is ready

***

### cancel

> **cancel**: `EventEmitter`\<`void`\>

Defined in: [src/angular/components/payment-button.component.ts:70](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L70)

Emits when payment is cancelled

***

### error

> **error**: `EventEmitter`\<`Error`\>

Defined in: [src/angular/components/payment-button.component.ts:67](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L67)

Emits when an error occurs

***

### loading

> **loading**: `boolean` = `false`

Defined in: [src/angular/components/payment-button.component.ts:79](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L79)

***

### payment

> **payment**: `EventEmitter`\<`string`\>

Defined in: [src/angular/components/payment-button.component.ts:64](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L64)

Emits payment token on success

***

### ready

> **ready**: `boolean` = `false`

Defined in: [src/angular/components/payment-button.component.ts:78](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L78)

***

### type

> **type**: `"googlePay"` \| `"applePay"` = `'googlePay'`

Defined in: [src/angular/components/payment-button.component.ts:55](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L55)

Payment method type

## Methods

### handleClick()

> **handleClick**(): `void`

Defined in: [src/angular/components/payment-button.component.ts:105](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L105)

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/angular/components/payment-button.component.ts:97](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L97)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/angular/components/payment-button.component.ts:86](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/components/payment-button.component.ts#L86)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`
