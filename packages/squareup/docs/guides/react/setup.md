# React Setup

This guide covers setting up `@bates-solutions/squareup` in a React application.

## Prerequisites

- React 18+ application
- Square account with Application ID and Location ID
- npm or yarn package manager

## Installation

```bash
npm install @bates-solutions/squareup
```

## Basic Setup

Wrap your application (or checkout flow) with `SquareProvider`:

```tsx
import { SquareProvider } from '@bates-solutions/squareup/react';

function App() {
  return (
    <SquareProvider
      applicationId="sq0idp-YOUR_APPLICATION_ID"
      locationId="YOUR_LOCATION_ID"
      environment="sandbox"
    >
      <YourApp />
    </SquareProvider>
  );
}
```

## Configuration Options

```tsx
<SquareProvider
  // Required
  applicationId="sq0idp-xxx"     // From Square Developer Dashboard
  locationId="LXXX"              // Your Square location ID

  // Optional
  environment="sandbox"          // 'sandbox' or 'production' (default: 'sandbox')
  currency="USD"                 // Default currency (default: 'USD')
  accessToken="..."              // Only for server-side rendering
>
  {children}
</SquareProvider>
```

## Environment Variables

Store credentials securely:

```env
# .env.local
NEXT_PUBLIC_SQUARE_APP_ID=sq0idp-xxx
NEXT_PUBLIC_SQUARE_LOCATION_ID=LXXX
NEXT_PUBLIC_SQUARE_ENV=sandbox
```

```tsx
<SquareProvider
  applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
  locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
  environment={process.env.NEXT_PUBLIC_SQUARE_ENV as 'sandbox' | 'production'}
>
  {children}
</SquareProvider>
```

## Accessing the Context

Use the `useSquare` hook to access SDK state:

```tsx
import { useSquare } from '@bates-solutions/squareup/react';

function CheckoutStatus() {
  const { sdkLoaded, payments, error, config } = useSquare();

  if (error) {
    return <div>Error loading Square: {error.message}</div>;
  }

  if (!sdkLoaded) {
    return <div>Loading payment system...</div>;
  }

  return <div>Ready to accept payments!</div>;
}
```

### Context Values

| Property | Type | Description |
|----------|------|-------------|
| `sdkLoaded` | `boolean` | Whether the Square SDK has loaded |
| `payments` | `Payments \| null` | Square Payments SDK instance |
| `error` | `Error \| null` | Any loading error |
| `config` | `SquareProviderConfig` | Current configuration |

## Next.js App Router

For Next.js 13+ with App Router, mark the provider as a client component:

```tsx
// app/providers.tsx
'use client';

import { SquareProvider } from '@bates-solutions/squareup/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SquareProvider
      applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
      locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
      environment="sandbox"
    >
      {children}
    </SquareProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Scoped Provider

You can also scope the provider to just the checkout flow:

```tsx
function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/checkout"
          element={
            <SquareProvider
              applicationId="sq0idp-xxx"
              locationId="LXXX"
              environment="sandbox"
            >
              <CheckoutPage />
            </SquareProvider>
          }
        />
      </Routes>
    </div>
  );
}
```

## Error Boundaries

Wrap payment components with error boundaries:

```tsx
import { Component, ReactNode } from 'react';

class PaymentErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
<PaymentErrorBoundary fallback={<div>Payment system unavailable</div>}>
  <SquareProvider {...config}>
    <Checkout />
  </SquareProvider>
</PaymentErrorBoundary>
```

## TypeScript

The library is fully typed. Import types as needed:

```tsx
import type {
  SquareProviderProps,
  SquareProviderConfig,
  SquareContextValue,
} from '@bates-solutions/squareup/react';
```

## Troubleshooting

### SDK Not Loading

1. Check that `applicationId` and `locationId` are correct
2. Verify the environment matches your credentials (sandbox vs production)
3. Check browser console for network errors
4. Ensure no ad blockers are interfering

### useSquare Error: "must be used within a SquareProvider"

Make sure your component is wrapped by `SquareProvider`:

```tsx
// Wrong
function App() {
  return <Checkout />; // No provider!
}

// Correct
function App() {
  return (
    <SquareProvider {...config}>
      <Checkout />
    </SquareProvider>
  );
}
```

### Sandbox vs Production

| Environment | Application ID Prefix | API Base |
|-------------|----------------------|----------|
| Sandbox | `sandbox-sq0idp-` | sandbox.squareup.com |
| Production | `sq0idp-` | connect.squareup.com |

## Next Steps

- [Hooks Guide](./hooks.md) - Learn about payment hooks
- [Components Guide](./components.md) - Pre-built payment components
- [Payments Guide](../core/payments.md) - Backend payment processing
