# Installation

```bash
npm install @bates-solutions/clover
# or
yarn add @bates-solutions/clover
# or
pnpm add @bates-solutions/clover
```

## No runtime dependencies

The client uses the global `fetch` and WebCrypto (`crypto.subtle`) — there is no
vendor SDK to install. It runs on any modern runtime: **Node.js 22+**, Deno,
Bun, and Cloudflare Workers.

## TypeScript

Written in TypeScript with bundled type definitions. TypeScript 5.0+ is recommended.
