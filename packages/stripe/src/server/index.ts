/**
 * @bates-solutions/stripe/server
 *
 * Server utilities for handling Stripe webhooks.
 *
 * @example
 * ```typescript
 * // Next.js App Router
 * import { createNextWebhookHandler } from '@bates-solutions/stripe/server';
 *
 * export const POST = createNextWebhookHandler({
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event) => {
 *       console.log('Paid:', event.data.object.id);
 *     },
 *   },
 * });
 * ```
 */

// Types
export type {
  WebhookEvent,
  WebhookEventType,
  WebhookHandler,
  WebhookHandlers,
  WebhookConfig,
  VerifyOptions,
  WebhookVerificationResult,
  ParsedWebhookRequest,
  CheckoutSessionCompletedEvent,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
  SubscriptionDeletedEvent,
  InvoicePaidEvent,
  InvoicePaymentFailedEvent,
} from './types.js';

// Core webhook utilities
export {
  SIGNATURE_HEADER,
  verifySignature,
  parseWebhookEvent,
  parseAndVerifyWebhook,
  processWebhookEvent,
  createWebhookProcessor,
  getPaymentIntentId,
  getChargeId,
  getCustomerId,
  getSubscriptionId,
  resolveId,
} from './webhook.js';

// Framework-neutral (edge/Deno/Workers) handler
export { createWebhookHandler } from './middleware/web.js';

// Express middleware
export {
  createExpressWebhookHandler,
  rawBodyMiddleware,
  type StripeWebhookRequest,
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
