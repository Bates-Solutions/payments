import { fromBase64, hmacSha256, timingSafeEqual } from '@bates-solutions/payments-core/crypto';
import type { WebhookVerificationResult } from './types.js';

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
 * @param signatureKey - Your webhook signature key from Square
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
  signatureKey: string,
  notificationUrl?: string
): Promise<WebhookVerificationResult> {
  if (!rawBody) {
    return { valid: false, error: 'Missing request body' };
  }

  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }

  if (!signatureKey) {
    return { valid: false, error: 'Missing signature key' };
  }

  try {
    const stringToSign = notificationUrl ? notificationUrl + rawBody : rawBody;
    const expected = await hmacSha256(signatureKey, stringToSign);

    // Compare bytes, decoding the header with the same base64 rules as the
    // node:crypto verifySignature, so both accept exactly the same signatures.
    // A non-string header (from untyped callers) is never a valid signature.
    if (typeof signature !== 'string' || !timingSafeEqual(fromBase64(signature), expected)) {
      return { valid: false, error: 'Invalid signature' };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed',
    };
  }
}
