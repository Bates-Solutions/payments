[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareSdkService

# Class: SquareSdkService

Defined in: [src/angular/services/square-sdk.service.ts:36](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L36)

Service for loading and managing the Square Web Payments SDK

## Example

```typescript
@Component({...})
export class CheckoutComponent {
  constructor(private squareSdk: SquareSdkService) {}

  ngOnInit() {
    this.squareSdk.payments$.subscribe(payments => {
      console.log('SDK ready:', payments);
    });
  }
}
```

## Constructors

### Constructor

> **new SquareSdkService**(`config`, `ngZone`): `SquareSdkService`

Defined in: [src/angular/services/square-sdk.service.ts:56](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L56)

#### Parameters

##### config

[`SquareConfig`](../interfaces/SquareConfig.md)

##### ngZone

`NgZone`

#### Returns

`SquareSdkService`

## Properties

### error$

> `readonly` **error$**: `Observable`\<`Error` \| `null`\>

Defined in: [src/angular/services/square-sdk.service.ts:49](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L49)

Observable of any SDK loading errors

***

### loading$

> `readonly` **loading$**: `Observable`\<`boolean`\>

Defined in: [src/angular/services/square-sdk.service.ts:46](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L46)

Observable of SDK loading state

***

### payments$

> `readonly` **payments$**: `Observable`\<[`Payments`](../interfaces/Payments.md) \| `null`\>

Defined in: [src/angular/services/square-sdk.service.ts:43](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L43)

Observable of the Payments instance once SDK is loaded

## Accessors

### isReady

#### Get Signature

> **get** **isReady**(): `boolean`

Defined in: [src/angular/services/square-sdk.service.ts:52](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L52)

Whether the SDK is ready

##### Returns

`boolean`

## Methods

### whenReady()

> **whenReady**(): `Observable`\<[`Payments`](../interfaces/Payments.md)\>

Defined in: [src/angular/services/square-sdk.service.ts:66](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/services/square-sdk.service.ts#L66)

Get a promise that resolves when the SDK is ready

#### Returns

`Observable`\<[`Payments`](../interfaces/Payments.md)\>
