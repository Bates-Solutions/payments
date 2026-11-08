/**
 * `@bates-solutions/clover/server` — webhook helpers for the Clover wrapper.
 *
 * Server utilities for handling Clover webhooks: signature verification plus a
 * typed handler-map dispatch, with adapters for Express, AWS Lambda, and a
 * framework-neutral Web/edge handler. Verification uses WebCrypto, so it runs on
 * Node, Deno, Bun, and Cloudflare Workers.
 *
 * @module
 *
 * @example
 * ```typescript
 * import { createWebhookHandler } from '@bates-solutions/clover/server';
 *
 * const handler = createWebhookHandler({
 *   signingSecret: process.env.CLOVER_WEBHOOK_SECRET!,
 *   handlers: { CHARGE: async (event) => { console.log(event); } },
 * });
 * ```
 */

// Types
export type {
  WebhookEvent,
  WebhookHandler,
  WebhookHandlers,
  WebhookConfig,
  VerifyOptions,
  WebhookVerificationResult,
  ParsedWebhookRequest,
} from './types.js';

// Core webhook utilities
export {
  SIGNATURE_HEADER,
  verifySignature,
  parseWebhookEvent,
  parseAndVerifyWebhook,
  processWebhookEvent,
  createWebhookProcessor,
  getVerificationCode,
} from './webhook.js';

// Framework-neutral (edge / Deno / Workers / Next.js App Router)
export { createWebhookHandler } from './middleware/web.js';

// Express middleware
export {
  createExpressWebhookHandler,
  type CloverWebhookRequest,
  type ExpressWebhookOptions,
} from './middleware/express.js';

// Lambda handler
export {
  createLambdaWebhookHandler,
  type LambdaProxyEvent,
  type LambdaProxyResult,
  type LambdaWebhookConfig,
  type WebhookLogger,
} from './middleware/lambda.js';
