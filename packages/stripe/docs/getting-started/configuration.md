# Configuration

## Client options

`createStripeClient(config)` accepts:

| Option              | Type      | Default | Description                                                        |
| ------------------- | --------- | ------- | ------------------------------------------------------------------ |
| `apiKey`            | `string`  | —       | **Required.** Your Stripe secret key (`sk_test_…` / `sk_live_…`).  |
| `apiVersion`        | `string`  | account | Pin a specific Stripe API version. Omit to use your account's.     |
| `maxNetworkRetries` | `number`  | `1`     | How many times the Stripe SDK retries failed requests.             |
| `stripeAccount`     | `string`  | none    | Act as this connected account (`acct_…`) on every call.            |
| `connectClientId`   | `string`  | none    | Connect client ID (`ca_…`), the default for `oauth.deauthorize`.   |

```typescript
import { createStripeClient } from '@bates-solutions/stripe';

const stripe = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  apiVersion: '2025-01-27.acacia',
  maxNetworkRetries: 2,
});
```

## Environment

There is no separate sandbox host — the mode is determined by your key. The
`environment` getter reflects this:

```typescript
stripe.environment; // 'test' for sk_test_…, 'live' for sk_live_…
```

## Connected accounts

`stripe.forAccount('acct_…')` returns a client scoped to a connected account
(every call sends the `Stripe-Account` header). See the
[Connected Accounts guide](../guides/core/connect.md).

## Accessing the raw SDK

Anything not covered by the wrapper is reachable through `client.sdk`, the
underlying `Stripe` instance:

```typescript
const balance = await stripe.sdk.balance.retrieve();
```

## Environment variables

Recommended variables for a typical backend:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
