import {
  verifySignature,
  parseWebhookEvent,
  getPaymentId,
  getOrderId,
  getCustomerId,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookEvent } from '../types.js';

/**
 * Minimal API Gateway proxy event shape (avoids aws-lambda dependency)
 */
export interface LambdaProxyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
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
 * Configuration for Lambda webhook handling
 */
export interface LambdaWebhookConfig {
  /** Square webhook signature key */
  signatureKey: string;
  /** Event handlers by type */
  handlers: LambdaWebhookHandlers;
  /** URL where webhooks are received (for signature verification) */
  notificationUrl?: string;
  /** Custom CORS headers (merged with defaults) */
  corsHeaders?: Record<string, string>;
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
 * @param config - Lambda webhook configuration
 * @returns Lambda handler function
 *
 * @example
 * ```typescript
 * import { createLambdaWebhookHandler } from '@bates-solutions/squareup/server';
 *
 * export const handler = createLambdaWebhookHandler({
 *   signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
 *   handlers: {
 *     'payment.completed': async (event, context) => {
 *       await processPayment(event.data.id, context.orderId);
 *     },
 *   },
 * });
 * ```
 */
export function createLambdaWebhookHandler(config: LambdaWebhookConfig) {
  const corsHeaders = { ...DEFAULT_CORS_HEADERS, ...config.corsHeaders };

  return async (proxyEvent: LambdaProxyEvent): Promise<LambdaProxyResult> => {
    // Handle CORS preflight
    if (proxyEvent.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    const headers = normalizeHeaders(proxyEvent.headers);
    const signature = headers[SIGNATURE_HEADER];
    const rawBody = proxyEvent.isBase64Encoded && proxyEvent.body
      ? Buffer.from(proxyEvent.body, 'base64').toString('utf-8')
      : proxyEvent.body;

    if (!rawBody || !signature) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing body or signature' }),
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

    try {
      const event = parseWebhookEvent(rawBody);

      const context: WebhookEventContext = {
        paymentId: getPaymentId(event),
        orderId: getOrderId(event),
        customerId: getCustomerId(event),
      };

      const handler = config.handlers[event.type];
      if (handler) {
        await handler(event, context);
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, eventId: event.event_id, ...context }),
      };
    } catch (error) {
      // Return 200 on handler errors — Square retries on 5xx
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      };
    }
  };
}
