import { fromBase64, hmacSha256, timingSafeEqual } from '@bates-solutions/payments-core/crypto';
import { signatureKeyList } from './events.js';
import type { WebhookSignatureKey, WebhookVerificationResult } from './types.js';

/**
 * Verify a Square webhook signature with WebCrypto (edge-safe, async).
 *
 * The same check as {@link verifySignature}, HMAC-SHA256 over
 * `notificationUrl + rawBody` compared in constant time, but computed with
 * `globalThis.crypto.subtle` instead of `node:crypto`. Use it on Deno,
 * Supabase Edge Functions, Cloudflare Workers or Bun, where `node:crypto` may
 * be missing. WebCrypto is promise-based, so this returns a `Promise`.
 *
 * On Node, the synchronous {@link verifySignature} is still available and is
 * what the Express, Next.js and Lambda adapters use.
 *
 * @param rawBody - The raw request body as a string
 * @param signature - The signature from the x-square-hmacsha256-signature header
 * @param signatureKey - Your webhook signature key from Square, or a list of keys while you rotate it (any match is valid)
 * @param notificationUrl - The URL registered on the webhook subscription (Square signs it)
 * @returns Verification result with valid flag and optional error
 *
 * @example
 * ```typescript
 * import { verifySignatureAsync, SIGNATURE_HEADER } from '@bates-solutions/squareup/server/web';
 *
 * const rawBody = await request.text();
 * const result = await verifySignatureAsync(
 *   rawBody,
 *   request.headers.get(SIGNATURE_HEADER) ?? '',
 *   Deno.env.get('SQUARE_WEBHOOK_KEY')!,
 *   'https://example.com/webhook'
 * );
 *
 * if (!result.valid) {
 *   return Response.json({ error: result.error }, { status: 401 });
 * }
 * ```
 */
export async function verifySignatureAsync(
  rawBody: string,
  signature: string,
  signatureKey: WebhookSignatureKey,
  notificationUrl?: string
): Promise<WebhookVerificationResult> {
  if (!rawBody) {
    return { valid: false, error: 'Missing request body' };
  }

  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }

  const keys = signatureKeyList(signatureKey);
  if (keys.length === 0) {
    return { valid: false, error: 'Missing signature key' };
  }

  try {
    // A non-string header (from untyped callers) is never a valid signature.
    if (typeof signature !== 'string') {
      return { valid: false, error: 'Invalid signature' };
    }

    const stringToSign = notificationUrl ? notificationUrl + rawBody : rawBody;
    // Decode the header with the same base64 rules as the node:crypto
    // verifySignature, so both accept exactly the same signatures.
    const received = fromBase64(signature);

    for (const key of keys) {
      const expected = await hmacSha256(key, stringToSign);
      if (timingSafeEqual(received, expected)) {
        return { valid: true };
      }
    }

    return { valid: false, error: 'Invalid signature' };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    };
  }
}
