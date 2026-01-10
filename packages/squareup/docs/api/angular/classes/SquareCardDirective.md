[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareCardDirective

# Class: SquareCardDirective

Defined in: [src/angular/directives/square-card.directive.ts:52](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L52)

Directive for attaching Square card input to an element

## Example

```html
<div
  squareCard
  [cardOptions]="{ style: { input: { fontSize: '16px' } } }"
  (cardReady)="onCardReady()"
  (cardError)="onCardError($event)"
></div>

<button (click)="pay()" [disabled]="!cardReady">Pay</button>
```

```typescript
@Component({...})
export class CheckoutComponent {
  cardReady = false;

  constructor(private payments: SquarePaymentsService) {}

  onCardReady() {
    this.cardReady = true;
  }

  pay() {
    this.payments.tokenize().subscribe(token => {
      console.log('Token:', token);
    });
  }
}
```

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new SquareCardDirective**(`elementRef`, `payments`): `SquareCardDirective`

Defined in: [src/angular/directives/square-card.directive.ts:64](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L64)

#### Parameters

##### elementRef

`ElementRef`\<`HTMLElement`\>

##### payments

[`SquarePaymentsService`](SquarePaymentsService.md)

#### Returns

`SquareCardDirective`

## Properties

### cardError

> **cardError**: `EventEmitter`\<`Error`\>

Defined in: [src/angular/directives/square-card.directive.ts:60](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L60)

Emits when an error occurs

***

### cardOptions?

> `optional` **cardOptions**: [`CardOptions`](../interfaces/CardOptions.md)

Defined in: [src/angular/directives/square-card.directive.ts:54](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L54)

Card styling options

***

### cardReady

> **cardReady**: `EventEmitter`\<`void`\>

Defined in: [src/angular/directives/square-card.directive.ts:57](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L57)

Emits when card input is ready

## Methods

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/angular/directives/square-card.directive.ts:82](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L82)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/angular/directives/square-card.directive.ts:69](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/directives/square-card.directive.ts#L69)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`
