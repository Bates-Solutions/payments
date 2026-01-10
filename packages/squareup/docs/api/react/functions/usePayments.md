[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / usePayments

# Function: usePayments()

> **usePayments**(`options`): [`UsePaymentsReturn`](../interfaces/UsePaymentsReturn.md)

Defined in: [src/react/hooks/usePayments.ts:103](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/usePayments.ts#L103)

Hook for creating payments via your backend API

This hook sends payment requests to your backend, which should then
use the Square Payments API to process the payment.

## Parameters

### options

[`UsePaymentsOptions`](../interfaces/UsePaymentsOptions.md) = `{}`

Hook configuration

## Returns

[`UsePaymentsReturn`](../interfaces/UsePaymentsReturn.md)

Payment creation function and state

## Example

```tsx
function Checkout() {
  const { cardRef, tokenize, ready } = useSquarePayment();
  const { create: createPayment, loading, error } = usePayments({
    onSuccess: (payment) => console.log('Payment successful:', payment.id),
    onError: (err) => console.error('Payment failed:', err),
  });

  const handlePay = async () => {
    const token = await tokenize();
    await createPayment({
      sourceId: token,
      amount: 1000, // $10.00
      currency: 'USD',
    });
  };

  return (
    <div>
      <div ref={cardRef} />
      <button onClick={handlePay} disabled={!ready || loading}>
        Pay $10.00
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```
