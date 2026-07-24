/**
 * `@bates-solutions/squareup/server` — webhook helpers for the Square wrapper.
 *
 * Server utilities for handling Square webhooks: signature verification plus a
 * typed handler-map dispatch, with adapters for Express, Next.js, and AWS Lambda.
 *
 * @module
 *
 * @example
 * ```typescript
 * // Next.js App Router
 * import { createNextWebhookHandler } from '@bates-solutions/squareup/server';
 *
 * export const POST = createNextWebhookHandler({
 *   signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
 *   handlers: {
 *     'payment.created': async (event) => {
 *       console.log('Payment:', event.data.id);
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Express
 * import express from 'express';
 * import { createExpressWebhookHandler } from '@bates-solutions/squareup/server';
 *
 * const app = express();
 * app.use('/webhook', express.raw({ type: 'application/json' }));
 * app.post('/webhook', createExpressWebhookHandler({
 *   signatureKey: process.env.SQUARE_WEBHOOK_KEY!,
 *   handlers: {
 *     'payment.created': async (event) => {
 *       console.log('Payment:', event.data.id);
 *     },
 *   },
 * }));
 * ```
 */

// Types
export type {
  WebhookEventType,
  PaymentEventType,
  RefundEventType,
  OrderEventType,
  CustomerEventType,
  SubscriptionEventType,
  InvoiceEventType,
  LoyaltyEventType,
  CatalogEventType,
  InventoryEventType,
  TeamEventType,
  LaborEventType,
  WebhookEvent,
  WebhookHandler,
  WebhookHandlers,
  WebhookConfig,
  WebhookVerificationResult,
  ParsedWebhookRequest,
  PaymentWebhookObject,
  OrderWebhookObject,
  RefundWebhookObject,
  CustomerWebhookObject,
  PaymentWebhookEvent,
  OrderWebhookEvent,
  RefundWebhookEvent,
  CustomerWebhookEvent,
} from './types.js';

// Core webhook utilities
export {
  SIGNATURE_HEADER,
  verifySignature,
  parseWebhookEvent,
  parseAndVerifyWebhook,
  processWebhookEvent,
  createWebhookProcessor,
  getPaymentId,
  getOrderId,
  getCustomerId,
} from './webhook.js';

// Express middleware
export {
  createExpressWebhookHandler,
  rawBodyMiddleware,
  type SquareWebhookRequest,
  type ExpressWebhookOptions,
} from './middleware/express.js';

// Next.js handlers
export {
  createNextWebhookHandler,
  createNextPagesWebhookHandler,
  parseNextWebhook,
  type WebhookResponse,
} from './middleware/nextjs.js';

// Lambda handler
export {
  createLambdaWebhookHandler,
  type LambdaProxyEvent,
  type LambdaProxyResult,
  type LambdaWebhookConfig,
  type LambdaWebhookHandler,
  type LambdaWebhookHandlers,
  type WebhookEventContext,
  type WebhookLogger,
} from './middleware/lambda.js';
