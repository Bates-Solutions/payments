[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / SquareProvider

# Function: SquareProvider()

> **SquareProvider**(`__namedParameters`): `Element`

Defined in: [src/react/SquareProvider.tsx:71](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/SquareProvider.tsx#L71)

Square Provider component that initializes the Web Payments SDK

## Parameters

### \_\_namedParameters

[`SquareProviderProps`](../interfaces/SquareProviderProps.md)

## Returns

`Element`

## Example

```tsx
import { SquareProvider } from '@bates-solutions/squareup/react';

function App() {
  return (
    <SquareProvider
      applicationId="sq0idp-xxx"
      locationId="LXXX"
      environment="sandbox"
    >
      <Checkout />
    </SquareProvider>
  );
}
```
