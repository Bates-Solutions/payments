# @bates-solutions/payments-core

Edge-safe primitives and the base error class shared by [`@bates-solutions/squareup`](https://jsr.io/@bates-solutions/squareup), [`@bates-solutions/stripe`](https://jsr.io/@bates-solutions/stripe) and [`@bates-solutions/clover`](https://jsr.io/@bates-solutions/clover). Published to JSR as TypeScript source.

Everything here runs on WebCrypto, with no `node:*` imports, `Buffer` or `process`: Node 22+, Deno, Bun, Supabase Edge Functions and Cloudflare Workers.

> **0.x:** the API may change in a minor release until all three providers use it.

## Install

```bash
# Deno
deno add jsr:@bates-solutions/payments-core

# Node, through JSR's npm registry
npx jsr add @bates-solutions/payments-core
```

## What's in it

| Export                                                     | Entry point  | What it does                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hmacSha256(secret, payload)`                              | `./crypto`   | HMAC-SHA256 over WebCrypto. Strings are UTF-8; returns the raw 32-byte digest.                                                                                                                                                     |
| `timingSafeEqual(a, b)`                                    | `./crypto`   | Constant-time compare of two strings or two byte sequences (`Uint8Array` or `ArrayBuffer`; a string against bytes is compared as UTF-8). `false` for different lengths or empty input; throws a `TypeError` for other input types. |
| `toHex(bytes)`                                             | `./crypto`   | Lowercase hex.                                                                                                                                                                                                                     |
| `toBase64(bytes)`                                          | `./crypto`   | Standard base64 with padding.                                                                                                                                                                                                      |
| `fromBase64(text)`                                         | `./crypto`   | Decodes base64 the way Node's `Buffer.from(text, 'base64')` does: standard or URL-safe alphabet, padding optional, other characters skipped.                                                                                       |
| `verifyTimestampedHmac(payload, header, secret, options?)` | `./crypto`   | Checks a `t=<timestamp>,v1=<hex>` header (Stripe, Clover): HMAC over `${t}.${payload}`, constant-time compare, 300 s tolerance by default. Returns `{ valid: true, timestamp }` or `{ valid: false, reason }`.                     |
| `parseTimestampedSignatureHeader(header, scheme?)`         | `./crypto`   | Splits that header into its timestamp and signatures.                                                                                                                                                                              |
| `createIdempotencyKey()`                                   | `./crypto`   | A random UUID from WebCrypto, for idempotency keys.                                                                                                                                                                                |
| `minorUnitExponent(currency)`                              | `./currency` | Decimal places in a currency's minor unit: `0` for `JPY`, `KRW` and other zero-decimal codes, `3` for `BHD`, `JOD`, `KWD`, `OMR` and `TND`, `2` otherwise. Case-insensitive.                                                       |
| `PaymentsError`                                            | `./errors`   | Base class of `SquareError`, `StripeError` and `CloverError`, with `code`, `statusCode` and `details`. Catch it to handle any provider's error, from any copy of this package.                                                     |
| `requireNonEmpty(value, field, createError)`               | `./errors`   | Throws the error `createError` builds when a required string is missing or empty.                                                                                                                                                  |

Every export is also available from the package root.

```typescript
import { hmacSha256, timingSafeEqual, toHex } from '@bates-solutions/payments-core/crypto';

const expected = toHex(await hmacSha256(signingSecret, `${timestamp}.${rawBody}`));
if (!timingSafeEqual(signatureFromHeader, expected)) {
  throw new Error('Invalid signature');
}
```

See the [guides](./docs/guides/README.md) and the [API reference](https://bates-solutions.github.io/payments/payments-core/).

## License

MIT
