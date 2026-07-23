# Configuration

## Client options

`createCloverClient(config)` accepts:

| Option        | Type                        | Default     | Description                                                        |
| ------------- | --------------------------- | ----------- | ------------------------------------------------------------------ |
| `apiToken`    | `string`                    | —           | **Required.** OAuth access token or API key.                       |
| `merchantId`  | `string`                    | —           | Required for Platform operations (`customers`); not for charges.   |
| `environment` | `'sandbox' \| 'production'` | `'sandbox'` | Selects the Clover host set.                                       |
| `fetchImpl`   | `typeof fetch`              | global      | Override `fetch` (mainly for tests).                               |

```typescript
const clover = createCloverClient({
  apiToken: process.env.CLOVER_API_TOKEN!,
  merchantId: process.env.CLOVER_MERCHANT_ID,
  environment: 'production',
});
```

## Hosts

The client targets two Clover APIs, chosen automatically per service:

| API       | Sandbox                          | Production            | Used by               |
| --------- | -------------------------------- | --------------------- | --------------------- |
| Ecommerce | `scl-sandbox.dev.clover.com`     | `scl.clover.com`      | `payments`, `refunds` |
| Platform  | `apisandbox.dev.clover.com`      | `api.clover.com`      | `customers`           |

## Environment variables

```bash
CLOVER_API_TOKEN=...
CLOVER_MERCHANT_ID=...
CLOVER_WEBHOOK_SECRET=...
```

## Money & currency

Amounts are integer **cents** (`number`); currency codes are **lowercase** ISO
(e.g. `usd`). Use `toCents` / `fromCents` / `formatMoney` to convert.
