# Verifying a webhook signature

Payment providers sign each webhook with HMAC-SHA256 and send the digest in a header, hex encoded (Stripe, Clover) or base64 encoded (Square). Checking one takes three steps: compute the digest over the same bytes the provider signed, encode it the way the provider does, and compare it in constant time.

Stripe and Clover style, where the header is `t=<timestamp>,v1=<hex signature>`, signed over `${t}.${rawBody}`:

```typescript
import { hmacSha256, timingSafeEqual, toHex } from 'jsr:@bates-solutions/payments-core/crypto';

const expected = toHex(await hmacSha256(signingSecret, `${timestamp}.${rawBody}`));
const signed = signatures.some((signature) => timingSafeEqual(signature, expected));

// Reject old timestamps too, or a captured webhook can be replayed later.
// The providers use a 300-second tolerance.
const fresh = Math.abs(Math.floor(Date.now() / 1000) - timestamp) <= 300;
const valid = signed && fresh;
```

Square style, base64 over `notificationUrl + rawBody`, with no timestamp:

```typescript
import { hmacSha256, timingSafeEqual, toBase64 } from 'jsr:@bates-solutions/payments-core/crypto';

const expected = toBase64(await hmacSha256(signatureKey, notificationUrl + rawBody));
const valid = timingSafeEqual(signature, expected);
```

Notes:

- Use the **raw** request body, exactly as received. A body that was parsed and serialized again produces a different digest.
- `timingSafeEqual` returns `false` for different lengths or an empty input, so a missing header never verifies.
- `hmacSha256` rejects an empty secret (WebCrypto refuses a zero-length HMAC key), so check for a missing secret first.
- Everything runs on WebCrypto (`globalThis.crypto.subtle`): Node 22+, Deno, Bun, Supabase Edge Functions and Cloudflare Workers.
