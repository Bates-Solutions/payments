# @bates-solutions/stripe Documentation

Welcome to the documentation for `@bates-solutions/stripe`, a TypeScript wrapper for the Stripe API with webhook support for Node.js backends.

## Getting Started

- [Installation](./getting-started/installation.md) - How to install the package
- [Quick Start](./getting-started/quick-start.md) - Get running in 5 minutes
- [Configuration](./getting-started/configuration.md) - Environment setup and options

## Guides

### Core (Backend)

- [Payments](./guides/core/payments.md) - Processing payments (PaymentIntents)
- [Customers](./guides/core/customers.md) - Customer operations and search
- [Refunds](./guides/core/refunds.md) - Refunding payments

### Server

- [Webhooks](./guides/server/webhooks.md) - Webhook handling
- [Middleware](./guides/server/middleware.md) - Express, Next.js, and Lambda integration

## API Reference

Complete API reference generated from source code with TypeDoc:

- [Core Module](./api/README.md) - Client, services, utilities, error handling
- [Server Module](./api/README.md) - Webhook handlers, middleware

## Additional Resources

- [GitHub Repository](https://github.com/mbates/stripe)
- [Stripe API Documentation](https://docs.stripe.com/api)
- [Changelog](../CHANGELOG.md)
