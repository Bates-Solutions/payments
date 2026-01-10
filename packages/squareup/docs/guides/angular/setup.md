# Angular Setup

This guide covers setting up `@bates-solutions/squareup` in an Angular application.

## Prerequisites

- Angular 15+ application
- Square account with Application ID and Location ID
- npm or yarn package manager

## Installation

```bash
npm install @bates-solutions/squareup
```

## Module Configuration

Import and configure `SquareModule` in your root module:

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SquareModule } from '@bates-solutions/squareup/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SquareModule.forRoot({
      applicationId: 'sq0idp-YOUR_APPLICATION_ID',
      locationId: 'YOUR_LOCATION_ID',
      environment: 'sandbox',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Configuration Options

```typescript
SquareModule.forRoot({
  // Required
  applicationId: 'sq0idp-xxx',     // From Square Developer Dashboard
  locationId: 'LXXX',              // Your Square location ID

  // Optional
  environment: 'sandbox',          // 'sandbox' or 'production' (default: 'sandbox')
  currency: 'USD',                 // Default currency (default: 'USD')
  accessToken: '...',              // Only for server-side rendering
});
```

## Environment Configuration

Use Angular's environment files for credentials:

```typescript
// environments/environment.ts (development)
export const environment = {
  production: false,
  square: {
    applicationId: 'sandbox-sq0idp-xxx',
    locationId: 'LXXX',
    environment: 'sandbox' as const,
  },
};

// environments/environment.prod.ts (production)
export const environment = {
  production: true,
  square: {
    applicationId: 'sq0idp-xxx',
    locationId: 'LYYY',
    environment: 'production' as const,
  },
};
```

```typescript
// app.module.ts
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    SquareModule.forRoot(environment.square),
  ],
})
export class AppModule {}
```

## Standalone Components (Angular 14+)

For standalone components, import the module in the component:

```typescript
// checkout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareModule } from '@bates-solutions/squareup/angular';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, SquareModule],
  template: `...`,
})
export class CheckoutComponent {}
```

For standalone apps, configure in `main.ts`:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { SquareModule } from '@bates-solutions/squareup/angular';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(SquareModule.forRoot(environment.square)),
  ],
});
```

## Lazy Loading

For lazy-loaded modules, only import `SquareModule.forRoot()` once in your app module. Services are provided at the root level automatically.

```typescript
// feature/checkout/checkout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Don't call forRoot() here!
import { SquareModule } from '@bates-solutions/squareup/angular';

import { CheckoutComponent } from './checkout.component';

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    // Services are available without forRoot() in lazy modules
  ],
})
export class CheckoutModule {}
```

## Accessing the SDK Service

Inject `SquareSdkService` to access SDK state:

```typescript
import { Component, OnInit } from '@angular/core';
import { SquareSdkService } from '@bates-solutions/squareup/angular';

@Component({
  selector: 'app-checkout-status',
  template: `
    <div *ngIf="loading$ | async">Loading Square SDK...</div>
    <div *ngIf="error$ | async as error">Error: {{ error.message }}</div>
    <div *ngIf="isReady">Ready to accept payments!</div>
  `,
})
export class CheckoutStatusComponent implements OnInit {
  loading$ = this.sdk.loading$;
  error$ = this.sdk.error$;

  get isReady(): boolean {
    return this.sdk.isReady;
  }

  constructor(private sdk: SquareSdkService) {}

  ngOnInit() {
    this.sdk.payments$.subscribe((payments) => {
      if (payments) {
        console.log('SDK initialized');
      }
    });
  }
}
```

### SDK Service Properties

| Property | Type | Description |
|----------|------|-------------|
| `payments$` | `Observable<Payments \| null>` | Square Payments instance |
| `loading$` | `Observable<boolean>` | SDK loading state |
| `error$` | `Observable<Error \| null>` | Loading errors |
| `isReady` | `boolean` | Whether SDK is ready |

### Methods

```typescript
// Wait for SDK to be ready
this.sdk.whenReady().subscribe((payments) => {
  // SDK is ready, payments is guaranteed non-null
  console.log('Ready:', payments);
});
```

## Configuration Injection

You can inject the configuration directly:

```typescript
import { Component, Inject } from '@angular/core';
import { SQUARE_CONFIG } from '@bates-solutions/squareup/angular';
import type { SquareConfig } from '@bates-solutions/squareup/angular';

@Component({...})
export class ConfigComponent {
  constructor(@Inject(SQUARE_CONFIG) private config: SquareConfig) {
    console.log('Location:', this.config.locationId);
    console.log('Environment:', this.config.environment);
  }
}
```

## TypeScript Types

Import types as needed:

```typescript
import type {
  SquareConfig,
  Payments,
  Card,
  CardOptions,
  TokenResult,
  CreatePaymentRequest,
  CreateOrderRequest,
  CreateCustomerRequest,
} from '@bates-solutions/squareup/angular';
```

## Troubleshooting

### SquareModule is already loaded

This error occurs when `SquareModule.forRoot()` is called multiple times:

```typescript
// Wrong - calling forRoot() in feature module
@NgModule({
  imports: [SquareModule.forRoot({...})], // Don't do this!
})
export class FeatureModule {}

// Correct - only call forRoot() in AppModule
@NgModule({
  imports: [SquareModule.forRoot({...})],
})
export class AppModule {}
```

### SDK Not Loading

1. Check that `applicationId` and `locationId` are correct
2. Verify the environment matches your credentials
3. Check browser console for network errors
4. Ensure no ad blockers are interfering

### Services Not Injected

Ensure `SquareModule.forRoot()` is imported in your root module:

```typescript
@NgModule({
  imports: [
    SquareModule.forRoot({...}), // Required!
  ],
})
export class AppModule {}
```

### Zone.js Issues

The SDK service uses NgZone to ensure Angular change detection works properly. If you see issues with async operations not triggering change detection, the service handles this automatically.

## Next Steps

- [Services Guide](./services.md) - Payment, order, and customer services
- [Payments Guide](../core/payments.md) - Backend payment processing
- [Webhooks Guide](../server/webhooks.md) - Handle payment events
