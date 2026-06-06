# Configuration

## Environment Variables

```bash
# Required
SQUARE_ACCESS_TOKEN=your_access_token

# Webhooks (server module)
SQUARE_WEBHOOK_KEY=your_webhook_signature_key
```

## Client Configuration

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  // Required: Your Square API access token
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,

  // Optional: API environment (default: 'sandbox')
  environment: 'sandbox', // or 'production'

  // Optional: default location ID for operations that require one
  locationId: 'LXXX',

  // Optional: default currency code (default: 'USD')
  defaultCurrency: 'USD',
});
```

| Option            | Type                        | Required | Default     | Description |
|-------------------|-----------------------------|----------|-------------|-------------|
| `accessToken`     | `string`                    | Yes      | -           | Square API access token |
| `environment`     | `'sandbox' \| 'production'` | No       | `'sandbox'` | API environment |
| `locationId`      | `string`                    | No       | -           | Default location ID for operations that require one |
| `defaultCurrency` | `string`                    | No       | `'USD'`     | Default currency code |

## Getting Credentials

### Access Token

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select an application
3. Navigate to Credentials
4. Copy your Sandbox or Production access token

### Location ID

1. In the Developer Dashboard, select your application
2. Navigate to Locations
3. Copy the Location ID for the location you want to process payments

### Webhook Signature Key

1. In the Developer Dashboard, select your application
2. Navigate to Webhooks
3. Add a webhook subscription
4. Copy the Signature Key for verification (used by `@bates-solutions/squareup/server`)

## Environments

| Environment | API URL | Use Case |
|-------------|---------|----------|
| `sandbox` | `connect.squareupsandbox.com` | Development and testing |
| `production` | `connect.squareup.com` | Live transactions |

**Important:** Always use sandbox for development. Sandbox credentials will not work with production and vice versa.
