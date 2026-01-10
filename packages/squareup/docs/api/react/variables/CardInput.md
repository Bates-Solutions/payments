[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / CardInput

# Variable: CardInput

> `const` **CardInput**: `ForwardRefExoticComponent`\<[`CardInputProps`](../interfaces/CardInputProps.md) & `RefAttributes`\<[`CardInputHandle`](../interfaces/CardInputHandle.md)\>\>

Defined in: [src/react/components/CardInput.tsx:72](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/components/CardInput.tsx#L72)

Pre-built card input component using Square Web Payments SDK

## Example

```tsx
import { CardInput, CardInputHandle } from '@bates-solutions/squareup/react';

function Checkout() {
  const cardRef = useRef<CardInputHandle>(null);

  const handlePay = async () => {
    if (!cardRef.current?.ready) return;

    try {
      const token = await cardRef.current.tokenize();
      // Send token to your server
      console.log('Token:', token);
    } catch (err) {
      console.error('Tokenization failed:', err);
    }
  };

  return (
    <div>
      <CardInput
        ref={cardRef}
        onReady={() => console.log('Card input ready')}
        onError={(err) => console.error('Error:', err)}
      />
      <button onClick={handlePay}>Pay</button>
    </div>
  );
}
```
