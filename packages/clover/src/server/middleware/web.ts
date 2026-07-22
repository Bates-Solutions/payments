import {
  verifySignature,
  parseWebhookEvent,
  processWebhookEvent,
  getVerificationCode,
  SIGNATURE_HEADER,
} from '../webhook.js';
import type { WebhookConfig } from '../types.js';

/**
 * Create a framework-neutral Clover webhook handler on the Web platform.
 *
 * Takes a standard `Request` and returns a standard `Response` using only Web
 * APIs (WebCrypto verification, `request.text()`, `Response.json`). Runs on
 * Deno (`Deno.serve`), Cloudflare Workers, Bun, edge functions, and the Next.js
 * App Router.
 *
 * It also answers Clover's initial URL-verification handshake automatically:
 * an unsigned `{ verificationCode }` POST is echoed back with `200`.
 *
 * @example
 * ```typescript
 * import { createWebhookHandler } from '@bates-solutions/clover/server';
 *
 * const handler = createWebhookHandler({
 *   signingSecret: Deno.env.get('CLOVER_WEBHOOK_SECRET')!,
 *   handlers: {
 *     CHARGE: async (event) => { await fulfill(event); },
 *   },
 * });
 *
 * Deno.serve(handler);
 * ```
 */
export function createWebhookHandler(config: WebhookConfig) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    try {
      const rawBody = await request.text();
      const signature = request.headers.get(SIGNATURE_HEADER);

      if (!signature) {
        // Clover's URL-verification handshake carries no signature.
        const code = tryGetVerificationCode(rawBody);
        if (code) {
          return Response.json({ verificationCode: code }, { status: 200 });
        }
        return Response.json({ error: 'Missing signature header' }, { status: 400 });
      }

      const verification = await verifySignature(rawBody, signature, config.signingSecret, config);
      if (!verification.valid) {
        return Response.json({ error: verification.error }, { status: 400 });
      }

      const event = parseWebhookEvent(rawBody);
      await processWebhookEvent(event, config);

      return Response.json({ received: true }, { status: 200 });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : 'Webhook processing failed' },
        { status: 500 }
      );
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
