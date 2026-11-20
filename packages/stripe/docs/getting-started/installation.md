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

The [`stripe`](https://www.npmjs.com/package/stripe) SDK is a required peer dependency that provides the underlying API client. This package supports `stripe` v22.4 through v23 (peer range `>=22.4 <24`). Earlier SDKs lack `allowed_payment_method_types` on SetupIntents, which replaced `payment_method_types` in v23.

## TypeScript

This package is written in TypeScript and includes type definitions. TypeScript 5.0+ is recommended.

## Node.js

Requires Node.js 22 or higher.
