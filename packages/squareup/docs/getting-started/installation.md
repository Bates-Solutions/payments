# Installation

## JSR (npm / pnpm / yarn)

```bash
npx jsr add @bates-solutions/squareup
```

## Deno

```bash
deno add jsr:@bates-solutions/squareup
```

## Square SDK peer dependency

The `square` SDK is a required peer dependency that provides the underlying API client. This release line supports `square` `>=45.0.1 <47` (`square@45` or `square@46`):

```bash
npm install square@^46
```

Upgrading from 1.x, which used `square@44` or earlier? See [Upgrading from 1.x](../guides/core/inventory.md#upgrading-from-1x).

## TypeScript

This package is written in TypeScript and includes type definitions. TypeScript 5.0+ is recommended.

## Node.js

Requires Node.js 22 or higher.
