# Configuration

## Environment Variables

```bash
# Backend (required)
SQUARE_ACCESS_TOKEN=your_access_token

# Frontend (React/Angular)
NEXT_PUBLIC_SQUARE_APP_ID=sq0idp-xxx
NEXT_PUBLIC_SQUARE_LOCATION_ID=LXXX

# Webhooks
SQUARE_WEBHOOK_KEY=your_webhook_signature_key
```

## Core Client Configuration

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const square = createSquareClient({
  // Required: Your Square API access token
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,

  // Optional: API environment (default: 'sandbox')
  environment: 'sandbox', // or 'production'
});
```

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `accessToken` | `string` | Yes | - | Square API access token |
| `environment` | `'sandbox' \| 'production'` | No | `'sandbox'` | API environment |

## React Configuration

```tsx
import { SquareProvider } from '@bates-solutions/squareup/react';

<SquareProvider
  applicationId="sq0idp-xxx"
  locationId="LXXX"
  environment="sandbox"
  currency="USD"
>
  {children}
</SquareProvider>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `applicationId` | `string` | Yes | - | Web Payments SDK application ID |
| `locationId` | `string` | Yes | - | Square location ID |
| `environment` | `'sandbox' \| 'production'` | No | `'sandbox'` | SDK environment |
| `currency` | `string` | No | `'USD'` | Default currency code |

## Angular Configuration

```typescript
import { SquareModule } from '@bates-solutions/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      applicationId: 'sq0idp-xxx',
      locationId: 'LXXX',
      environment: 'sandbox',
      currency: 'USD',
    })
  ]
})
export class AppModule {}
```

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `applicationId` | `string` | Yes | - | Web Payments SDK application ID |
| `locationId` | `string` | Yes | - | Square location ID |
| `environment` | `'sandbox' \| 'production'` | No | `'sandbox'` | SDK environment |
| `currency` | `string` | No | `'USD'` | Default currency code |

## Getting Credentials

### Access Token

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select an application
3. Navigate to Credentials
4. Copy your Sandbox or Production access token

### Application ID

1. In the Developer Dashboard, select your application
2. Navigate to Credentials
3. Copy the Application ID (starts with `sq0idp-`)

### Location ID

1. In the Developer Dashboard, select your application
2. Navigate to Locations
3. Copy the Location ID for the location you want to process payments

### Webhook Signature Key

1. In the Developer Dashboard, select your application
2. Navigate to Webhooks
3. Add a webhook subscription
4. Copy the Signature Key for verification

## Environments

| Environment | API URL | Use Case |
|-------------|---------|----------|
| `sandbox` | `connect.squareupsandbox.com` | Development and testing |
| `production` | `connect.squareup.com` | Live transactions |

**Important:** Always use sandbox for development. Sandbox credentials will not work with production and vice versa.
