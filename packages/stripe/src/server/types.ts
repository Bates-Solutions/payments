import type Stripe from 'stripe';

/**
 * A verified Stripe webhook event.
 *
 * This is the Stripe SDK's `Event` type — a discriminated union on `type`, so
 * narrowing on `event.type` gives you the correct `event.data.object` shape.
 */
export type WebhookEvent = Stripe.Event;

/**
 * All Stripe webhook event type strings (e.g. `payment_intent.succeeded`).
 */
export type WebhookEventType = Stripe.Event['type'];

/**
 * Handler for a webhook event of a specific type.
 */
export type WebhookHandler<E extends WebhookEvent = WebhookEvent> = (
  event: E
) => void | Promise<void>;

/**
 * Map of event types to their handlers. Each handler receives the event
 * narrowed to its specific type.
 *
 * @example
 * ```typescript
 * const handlers: WebhookHandlers = {
 *   'payment_intent.succeeded': (event) => {
 *     // event.data.object is a Stripe.PaymentIntent here
 *     console.log(event.data.object.amount);
 *   },
 * };
 * ```
 */
export type WebhookHandlers = {
  [K in WebhookEventType]?: WebhookHandler<Extract<Stripe.Event, { type: K }>>;
};

/**
 * Options controlling signature verification.
 */
export interface VerifyOptions {
  /**
   * Maximum allowed difference (seconds) between the signature timestamp and
   * now. Set to `0` to disable the timestamp check.
   * @default 300
   */
  tolerance?: number;
}

/**
 * Configuration for webhook handling.
 */
export interface WebhookConfig extends VerifyOptions {
  /** Stripe webhook signing secret (`whsec_…`) */
  signingSecret: string;
  /** Event handlers by type */
  handlers: WebhookHandlers;
  /**
   * Whether to treat a signature verification failure as an error.
   * @default true
   */
  throwOnInvalidSignature?: boolean;
}

/**
 * Result of webhook signature verification.
 */
export interface WebhookVerificationResult {
  /** Whether the signature is valid */
  valid: boolean;
  /** Error message if invalid */
  error?: string;
}

/**
 * A parsed and verified webhook request.
 */
export interface ParsedWebhookRequest {
  /** The raw request body */
  rawBody: string;
  /** The signature from the `stripe-signature` header */
  signature: string;
  /** The parsed event */
  event: WebhookEvent;
}
