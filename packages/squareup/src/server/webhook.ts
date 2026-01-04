import { createHmac, timingSafeEqual } from 'crypto';
import type {
  WebhookConfig,
  WebhookEvent,
  WebhookVerificationResult,
  ParsedWebhookRequest,
} from './types.js';

/**
 * Header name for Square webhook signature
 */
export const SIGNATURE_HEADER = 'x-square-hmacsha256-signature';

/**
 * Verify a Square webhook signature using HMAC-SHA256
 *
 * @param rawBody - The raw request body as a string
 * @param signature - The signature from the x-square-hmacsha256-signature header
 * @param signatureKey - Your webhook signature key from Square
 * @param notificationUrl - The URL where the webhook was sent (optional, for additional verification)
 * @returns Verification result with valid flag and optional error
 *
 * @example
 * ```typescript
 * import { verifySignature } from '@bates-solutions/squareup/server';
 *
 * const result = verifySignature(
 *   rawBody,
 *   req.headers['x-square-hmacsha256-signature'],
 *   process.env.SQUARE_WEBHOOK_KEY!
 * );
 *
 * if (!result.valid) {
 *   return res.status(401).json({ error: result.error });
 * }
 * ```
 */
export function verifySignature(
  rawBody: string,
  signature: string,
  signatureKey: string,
  notificationUrl?: string
): WebhookVerificationResult {
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
    // Build the string to sign
    // Square uses: notificationUrl + rawBody (if URL provided) or just rawBody
    const stringToSign = notificationUrl ? notificationUrl + rawBody : rawBody;

    // Generate HMAC-SHA256 signature
    const expectedSignature = createHmac('sha256', signatureKey)
      .update(stringToSign)
      .digest('base64');

    // Use timing-safe comparison to prevent timing attacks
    const signatureBuffer = Buffer.from(signature, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');

    // Buffers must be same length for timingSafeEqual
    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, error: 'Invalid signature' };
    }

    const isValid = timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!isValid) {
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

/**
 * Parse a webhook request body into a typed event
 *
 * @param rawBody - The raw request body string
 * @returns Parsed webhook event
 * @throws Error if parsing fails
 *
 * @example
 * ```typescript
 * const event = parseWebhookEvent(rawBody);
 * console.log(event.type); // 'payment.completed'
 * ```
 */
export function parseWebhookEvent(rawBody: string): WebhookEvent {
  try {
    return JSON.parse(rawBody) as WebhookEvent;
  } catch {
    throw new Error('Invalid webhook payload: failed to parse JSON');
  }
}

/**
 * Parse and verify a webhook request
 *
 * @param rawBody - The raw request body string
 * @param signature - The signature from headers
 * @param signatureKey - Your webhook signature key
 * @param notificationUrl - Optional notification URL for verification
 * @returns Parsed and verified webhook request
 * @throws Error if verification or parsing fails
 *
 * @example
 * ```typescript
 * const { event } = parseAndVerifyWebhook(
 *   rawBody,
 *   signature,
 *   process.env.SQUARE_WEBHOOK_KEY!
 * );
 * ```
 */
export function parseAndVerifyWebhook(
  rawBody: string,
  signature: string,
  signatureKey: string,
  notificationUrl?: string
): ParsedWebhookRequest {
  const verification = verifySignature(rawBody, signature, signatureKey, notificationUrl);

  if (!verification.valid) {
    throw new Error(verification.error ?? 'Signature verification failed');
  }

  const event = parseWebhookEvent(rawBody);

  return {
    rawBody,
    signature,
    event,
  };
}

/**
 * Process a webhook event by calling the appropriate handler
 *
 * @param event - The parsed webhook event
 * @param config - Webhook configuration with handlers
 * @returns Promise that resolves when handler completes
 *
 * @example
 * ```typescript
 * await processWebhookEvent(event, {
 *   signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
 *   handlers: {
 *     'payment.created': async (event) => {
 *       console.log('Payment created:', event.data.id);
 *     },
 *   },
 * });
 * ```
 */
export async function processWebhookEvent(
  event: WebhookEvent,
  config: WebhookConfig
): Promise<void> {
  const handler = config.handlers[event.type];

  if (handler) {
    await handler(event);
  }
}

/**
 * Create a webhook handler function that verifies and processes events
 *
 * @param config - Webhook configuration
 * @returns Handler function that processes raw webhook requests
 *
 * @example
 * ```typescript
 * const handleWebhook = createWebhookProcessor({
 *   signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
 *   handlers: {
 *     'payment.created': async (event) => {
 *       await sendReceipt(event.data.object.payment);
 *     },
 *     'order.updated': async (event) => {
 *       await updateOrderStatus(event.data.object.order);
 *     },
 *   },
 * });
 *
 * // Use in your route handler
 * const result = await handleWebhook(rawBody, signature);
 * ```
 */
export function createWebhookProcessor(config: WebhookConfig) {
  return async (
    rawBody: string,
    signature: string
  ): Promise<{ success: boolean; event?: WebhookEvent; error?: string }> => {
    try {
      const verification = verifySignature(
        rawBody,
        signature,
        config.signatureKey,
        config.notificationUrl
      );

      if (!verification.valid) {
        if (config.throwOnInvalidSignature !== false) {
          return { success: false, error: verification.error };
        }
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
