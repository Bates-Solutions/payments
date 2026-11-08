# Installation

## npm

```bash
npm install @bates-solutions/stripe stripe
```

## yarn

```bash
yarn add @bates-solutions/stripe stripe
```

## pnpm

```bash
pnpm add @bates-solutions/stripe stripe
```

## Peer Dependencies

The [`stripe`](https://www.npmjs.com/package/stripe) SDK is a required peer dependency that provides the underlying API client. This package supports `stripe` v18 through v23 (peer range `>=18 <24`). Stripe 17 lacks types this package relies on (`InvoiceItemCreateParams.pricing`, `SubscriptionItem.current_period_*`).

## TypeScript

This package is written in TypeScript and includes type definitions. TypeScript 5.0+ is recommended.

## Node.js

Requires Node.js 22 or higher.
