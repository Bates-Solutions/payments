import type { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  verifySignature,
  parseWebhookEvent,
  processWebhookEvent,
  getVerificationCode,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookConfig, WebhookEvent } from '../types.js';

/**
 * Extended Express Request carrying Clover webhook data.
 */
export interface CloverWebhookRequest extends Request {
  rawBody?: string;
  cloverEvent?: WebhookEvent;
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
 * Create Express middleware for handling Clover webhooks.
 *
 * Mount the raw body parser on the webhook route so the signature can be
 * verified against the exact bytes:
 *
 * ```typescript
 * app.use('/webhook', express.raw({ type: 'application/json' }));
 * app.post('/webhook', createExpressWebhookHandler({ signingSecret, handlers }));
 * ```
 */
export function createExpressWebhookHandler(config: ExpressWebhookOptions): RequestHandler {
  const { autoRespond = true, ...webhookConfig } = config;

  return async (req: CloverWebhookRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let rawBody: string;
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString('utf8');
      } else if (typeof req.body === 'string') {
        rawBody = req.body;
      } else if (req.rawBody) {
        rawBody = req.rawBody;
      } else {
        // req.body is an already-parsed object (e.g. express.json() ran first),
        // so the exact signed bytes are gone. Re-serializing would not reproduce
        // them and signature verification would fail with a misleading error, so
        // fail loudly with actionable guidance instead.
        throw new Error(
          'Raw request body unavailable for signature verification. Mount this route with ' +
            'express.raw({ type: "*/*" }) (or capture req.rawBody via a body-parser verify hook) ' +
            'before the webhook handler — not express.json().'
        );
      }

      const signature = req.headers[SIGNATURE_HEADER];
      if (!signature || Array.isArray(signature)) {
        // Answer Clover's URL-verification handshake.
        const code = tryGetVerificationCode(rawBody);
        if (code && autoRespond) {
          res.status(200).json({ verificationCode: code });
          return;
        }
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
      req.cloverEvent = event;

      await processWebhookEvent(event, webhookConfig);

      if (autoRespond) {
        res.status(200).json({ received: true });
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

function tryGetVerificationCode(rawBody: string): string | undefined {
  try {
    return getVerificationCode(parseWebhookEvent(rawBody));
  } catch {
    return undefined;
  }
}
