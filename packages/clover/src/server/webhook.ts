import type {
  WebhookConfig,
  WebhookEvent,
  WebhookVerificationResult,
  ParsedWebhookRequest,
  VerifyOptions,
} from './types.js';

/**
 * Header carrying the Clover Hosted-Checkout webhook signature.
 */
export const SIGNATURE_HEADER = 'clover-signature';

/**
 * Compute an HMAC-SHA256 hex digest using WebCrypto.
 *
 * Uses `globalThis.crypto.subtle`, so verification runs on any modern runtime
 * (Node 22+, Deno, Bun, Cloudflare Workers) with no Node built-ins.
 */
async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time comparison of two equal-length hex strings. Pure JS.
 */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Parse a `clover-signature` header (`t=<ts>,v1=<sig>,v1=…`).
 */
function parseSignatureHeader(header: string): {
  timestamp: number | null;
  signatures: string[];
} {
  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(',')) {
    const [key, value] = part.split('=', 2);
    if (!key || !value) continue;
    if (key.trim() === 't') {
      const parsed = Number.parseInt(value.trim(), 10);
      timestamp = Number.isNaN(parsed) ? null : parsed;
    } else if (key.trim() === 'v1') {
      signatures.push(value.trim());
    }
  }

  return { timestamp, signatures };
}

/**
 * Verify a Clover Hosted-Checkout webhook signature.
 *
 * Clover signs `${timestamp}.${rawBody}` with HMAC-SHA256 and sends it in the
 * `clover-signature` header as `t=<ts>,v1=<sig>`. This reimplements that scheme
 * with WebCrypto — no SDK, no network, no Node built-ins.
 *
 * @param rawBody - The raw request body as a string
 * @param signature - The `clover-signature` header value
 * @param signingSecret - Your webhook signing secret
 * @param options - Verification options (timestamp tolerance)
 *
 * @example
 * ```typescript
 * const result = await verifySignature(rawBody, signature, process.env.CLOVER_WEBHOOK_SECRET!);
 * if (!result.valid) return res.status(400).json({ error: result.error });
 * ```
 */
export async function verifySignature(
  rawBody: string,
  signature: string,
  signingSecret: string,
  options?: VerifyOptions
): Promise<WebhookVerificationResult> {
  if (!rawBody) {
    return { valid: false, error: 'Missing request body' };
  }
  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }
  if (!signingSecret) {
    return { valid: false, error: 'Missing signing secret' };
  }

  const { timestamp, signatures } = parseSignatureHeader(signature);
  if (timestamp === null || signatures.length === 0) {
    return { valid: false, error: 'Invalid signature header format' };
  }

  const signedPayload = `${timestamp.toString()}.${rawBody}`;
  const expected = await hmacSha256Hex(signingSecret, signedPayload);

  const matches = signatures.some((sig) => timingSafeEqualHex(sig, expected));
  if (!matches) {
    return { valid: false, error: 'Invalid signature' };
  }

  const tolerance = options?.tolerance ?? 300;
  if (tolerance > 0) {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > tolerance) {
      return { valid: false, error: 'Timestamp outside the tolerance zone' };
    }
  }

  return { valid: true };
}

/**
 * Parse a webhook request body into an event.
 *
 * @throws Error if the payload is not valid JSON
 */
export function parseWebhookEvent(rawBody: string): WebhookEvent {
  try {
    return JSON.parse(rawBody) as WebhookEvent;
  } catch {
    throw new Error('Invalid webhook payload: failed to parse JSON');
  }
}

/**
 * The verification code Clover sends when first validating a webhook URL.
 *
 * Clover POSTs `{ "verificationCode": "..." }` (with no signature) to confirm
 * the endpoint; respond `200` to complete setup.
 */
export function getVerificationCode(event: WebhookEvent): string | undefined {
  const code = event.verificationCode;
  return typeof code === 'string' ? code : undefined;
}

/**
 * Verify and parse a webhook request.
 *
 * @throws Error if verification or parsing fails
 */
export async function parseAndVerifyWebhook(
  rawBody: string,
  signature: string,
  signingSecret: string,
  options?: VerifyOptions
): Promise<ParsedWebhookRequest> {
  const verification = await verifySignature(rawBody, signature, signingSecret, options);
  if (!verification.valid) {
    throw new Error(verification.error ?? 'Signature verification failed');
  }
  const event = parseWebhookEvent(rawBody);
  return { rawBody, signature, event };
}

/**
 * Dispatch an event to the handler registered for its `type`.
 */
export async function processWebhookEvent(
  event: WebhookEvent,
  config: WebhookConfig
): Promise<void> {
  if (typeof event.type !== 'string') {
    return;
  }
  const handler = config.handlers[event.type];
  if (handler) {
    await handler(event);
  }
}

/**
 * Create a webhook handler that verifies and processes raw webhook requests.
 *
 * An invalid signature is never dispatched — `throwOnInvalidSignature` only
 * controls whether the failure throws (caught here as an error result) or is
 * returned directly.
 *
 * @example
 * ```typescript
 * const handleWebhook = createWebhookProcessor({
 *   signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
 *   handlers: { 'CHARGE': async (event) => { await fulfill(event); } },
 * });
 * const result = await handleWebhook(rawBody, signature);
 * ```
 */
export function createWebhookProcessor(config: WebhookConfig) {
  return async (
    rawBody: string,
    signature: string
  ): Promise<{ success: boolean; event?: WebhookEvent; error?: string }> => {
    try {
      const verification = await verifySignature(rawBody, signature, config.signingSecret, config);

      if (!verification.valid) {
        if (config.throwOnInvalidSignature !== false) {
          throw new Error(verification.error ?? 'Signature verification failed');
        }
        return { success: false, error: verification.error };
      }

      const event = parseWebhookEvent(rawBody);
      await processWebhookEvent(event, config);

      return { success: true, event };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
