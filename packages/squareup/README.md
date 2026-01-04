<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="React" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Angular-17+-DD0031?logo=angular&logoColor=white&style=for-the-badge" alt="Angular" height="28">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Square-Payments-0066CC?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZDQyIvPgo8cGF0aCBkPSJNOC41IDEySDE1LjVWMTMuNUgxMC41VjE1SDE1LjVWMTYuNUgxMC41VjE4SDE1LjVWMTlIMFYxMkg4LjVWMTJIMFYxMkg4LjVWMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K&style=for-the-badge" alt="Square" height="28">
</p>

<h1 align="center">@bates-solutions/squareup</h1>

<p align="center">
  <strong>The modern TypeScript SDK for Square payments</strong><br>
  Build payment experiences in React and Angular with type-safe APIs, fluent builders, and framework-native integrations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="version 0.1.0">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript"></a>
  <br>
  <img src="https://img.shields.io/badge/tests-329%20passed-brightgreen.svg" alt="Tests">
  <img src="https://img.shields.io/badge/coverage-99.84%25-brightgreen.svg" alt="Coverage">
  <img src="https://img.shields.io/badge/React-110%20tests-blue.svg" alt="React Tests">
  <img src="https://img.shields.io/badge/Angular-133%20tests-red.svg" alt="Angular Tests">
</p>

---

Stop wrestling with Square's low-level APIs. **squareup** gives you React hooks, Angular services, and a fluent builder API that makes payment integration feel native to your framework. Tokenize cards, process payments, manage orders, and handle webhooks—all with full TypeScript support and zero boilerplate.

## Features

- **Simplified APIs** - Less boilerplate, more productivity
- **React Integration** - Hooks and components for payments
- **Angular Integration** - Services with RxJS Observables
- **Server Utilities** - Webhook verification and middleware
- **Type-Safe** - Full TypeScript support with strict types
- **Fluent Builders** - Chainable order and payment construction

## 🧪 Testing & Quality

**329 comprehensive tests** with **99.84% code coverage** ensure reliability and maintainability:

- **React Tests (110)**: Complete coverage of hooks, components, and integrations
- **Angular Tests (133)**: Full service testing with RxJS observables
- **Core Tests (86)**: API clients, builders, and utilities
- **Coverage Breakdown**:
  - Statements: **99.84%**
  - Branches: **95.99%**
  - Functions: **100%**
  - Lines: **99.84%**

Run tests with:

```bash
npm test              # All tests
npm run test:react    # React tests only
npm run test:angular  # Angular tests only
npm run test:coverage # With coverage report
```

## Installation

```bash
npm install @bates-solutions/squareup square
```

### Peer Dependencies

```bash
# For React integration
npm install react

# For Angular integration
npm install @angular/core @angular/common rxjs
```

## 📚 Documentation

- **[Getting Started](./docs/getting-started/)** - Installation and setup guides
- **[Guides](./docs/guides/)** - Framework-specific tutorials and examples
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Configuration](./docs/getting-started/configuration.md)** - Environment setup

## Quick Start

### Backend

```typescript
import { createSquareClient } from '@bates-solutions/squareup';

const client = createSquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'sandbox',
});

const payment = await client.payments.create({
  sourceId: 'cnon:card-nonce',
  amount: 1000, // $10.00
  currency: 'USD',
});
```

### React

```tsx
import { SquareProvider, usePayments } from '@bates-solutions/squareup/react';

function App() {
  return (
    <SquareProvider applicationId="sq0idp-xxx" locationId="LXXX" environment="sandbox">
      <PaymentForm />
    </SquareProvider>
  );
}

function PaymentForm() {
  const { processPayment } = usePayments();

  const handlePayment = async () => {
    const result = await processPayment({
      sourceId: 'cnon:card-nonce',
      amount: 1000, // $10.00
      currency: 'USD',
    });
  };

  return <button onClick={handlePayment}>Pay $10.00</button>;
}
```

### Angular

```typescript
import { SquareModule } from '@bates-solutions/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      accessToken: 'YOUR_ACCESS_TOKEN',
      environment: 'sandbox',
    }),
  ],
})
export class AppModule {}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](./LICENSE) for details.
