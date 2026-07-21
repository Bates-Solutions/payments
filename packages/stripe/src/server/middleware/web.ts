import { verifySignature, parseWebhookEvent, processWebhookEvent, SIGNATURE_HEADER } from '../webhook.js';
import type { WebhookConfig } from '../types.js';

/**
 * Create a framework-neutral webhook handler built on the Web platform.
 *
 * Takes a standard `Request` and returns a standard `Response`, using only Web
 * APIs (`request.text()`, WebCrypto verification, `Response.json`). It runs
 * unchanged on any runtime that speaks the Fetch API — Deno (`Deno.serve`),
 * Cloudflare Workers, Bun, Vercel/Netlify edge, and Next.js App Router.
 *
 * @param config - Webhook configuration
 * @returns An async handler: `(request: Request) => Promise<Response>`
 *
 * @example
 * ```typescript
 * // Supabase Edge Function / Deno
 * import { createWebhookHandler } from '@bates-solutions/stripe/server';
 *
 * const handler = createWebhookHandler({
 *   signingSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
 *   handlers: {
 *     'checkout.session.completed': async (event) => {
 *       await activateSubscription(event.data.object);
 *     },
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
        return Response.json({ error: 'Missing signature header' }, { status: 400 });
      }

      const verification = await verifySignature(rawBody, signature, config.signingSecret, config);
      if (!verification.valid) {
        return Response.json({ error: verification.error }, { status: 400 });
      }

      const event = parseWebhookEvent(rawBody);
      await processWebhookEvent(event, config);

      return Response.json({ received: true, eventId: event.id }, { status: 200 });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : 'Webhook processing failed' },
        { status: 500 }
      );
    }
  };
}
