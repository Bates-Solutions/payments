import {
  verifyTimestampedHmac,
  type TimestampedHmacFailure,
} from '@bates-solutions/payments-core/crypto';
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

/** This package's error message for each reason core's check can fail. */
const FAILURE_MESSAGES: Record<TimestampedHmacFailure, string> = {
  'malformed-header': 'Invalid signature header format',
  'signature-mismatch': 'Invalid signature',
  'timestamp-outside-tolerance': 'Timestamp outside the tolerance zone',
};

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

  const result = await verifyTimestampedHmac(rawBody, signature, signingSecret, {
    tolerance: options?.tolerance,
  });
  if (!result.valid) {
    return { valid: false, error: FAILURE_MESSAGES[result.reason] };
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
export function createWebhookProcessor(
  config: WebhookConfig
): (rawBody: string, signature: string) => Promise<{ success: boolean; event?: WebhookEvent; error?: string }> {
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
