/**
 * A parsed Clover webhook event.
 *
 * Clover webhook payloads vary by product (Hosted Checkout vs platform app
 * webhooks), so the event is kept generic — dispatch is keyed off an optional
 * `type` field when present.
 */
export interface WebhookEvent {
  /** Event type, when the payload carries one */
  type?: string;
  [key: string]: unknown;
}

/**
 * Handler for a webhook event.
 */
export type WebhookHandler = (event: WebhookEvent) => void | Promise<void>;

/**
 * Map of event types to their handlers.
 */
export type WebhookHandlers = Record<string, WebhookHandler>;

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
  /** Clover webhook signing secret */
  signingSecret: string;
  /** Event handlers by type */
  handlers: WebhookHandlers;
  /**
   * The verification code Clover expects echoed during the initial webhook
   * URL handshake. When set, the framework handlers answer the handshake
   * automatically.
   */
  verificationCode?: string;
  /**
   * Whether a signature verification failure throws (vs returning an error
   * result) in {@link createWebhookProcessor}. Either way an invalid signature
   * is never dispatched to handlers.
   * @default true
   */
  throwOnInvalidSignature?: boolean;
}

/**
 * Result of webhook signature verification.
 */
export interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * A parsed and verified webhook request.
 */
export interface ParsedWebhookRequest {
  rawBody: string;
  signature: string;
  event: WebhookEvent;
}
