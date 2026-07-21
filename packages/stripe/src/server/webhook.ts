import type {
  WebhookConfig,
  WebhookEvent,
  WebhookVerificationResult,
  ParsedWebhookRequest,
  VerifyOptions,
} from './types.js';

/**
 * Header name carrying the Stripe webhook signature.
 */
export const SIGNATURE_HEADER = 'stripe-signature';

/**
 * Compute an HMAC-SHA256 hex digest using WebCrypto.
 *
 * Uses `globalThis.crypto.subtle` so verification runs on any modern runtime
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
 * Constant-time comparison of two equal-length hex strings.
 *
 * Pure JS (no `node:crypto`) so it works on edge runtimes.
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
 * Parse a `stripe-signature` header into its timestamp and v1 signatures.
 *
 * Header format: `t=1492774577,v1=5257a869…,v1=…`
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
 * Verify a Stripe webhook signature.
 *
 * Reimplements Stripe's signing scheme (HMAC-SHA256 over `${timestamp}.${body}`)
 * using WebCrypto, so verification needs neither a Stripe SDK instance, a network
 * call, nor any Node built-in — it runs on Node 22+, Deno, Bun, and Workers.
 *
 * @param rawBody - The raw request body as a string
 * @param signature - The `stripe-signature` header value
 * @param signingSecret - Your webhook signing secret (`whsec_…`)
 * @param options - Verification options (timestamp tolerance)
 * @returns Verification result with a `valid` flag and optional error
 *
 * @example
 * ```typescript
 * import { verifySignature } from '@bates-solutions/stripe/server';
 *
 * const result = await verifySignature(
 *   rawBody,
 *   req.headers['stripe-signature'],
 *   process.env.STRIPE_WEBHOOK_SECRET!
 * );
 *
 * if (!result.valid) {
 *   return res.status(400).json({ error: result.error });
 * }
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
 * Parse a webhook request body into a typed event.
 *
 * @param rawBody - The raw request body string
 * @returns The parsed webhook event
 * @throws Error if the payload is not valid JSON
 *
 * @example
 * ```typescript
 * const event = parseWebhookEvent(rawBody);
 * console.log(event.type); // 'payment_intent.succeeded'
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
 * Verify and parse a webhook request.
 *
 * @param rawBody - The raw request body string
 * @param signature - The `stripe-signature` header value
 * @param signingSecret - Your webhook signing secret
 * @param options - Verification options
 * @returns The parsed and verified webhook request
 * @throws Error if verification or parsing fails
 *
 * @example
 * ```typescript
 * const { event } = parseAndVerifyWebhook(
 *   rawBody,
 *   signature,
 *   process.env.STRIPE_WEBHOOK_SECRET!
 * );
 * ```
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
 * Process a webhook event by calling the handler registered for its type.
 *
 * @param event - The parsed webhook event
 * @param config - Webhook configuration with handlers
 *
 * @example
 * ```typescript
 * await processWebhookEvent(event, {
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event) => {
 *       console.log('Paid:', event.data.object.id);
 *     },
 *   },
 * });
 * ```
 */
export async function processWebhookEvent(
  event: WebhookEvent,
  config: WebhookConfig
): Promise<void> {
  const handler = config.handlers[event.type] as
    | ((event: WebhookEvent) => void | Promise<void>)
    | undefined;

  if (handler) {
    await handler(event);
  }
}

/**
 * Create a webhook handler that verifies and processes raw webhook requests.
 *
 * @param config - Webhook configuration
 * @returns A function that processes a raw webhook request
 *
 * @example
 * ```typescript
 * const handleWebhook = createWebhookProcessor({
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event) => {
 *       await fulfillOrder(event.data.object);
 *     },
 *   },
 * });
 *
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

      // Never dispatch on an invalid signature. `throwOnInvalidSignature` only
      // controls throw-vs-return semantics — both stop before dispatch.
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

/**
 * Extract the PaymentIntent ID from a webhook event, when present.
 */
export function getPaymentIntentId(event: WebhookEvent): string | undefined {
  const object = event.data.object as { id?: string; payment_intent?: string | { id?: string } };

  if (event.type.startsWith('payment_intent.')) {
    return object.id;
  }
  if (typeof object.payment_intent === 'string') {
    return object.payment_intent;
  }
  return object.payment_intent?.id;
}

/**
 * Extract the Charge ID from a webhook event, when present.
 */
export function getChargeId(event: WebhookEvent): string | undefined {
  const object = event.data.object as { id?: string; latest_charge?: string | { id?: string } };

  if (event.type.startsWith('charge.')) {
    return object.id;
  }
  if (typeof object.latest_charge === 'string') {
    return object.latest_charge;
  }
  return object.latest_charge?.id;
}

/**
 * Extract the Customer ID from a webhook event, when present.
 */
export function getCustomerId(event: WebhookEvent): string | undefined {
  const object = event.data.object as { id?: string; customer?: string | { id?: string } };

  // Sub-resource events (customer.subscription.*, customer.source.*,
  // customer.discount.*, customer.tax_id.*) and most other objects carry an
  // explicit `customer` reference — prefer it over the object's own id.
  const customerRef = resolveId(object.customer);
  if (customerRef) {
    return customerRef;
  }

  // On a Customer object event (customer.created/updated/deleted) the object
  // itself is the customer.
  if (event.type.startsWith('customer.')) {
    return object.id;
  }

  return undefined;
}

/**
 * Extract the Subscription ID from a webhook event, when present.
 *
 * Works on `customer.subscription.*` events (the object is the subscription)
 * and on objects that reference a subscription (Checkout Sessions, Invoices).
 */
export function getSubscriptionId(event: WebhookEvent): string | undefined {
  const object = event.data.object as { id?: string; subscription?: string | { id?: string } };

  if (event.type.startsWith('customer.subscription.')) {
    return object.id;
  }
  return resolveId(object.subscription);
}

/**
 * Resolve a Stripe reference that may be either an ID string or an expanded
 * object, to its ID.
 *
 * Stripe fields like `customer` / `subscription` are a bare ID string unless
 * expanded, in which case they are the full object. This collapses both forms.
 *
 * @example
 * ```typescript
 * resolveId('cus_1');          // 'cus_1'
 * resolveId({ id: 'cus_1' });  // 'cus_1'
 * resolveId(null);             // undefined
 * ```
 */
export function resolveId(
  value: string | { id?: string } | null | undefined
): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return value?.id;
}
