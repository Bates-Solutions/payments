import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifySignature, parseWebhookEvent, processWebhookEvent, SIGNATURE_HEADER } from '../webhook.js';
import type { WebhookConfig, WebhookEvent } from '../types.js';

/**
 * Extended Express Request carrying Stripe webhook data.
 */
export interface StripeWebhookRequest extends Request {
  /** The raw request body as a string */
  rawBody?: string;
  /** The parsed Stripe webhook event */
  stripeEvent?: WebhookEvent;
}

/**
 * Options for the Express webhook middleware.
 */
export interface ExpressWebhookOptions extends WebhookConfig {
  /**
   * Whether to send the response automatically.
   * @default true
   */
  autoRespond?: boolean;
}

/**
 * Create Express middleware for handling Stripe webhooks.
 *
 * This middleware:
 * 1. Reads the raw body (required for signature verification)
 * 2. Verifies the webhook signature
 * 3. Parses the event and attaches it to the request
 * 4. Calls the appropriate handler
 *
 * @param config - Webhook configuration
 * @returns Express request handler
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressWebhookHandler } from '@bates-solutions/stripe/server';
 *
 * const app = express();
 *
 * // IMPORTANT: use the raw body parser for the webhook route
 * app.use('/webhook', express.raw({ type: 'application/json' }));
 *
 * app.post('/webhook', createExpressWebhookHandler({
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event) => {
 *       console.log('Paid:', event.data.object.id);
 *     },
 *   },
 * }));
 * ```
 */
export function createExpressWebhookHandler(config: ExpressWebhookOptions): RequestHandler {
  const { autoRespond = true, ...webhookConfig } = config;

  return async (req: StripeWebhookRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get raw body — Express with the raw() parser stores it as a Buffer
      let rawBody: string;
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString('utf8');
      } else if (typeof req.body === 'string') {
        rawBody = req.body;
      } else if (req.rawBody) {
        rawBody = req.rawBody;
      } else {
        rawBody = JSON.stringify(req.body);
      }

      const signature = req.headers[SIGNATURE_HEADER];
      if (!signature || Array.isArray(signature)) {
        if (autoRespond) {
          res.status(400).json({ error: 'Missing or invalid signature header' });
          return;
        }
        throw new Error('Missing or invalid signature header');
      }

      const verification = await verifySignature(
        rawBody,
        signature,
        webhookConfig.signingSecret,
        webhookConfig
      );

      if (!verification.valid) {
        if (autoRespond) {
          res.status(400).json({ error: verification.error });
          return;
        }
        throw new Error(verification.error);
      }

      const event = parseWebhookEvent(rawBody);

      req.rawBody = rawBody;
      req.stripeEvent = event;

      await processWebhookEvent(event, webhookConfig);

      if (autoRespond) {
        res.status(200).json({ received: true, eventId: event.id });
        return;
      }

      next();
    } catch (error) {
      if (autoRespond) {
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Webhook processing failed',
        });
        return;
      }
      next(error);
    }
  };
}

/**
 * Raw body parser middleware for Express.
 *
 * Captures the raw body before JSON parsing for signature verification.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { rawBodyMiddleware } from '@bates-solutions/stripe/server';
 *
 * const app = express();
 * app.use('/webhook', rawBodyMiddleware);
 * ```
 */
export const rawBodyMiddleware: RequestHandler = (
  req: StripeWebhookRequest,
  _res: Response,
  next: NextFunction
): void => {
  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks).toString('utf8');
    next();
  });

  req.on('error', next);
};
