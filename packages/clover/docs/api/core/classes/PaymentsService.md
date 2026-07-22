[**@bates-solutions/clover API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/clover API Reference](../../README.md) / [core](../README.md) / PaymentsService

# Class: PaymentsService

Defined in: core/services/payments.service.ts:49

Payments service wrapping Clover's Ecommerce
[charges](https://docs.clover.com/dev/docs/create-a-charge) (`/v1/charges`).
Amounts are in cents; the `source` is a Clover card token (`clv_…`).

## Example

```typescript
const charge = await clover.payments.create({
  amount: 1000, // $10.00
  currency: 'usd',
  source: 'clv_1TSTStok...',
});
```

## Constructors

### Constructor

> **new PaymentsService**(`http`): `PaymentsService`

Defined in: core/services/payments.service.ts:50

#### Parameters

##### http

[`CloverHttp`](CloverHttp.md)

#### Returns

`PaymentsService`

## Methods

### capture()

> **capture**(`chargeId`, `options?`): `Promise`\<[`Charge`](../interfaces/Charge.md)\>

Defined in: core/services/payments.service.ts:104

Capture a charge that was created with `capture: false`.

#### Parameters

##### chargeId

`string`

##### options?

[`CaptureChargeOptions`](../interfaces/CaptureChargeOptions.md)

#### Returns

`Promise`\<[`Charge`](../interfaces/Charge.md)\>

***

### create()

> **create**(`options`): `Promise`\<[`Charge`](../interfaces/Charge.md)\>

Defined in: core/services/payments.service.ts:58

Create a charge.

#### Parameters

##### options

[`CreateChargeOptions`](../interfaces/CreateChargeOptions.md)

#### Returns

`Promise`\<[`Charge`](../interfaces/Charge.md)\>

#### Throws

When input validation fails

#### Throws

When the card is declined

***

### get()

> **get**(`chargeId`): `Promise`\<[`Charge`](../interfaces/Charge.md)\>

Defined in: core/services/payments.service.ts:89

Retrieve a charge by ID.

#### Parameters

##### chargeId

`string`

#### Returns

`Promise`\<[`Charge`](../interfaces/Charge.md)\>
