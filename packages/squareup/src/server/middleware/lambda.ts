/**
 * `@bates-solutions/squareup/server/lambda`: Square webhooks for AWS Lambda.
 *
 * `createLambdaWebhookHandler` handles an API Gateway proxy event: it verifies
 * the signature, dispatches the event with the payment, order and customer IDs
 * extracted, and returns `500` when a handler throws so Square retries the
 * delivery. `notificationUrl` is required. There is no `aws-lambda`
 * dependency: the event and result types here are structural.
 *
 * @module
 *
 * @example
 * ```typescript
 * import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server/lambda';
 *
 * export const handler = createLambdaWebhookHandler({
 *   signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
 *   notificationUrl: 'https://api.example.com/webhooks/square',
 *   handlers: {
 *     'payment.completed': async (event, context) => {
 *       console.log('Paid:', event.data.id, context.orderId);
 *     },
 *   },
 * });
 * ```
 */
import {
  verifySignature,
  parseWebhookEvent,
  getPaymentId,
  getOrderId,
  getCustomerId,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookEvent, WebhookSignatureKey } from '../types.js';

/**
 * Minimal API Gateway proxy event shape (avoids aws-lambda dependency)
 */
export interface LambdaProxyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined> | null;
  body: string | null;
  isBase64Encoded?: boolean;
}

/**
 * API Gateway proxy result shape
 */
export interface LambdaProxyResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Context passed to Lambda webhook handlers with auto-extracted entity IDs
 */
export interface WebhookEventContext {
  paymentId?: string;
  orderId?: string;
  customerId?: string;
}

/**
 * Handler function for Lambda webhook events
 */
export type LambdaWebhookHandler<T = unknown> = (
  event: WebhookEvent<T>,
  context: WebhookEventContext
) => void | Promise<void>;

/**
 * Map of event types to their Lambda handlers
 */
export type LambdaWebhookHandlers = {
  [K in import('../types.js').WebhookEventType]?: LambdaWebhookHandler;
};

/**
 * Logger interface for Lambda webhook handler
 */
export interface WebhookLogger {
  info: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
}

const defaultLogger: WebhookLogger = {
  info: (message, data) => { console.info(message, data); },
  error: (message, data) => { console.error(message, data); },
};

/**
 * Configuration for Lambda webhook handling
 */
export interface LambdaWebhookConfig {
  /** Square webhook signature key, or a list of keys during rotation */
  signatureKey: WebhookSignatureKey;
  /** Event handlers by type */
  handlers: LambdaWebhookHandlers;
  /**
   * The exact notification URL registered on the webhook subscription.
   * Required: Square signs `notificationUrl + rawBody`, so without it no real
   * delivery verifies.
   */
  notificationUrl: string;
  /** Custom CORS headers (merged with defaults) */
  corsHeaders?: Record<string, string>;
  /** Logger instance (defaults to console) */
  logger?: WebhookLogger | false;
  /** Callback for events with no registered handler */
  onUnhandledEvent?: (event: WebhookEvent, context: WebhookEventContext) => void | Promise<void>;
}

const DEFAULT_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, ' + SIGNATURE_HEADER,
};

function normalizeHeaders(
  headers: Record<string, string | undefined>
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      normalized[key.toLowerCase()] = value;
    }
  }
  return normalized;
}

/**
 * Create an AWS Lambda handler for Square webhooks
 *
 * Handles CORS preflight, signature verification, event parsing,
 * routing to handlers, and entity ID extraction.
 *
 * Responses:
 * - `204` for a CORS preflight (`OPTIONS`)
 * - `400` when the body is missing or is not JSON
 * - `401` when the signature header is missing or the signature is invalid
 * - `500` when a handler (or `onUnhandledEvent`) throws, so Square retries the delivery
 * - `200` with `{ success: true, eventId, ...ids }` once the handler has run
 *
 * Square retries a delivery that fails, so make handlers idempotent (for
 * example, keyed on `event.event_id`).
 *
 * @param config - Lambda webhook configuration
 * @returns Lambda handler function
 *
 * @throws {Error} When `notificationUrl` is missing
 *
 * @example
 * ```typescript
 * import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server';
 *
 * export const handler = createLambdaWebhookHandler({
 *   signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
 *   notificationUrl: 'https://api.example.com/webhooks/square',
 *   handlers: {
 *     'payment.completed': async (event, context) => {
 *       await processPayment(event.data.id, context.orderId);
 *     },
 *   },
 * });
 * ```
 */
export function createLambdaWebhookHandler(
  config: LambdaWebhookConfig
): (proxyEvent: LambdaProxyEvent) => Promise<LambdaProxyResult> {
  // Untyped callers can still leave it out; fail at startup, not per request.
  if (typeof config.notificationUrl !== 'string' || config.notificationUrl === '') {
    throw new Error(
      'notificationUrl is required: Square signs notificationUrl + body, so set it to the URL registered on the webhook subscription'
    );
  }

  const corsHeaders = { ...DEFAULT_CORS_HEADERS, ...config.corsHeaders };
  const logger = config.logger === false ? undefined : (config.logger ?? defaultLogger);

  return async (proxyEvent: LambdaProxyEvent): Promise<LambdaProxyResult> => {
    // Handle CORS preflight
    if (proxyEvent.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    const headers = normalizeHeaders(proxyEvent.headers ?? {});
    const signature = headers[SIGNATURE_HEADER];
    const rawBody = proxyEvent.isBase64Encoded && proxyEvent.body
      ? Buffer.from(proxyEvent.body, 'base64').toString('utf-8')
      : proxyEvent.body;

    if (!rawBody) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    if (!signature) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing signature header' }),
      };
    }

    const verification = verifySignature(
      rawBody,
      signature,
      config.signatureKey,
      config.notificationUrl
    );

    if (!verification.valid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: verification.error }),
      };
    }

    let event: WebhookEvent;
    try {
      event = parseWebhookEvent(rawBody);
    } catch (error) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: error instanceof Error ? error.message : 'Invalid webhook payload',
        }),
      };
    }

    try {
      const context: WebhookEventContext = {
        paymentId: getPaymentId(event),
        orderId: getOrderId(event),
        customerId: getCustomerId(event),
      };

      logger?.info('Webhook event received', {
        type: event.type,
        eventId: event.event_id,
        ...context,
      });

      const handler = config.handlers[event.type];
      if (handler) {
        await handler(event, context);
      } else {
        logger?.info('No handler registered for event type', { type: event.type });
        if (config.onUnhandledEvent) {
          await config.onUnhandledEvent(event, context);
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, eventId: event.event_id, ...context }),
      };
    } catch (error) {
      logger?.error('Webhook handler error', {
        type: event.type,
        eventId: event.event_id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // A 5xx makes Square retry the delivery, so a failed handler gets
      // another chance instead of the event being dropped.
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      };
    }
  };
}
