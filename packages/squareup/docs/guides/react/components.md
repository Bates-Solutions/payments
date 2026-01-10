# React Components

This guide covers the pre-built React components in `@bates-solutions/squareup`.

## Prerequisites

- [React Setup](./setup.md) complete with `SquareProvider` configured

## Available Components

| Component | Purpose |
|-----------|---------|
| `CardInput` | Credit card input field |
| `PaymentButton` | Google Pay / Apple Pay buttons |

## CardInput

A pre-built card input component that handles card tokenization.

### Basic Usage

```tsx
import { useRef } from 'react';
import { CardInput, CardInputHandle } from '@bates-solutions/squareup/react';

function Checkout() {
  const cardRef = useRef<CardInputHandle>(null);

  const handlePay = async () => {
    if (!cardRef.current?.ready) return;

    try {
      const token = await cardRef.current.tokenize();
      console.log('Token:', token);

      // Send token to your server
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: token, amount: 1000 }),
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      <CardInput
        ref={cardRef}
        onReady={() => console.log('Card ready')}
        onError={(err) => console.error('Error:', err)}
      />
      <button
        onClick={handlePay}
        disabled={!cardRef.current?.ready}
      >
        Pay $10.00
      </button>
    </div>
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `cardOptions` | `CardOptions` | Styling options for the card input |
| `className` | `string` | CSS class for the container |
| `style` | `CSSProperties` | Inline styles for the container |
| `onReady` | `() => void` | Called when card input is ready |
| `onError` | `(error: Error) => void` | Called on errors |

### Imperative Handle

Access the component through a ref:

```tsx
interface CardInputHandle {
  tokenize: () => Promise<string>;  // Get payment token
  ready: boolean;                    // Is card input ready
  loading: boolean;                  // Is tokenization in progress
  error: Error | null;              // Current error
}
```

### Styling the Card Input

```tsx
<CardInput
  cardOptions={{
    style: {
      input: {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        color: '#1a1a1a',
      },
      '.input-container': {
        borderColor: '#e0e0e0',
        borderRadius: '8px',
        borderWidth: '1px',
      },
      '.input-container.is-focus': {
        borderColor: '#0066ff',
      },
      '.input-container.is-error': {
        borderColor: '#dc3545',
      },
      '.message-text': {
        color: '#666666',
      },
      '.message-text.is-error': {
        color: '#dc3545',
      },
      'input::placeholder': {
        color: '#999999',
      },
    },
  }}
  style={{
    minHeight: '50px',
    marginBottom: '16px',
  }}
/>
```

### Card Input with Form

```tsx
import { useRef, useState } from 'react';
import { CardInput, CardInputHandle, usePayments } from '@bates-solutions/squareup/react';

function CheckoutForm() {
  const cardRef = useRef<CardInputHandle>(null);
  const [cardReady, setCardReady] = useState(false);
  const [email, setEmail] = useState('');

  const { create: createPayment, loading, error } = usePayments({
    onSuccess: (payment) => {
      console.log('Payment successful:', payment.id);
      // Redirect to confirmation
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardRef.current?.ready) {
      alert('Card input not ready');
      return;
    }

    try {
      const token = await cardRef.current.tokenize();
      await createPayment({
        sourceId: token,
        amount: 2500,
        currency: 'USD',
      });
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Card Details</label>
        <CardInput
          ref={cardRef}
          onReady={() => setCardReady(true)}
          onError={(err) => console.error('Card error:', err)}
          className="card-input"
        />
      </div>

      <button
        type="submit"
        disabled={!cardReady || loading}
      >
        {loading ? 'Processing...' : 'Pay $25.00'}
      </button>

      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

## PaymentButton

Digital wallet buttons for Google Pay and Apple Pay.

### Basic Usage

```tsx
import { PaymentButton } from '@bates-solutions/squareup/react';

function Checkout() {
  const handlePayment = async (token: string) => {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: token, amount: 1000 }),
    });

    if (response.ok) {
      console.log('Payment successful!');
    }
  };

  return (
    <div>
      <PaymentButton
        type="googlePay"
        amount={1000}
        currency="USD"
        onPayment={handlePayment}
        onError={(err) => console.error('Error:', err)}
      />

      <PaymentButton
        type="applePay"
        amount={1000}
        currency="USD"
        onPayment={handlePayment}
        onError={(err) => console.error('Error:', err)}
      />
    </div>
  );
}
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `type` | `'googlePay' \| 'applePay'` | Payment method type |
| `amount` | `number` | Amount in cents (for display) |
| `currency` | `string` | Currency code |
| `buttonOptions` | `DigitalWalletOptions` | Button styling |
| `className` | `string` | CSS class for container |
| `style` | `CSSProperties` | Inline styles |
| `onReady` | `() => void` | Called when button is ready |
| `onPayment` | `(token: string) => void` | Called with payment token |
| `onError` | `(error: Error) => void` | Called on errors |
| `onCancel` | `() => void` | Called when user cancels |

### Button Styling

```tsx
<PaymentButton
  type="googlePay"
  buttonOptions={{
    buttonColor: 'black',     // 'default' | 'black' | 'white'
    buttonSizeMode: 'fill',   // 'fill' | 'static'
    buttonType: 'long',       // 'long' | 'short'
  }}
  style={{
    minWidth: '200px',
    height: '48px',
  }}
  onPayment={handlePayment}
/>
```

### Showing Both Options

```tsx
function PaymentOptions({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (token: string, method: string) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token,
          amount,
          note: `Paid via ${method}`,
        }),
      });

      if (!response.ok) throw new Error('Payment failed');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-options">
      <PaymentButton
        type="googlePay"
        amount={amount}
        buttonOptions={{ buttonColor: 'black', buttonType: 'long' }}
        onPayment={(token) => handlePayment(token, 'Google Pay')}
        onError={(err) => setError(err.message)}
        style={{ marginBottom: '12px' }}
      />

      <PaymentButton
        type="applePay"
        amount={amount}
        buttonOptions={{ buttonColor: 'black', buttonType: 'long' }}
        onPayment={(token) => handlePayment(token, 'Apple Pay')}
        onError={(err) => setError(err.message)}
      />

      {error && <p className="error">{error}</p>}
      {processing && <p>Processing...</p>}
    </div>
  );
}
```

## Complete Checkout with All Payment Methods

```tsx
import { useRef, useState } from 'react';
import {
  CardInput,
  CardInputHandle,
  PaymentButton,
  usePayments,
} from '@bates-solutions/squareup/react';

interface CheckoutProps {
  amount: number;
  onComplete: (paymentId: string) => void;
}

function Checkout({ amount, onComplete }: CheckoutProps) {
  const cardRef = useRef<CardInputHandle>(null);
  const [cardReady, setCardReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital'>('card');

  const { create: createPayment, loading, error, reset } = usePayments({
    onSuccess: (payment) => onComplete(payment.id),
  });

  const handleCardPayment = async () => {
    if (!cardRef.current?.ready) return;

    const token = await cardRef.current.tokenize();
    await createPayment({ sourceId: token, amount });
  };

  const handleDigitalPayment = async (token: string) => {
    await createPayment({ sourceId: token, amount });
  };

  return (
    <div className="checkout">
      <h2>Pay ${(amount / 100).toFixed(2)}</h2>

      {/* Payment Method Tabs */}
      <div className="tabs">
        <button
          className={paymentMethod === 'card' ? 'active' : ''}
          onClick={() => { setPaymentMethod('card'); reset(); }}
        >
          Credit Card
        </button>
        <button
          className={paymentMethod === 'digital' ? 'active' : ''}
          onClick={() => { setPaymentMethod('digital'); reset(); }}
        >
          Digital Wallet
        </button>
      </div>

      {/* Card Payment */}
      {paymentMethod === 'card' && (
        <div className="card-payment">
          <CardInput
            ref={cardRef}
            onReady={() => setCardReady(true)}
            onError={(err) => console.error(err)}
          />
          <button
            onClick={handleCardPayment}
            disabled={!cardReady || loading}
          >
            {loading ? 'Processing...' : `Pay ${(amount / 100).toFixed(2)}`}
          </button>
        </div>
      )}

      {/* Digital Wallet */}
      {paymentMethod === 'digital' && (
        <div className="digital-payment">
          <PaymentButton
            type="googlePay"
            amount={amount}
            onPayment={handleDigitalPayment}
            onError={(err) => console.error(err)}
            buttonOptions={{ buttonColor: 'black', buttonType: 'long' }}
          />
          <div style={{ height: '12px' }} />
          <PaymentButton
            type="applePay"
            amount={amount}
            onPayment={handleDigitalPayment}
            onError={(err) => console.error(err)}
            buttonOptions={{ buttonColor: 'black', buttonType: 'long' }}
          />
        </div>
      )}

      {error && <p className="error">{error.message}</p>}
    </div>
  );
}
```

## Component vs Hook

| Use | When to Use |
|-----|-------------|
| `CardInput` component | Standard card forms, less customization needed |
| `useSquarePayment` hook | Custom layouts, complex forms, full control |
| `PaymentButton` component | Adding Google Pay / Apple Pay |

The components use the hooks internally, so you get the same functionality with less boilerplate.

## TypeScript Types

```tsx
import type {
  CardInputProps,
  CardInputHandle,
  PaymentButtonProps,
  PaymentMethodType,
  CardOptions,
  CardStyle,
  DigitalWalletOptions,
} from '@bates-solutions/squareup/react';
```

## Accessibility

Both components include accessibility attributes:
- Proper `role` attributes
- `aria-disabled` states
- `aria-label` descriptions
- Keyboard navigation support (`tabIndex`)

## Next Steps

- [Hooks Guide](./hooks.md) - More control with hooks
- [Payments Guide](../core/payments.md) - Backend payment processing
- [Webhooks Guide](../server/webhooks.md) - Handle payment events
