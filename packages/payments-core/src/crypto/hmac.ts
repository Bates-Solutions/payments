const encoder = new TextEncoder();

function toBytes(value: string | Uint8Array): Uint8Array<ArrayBuffer> {
  // A copy, so WebCrypto always gets a plain ArrayBuffer-backed view.
  return typeof value === 'string' ? encoder.encode(value) : new Uint8Array(value);
}

/**
 * HMAC-SHA256 of `payload` under `secret`, computed with WebCrypto
 * (`globalThis.crypto.subtle`), so it runs on Node 22+, Deno, Bun and Workers
 * with no Node built-ins. Strings are encoded as UTF-8.
 *
 * Returns the raw 32-byte digest; encode it with {@link toHex} or
 * {@link toBase64} to compare against a provider's signature header.
 *
 * @example
 * ```typescript
 * const digest = await hmacSha256(secret, `${timestamp}.${rawBody}`);
 * const expected = toHex(digest);
 * ```
 */
export async function hmacSha256(
  secret: string | Uint8Array,
  payload: string | Uint8Array
): Promise<Uint8Array> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    toBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, toBytes(payload));
  return new Uint8Array(signature);
}
