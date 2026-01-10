[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / PaymentButtonProps

# Interface: PaymentButtonProps

Defined in: [src/react/components/PaymentButton.tsx:13](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L13)

Props for PaymentButton component

## Properties

### amount?

> `optional` **amount**: `number`

Defined in: [src/react/components/PaymentButton.tsx:17](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L17)

Amount to display/charge (for display purposes)

***

### buttonOptions?

> `optional` **buttonOptions**: [`DigitalWalletOptions`](DigitalWalletOptions.md)

Defined in: [src/react/components/PaymentButton.tsx:21](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L21)

Button styling options

***

### className?

> `optional` **className**: `string`

Defined in: [src/react/components/PaymentButton.tsx:23](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L23)

Additional CSS class name

***

### currency?

> `optional` **currency**: `string`

Defined in: [src/react/components/PaymentButton.tsx:19](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L19)

Currency code

***

### onCancel()?

> `optional` **onCancel**: () => `void`

Defined in: [src/react/components/PaymentButton.tsx:33](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L33)

Callback when payment is cancelled

#### Returns

`void`

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/react/components/PaymentButton.tsx:31](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L31)

Callback when an error occurs

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onPayment()?

> `optional` **onPayment**: (`token`) => `void`

Defined in: [src/react/components/PaymentButton.tsx:29](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L29)

Callback when payment is successful

#### Parameters

##### token

`string`

#### Returns

`void`

***

### onReady()?

> `optional` **onReady**: () => `void`

Defined in: [src/react/components/PaymentButton.tsx:27](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L27)

Callback when payment method is ready

#### Returns

`void`

***

### style?

> `optional` **style**: `CSSProperties`

Defined in: [src/react/components/PaymentButton.tsx:25](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L25)

Inline styles for the container

***

### type

> **type**: [`PaymentMethodType`](../type-aliases/PaymentMethodType.md)

Defined in: [src/react/components/PaymentButton.tsx:15](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/PaymentButton.tsx#L15)

Payment method type
