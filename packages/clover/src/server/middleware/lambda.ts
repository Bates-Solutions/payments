import {
  verifySignature,
  parseWebhookEvent,
  processWebhookEvent,
  getVerificationCode,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookConfig, WebhookEvent } from '../types.js';

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
 * Configuration for the Lambda webhook handler.
 */
export interface LambdaWebhookConfig extends WebhookConfig {
  corsHeaders?: Record<string, string>;
  logger?: WebhookLogger | false;
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
 * Create an AWS Lambda handler for Clover webhooks.
 *
 * Handles CORS preflight, the URL-verification handshake, signature
 * verification, parsing, and dispatch.
 */
export function createLambdaWebhookHandler(
  config: LambdaWebhookConfig
): (proxyEvent: LambdaProxyEvent) => Promise<LambdaProxyResult> {
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
      return json(400, corsHeaders, { error: 'Missing request body' });
    }

    if (!signature) {
      const code = tryGetVerificationCode(rawBody);
      if (code) {
        return json(200, corsHeaders, { verificationCode: code });
      }
      return json(400, corsHeaders, { error: 'Missing signature header' });
    }

    const verification = await verifySignature(rawBody, signature, config.signingSecret, config);
    if (!verification.valid) {
      return json(400, corsHeaders, { error: verification.error });
    }

    let event: WebhookEvent;
    try {
      event = parseWebhookEvent(rawBody);
    } catch (error) {
      return json(400, corsHeaders, {
        error: error instanceof Error ? error.message : 'Invalid webhook payload',
      });
    }

    try {
      logger?.info('Webhook event received', { type: event.type });
      await processWebhookEvent(event, config);
      return json(200, corsHeaders, { success: true });
    } catch (error) {
      logger?.error('Webhook handler error', {
        type: event.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Return 200 on handler errors so Clover does not retry on app bugs.
      return json(200, corsHeaders, {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

function json(
  statusCode: number,
  headers: Record<string, string>,
  body: Record<string, unknown>
): LambdaProxyResult {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function tryGetVerificationCode(rawBody: string): string | undefined {
  try {
    return getVerificationCode(parseWebhookEvent(rawBody));
  } catch {
    return undefined;
  }
}
