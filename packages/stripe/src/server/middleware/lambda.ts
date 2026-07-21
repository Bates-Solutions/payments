import {
  verifySignature,
  parseWebhookEvent,
  getPaymentIntentId,
  getChargeId,
  getCustomerId,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookEvent, WebhookEventType, VerifyOptions } from '../types.js';

/**
 * Minimal API Gateway proxy event shape (avoids an aws-lambda dependency).
 */
export interface LambdaProxyEvent {
  httpMethod: string;
  headers?: Record<string, string | undefined> | null;
  body: string | null;
  isBase64Encoded?: boolean;
}

/**
 * API Gateway proxy result shape.
 */
export interface LambdaProxyResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Context passed to Lambda webhook handlers with auto-extracted entity IDs.
 */
export interface WebhookEventContext {
  paymentIntentId?: string;
  chargeId?: string;
  customerId?: string;
}

/**
 * Handler for a Lambda webhook event.
 */
export type LambdaWebhookHandler = (
  event: WebhookEvent,
  context: WebhookEventContext
) => void | Promise<void>;

/**
 * Map of event types to their Lambda handlers.
 */
export type LambdaWebhookHandlers = {
  [K in WebhookEventType]?: LambdaWebhookHandler;
};

/**
 * Logger interface for the Lambda webhook handler.
 */
export interface WebhookLogger {
  info: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
}

const defaultLogger: WebhookLogger = {
  info: (message, data) => {
    console.info(message, data);
  },
  error: (message, data) => {
    console.error(message, data);
  },
};

/**
 * Configuration for Lambda webhook handling.
 */
export interface LambdaWebhookConfig extends VerifyOptions {
  /** Stripe webhook signing secret (`whsec_…`) */
  signingSecret: string;
  /** Event handlers by type */
  handlers: LambdaWebhookHandlers;
  /** Custom CORS headers (merged with defaults) */
  corsHeaders?: Record<string, string>;
  /** Logger instance (defaults to console); pass `false` to disable */
  logger?: WebhookLogger | false;
  /** Callback for events with no registered handler */
  onUnhandledEvent?: (event: WebhookEvent, context: WebhookEventContext) => void | Promise<void>;
}

const DEFAULT_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, ' + SIGNATURE_HEADER,
};

function normalizeHeaders(headers: Record<string, string | undefined>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      normalized[key.toLowerCase()] = value;
    }
  }
  return normalized;
}

/**
 * Create an AWS Lambda handler for Stripe webhooks.
 *
 * Handles CORS preflight, signature verification, event parsing, routing to
 * handlers, and entity ID extraction.
 *
 * @param config - Lambda webhook configuration
 * @returns A Lambda handler function
 *
 * @example
 * ```typescript
 * import { createLambdaWebhookHandler } from '@bates-solutions/stripe/server';
 *
 * export const handler = createLambdaWebhookHandler({
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event, context) => {
 *       await fulfillOrder(event.data.object.id, context.customerId);
 *     },
 *   },
 * });
 * ```
 */
export function createLambdaWebhookHandler(config: LambdaWebhookConfig) {
  const corsHeaders = { ...DEFAULT_CORS_HEADERS, ...config.corsHeaders };
  const logger = config.logger === false ? undefined : (config.logger ?? defaultLogger);

  return async (proxyEvent: LambdaProxyEvent): Promise<LambdaProxyResult> => {
    if (proxyEvent.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders, body: '' };
    }

    const headers = normalizeHeaders(proxyEvent.headers ?? {});
    const signature = headers[SIGNATURE_HEADER];
    const rawBody =
      proxyEvent.isBase64Encoded && proxyEvent.body
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
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing signature header' }),
      };
    }

    const verification = await verifySignature(rawBody, signature, config.signingSecret, config);

    if (!verification.valid) {
      return {
        statusCode: 400,
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
        paymentIntentId: getPaymentIntentId(event),
        chargeId: getChargeId(event),
        customerId: getCustomerId(event),
      };

      logger?.info('Webhook event received', {
        type: event.type,
        eventId: event.id,
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
        body: JSON.stringify({ success: true, eventId: event.id, ...context }),
      };
    } catch (error) {
      logger?.error('Webhook handler error', {
        type: event.type,
        eventId: event.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Return 200 on handler errors — Stripe retries on non-2xx responses
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
