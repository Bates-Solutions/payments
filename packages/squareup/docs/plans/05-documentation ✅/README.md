# Documentation Strategy

## Documentation Structure

```
docs/
├── README.md                 # Main documentation hub
├── getting-started/
│   ├── installation.md       # npm install, peer deps
│   ├── quick-start.md        # 5-minute guide
│   └── configuration.md      # Environment, credentials
├── guides/
│   ├── core/
│   │   ├── payments.md       # Payment processing guide
│   │   ├── orders.md         # Order management
│   │   ├── customers.md      # Customer operations
│   │   └── catalog.md        # Product catalog
│   ├── react/
│   │   ├── setup.md          # SquareProvider configuration
│   │   ├── hooks.md          # All hooks reference
│   │   └── components.md     # Pre-built components
│   ├── angular/
│   │   ├── setup.md          # Module configuration
│   │   └── services.md       # Injectable services
│   └── server/
│       ├── webhooks.md       # Webhook handling
│       └── middleware.md     # Express, Next.js, Fastify
├── api/                      # Auto-generated API reference
│   ├── core.md
│   ├── react.md
│   ├── angular.md
│   └── server.md
├── examples/
│   ├── nextjs-checkout/      # Full Next.js example
│   ├── react-spa/            # React SPA example
│   └── angular-app/          # Angular example
└── migration/
    └── v1-to-v2.md           # Migration guides
```

---

## README.md Structure

The root README should include:

```markdown
# @bates/squareup

> TypeScript wrapper for Square API with React & Angular integrations

[![npm version](https://img.shields.io/npm/v/@bates/squareup.svg)](https://npmjs.com/package/@bates/squareup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)

## Features
- Simplified payment processing
- React hooks and components
- Angular services with RxJS
- Webhook utilities
- Type-safe builders

## Installation
## Quick Start (with code examples)
## Documentation Links
## Framework Examples (React, Angular, Node.js)
## API Reference Link
## Contributing
## License
```

---

## API Documentation

Generate API docs from TypeScript using [TypeDoc](https://typedoc.org/):

```json
// typedoc.json
{
  "entryPoints": ["src/core/index.ts", "src/react/index.ts", "src/angular/index.ts", "src/server/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "none",
  "excludePrivate": true,
  "excludeInternal": true
}
```

**Scripts:**
```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch"
  }
}
```

---

## JSDoc Standards

All public APIs must include JSDoc comments:

```typescript
/**
 * Creates a payment using the Square Payments API.
 *
 * @param options - Payment creation options
 * @param options.sourceId - Payment source (card nonce, card ID, or wallet token)
 * @param options.amount - Amount in smallest currency unit (cents for USD)
 * @param options.currency - ISO 4217 currency code (default: USD)
 * @param options.customerId - Optional customer ID to associate payment
 *
 * @returns The created payment object
 *
 * @throws {SquarePaymentError} When payment processing fails
 * @throws {SquareAuthError} When authentication is invalid
 *
 * @example
 * ```typescript
 * const payment = await square.payments.create({
 *   sourceId: 'cnon:card-nonce-ok',
 *   amount: 1000,
 *   currency: 'USD',
 * });
 * console.log(payment.id);
 * ```
 *
 * @see https://developer.squareup.com/reference/square/payments-api/create-payment
 */
export async function createPayment(options: CreatePaymentOptions): Promise<Payment> {
  // ...
}
```

---

## Code Examples

Every major feature needs:

1. **Inline examples** - In JSDoc for API reference
2. **Guide examples** - In markdown docs for tutorials
3. **Runnable examples** - In `/examples` directory

**Example quality checklist:**
- [ ] Works with copy-paste (no placeholder values except credentials)
- [ ] Includes error handling
- [ ] Shows both success and failure cases
- [ ] Uses realistic scenarios
- [ ] Includes TypeScript types

---

## Documentation Hosting

**Option 1: GitHub Pages** (recommended for open source)
```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run docs
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

**Option 2: Docusaurus** (for richer documentation site)
- Better for complex documentation
- Supports versioned docs
- Built-in search

---

## Documentation Checklist

Before each release:

- [ ] All new public APIs have JSDoc
- [ ] API docs regenerated (`npm run docs`)
- [ ] CHANGELOG updated
- [ ] README examples still work
- [ ] Migration guide written (if breaking changes)

---

## Example Projects

Maintain working example projects in `/examples`:

| Example | Description | Stack |
|---------|-------------|-------|
| `nextjs-checkout` | Full checkout flow | Next.js 14, App Router |
| `react-spa` | Single-page payment form | Vite + React |
| `angular-app` | Service-based integration | Angular 18 |
| `express-webhooks` | Webhook server | Express.js |

Each example includes:
- `README.md` with setup instructions
- `.env.example` for required credentials
- Working code that tests against Square Sandbox
