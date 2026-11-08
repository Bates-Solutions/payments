import { verifySignature, parseWebhookEvent, processWebhookEvent, SIGNATURE_HEADER } from '../webhook.js';
import { createWebhookHandler } from './web.js';
import type { WebhookConfig, WebhookEvent, VerifyOptions } from '../types.js';

/**
 * Response type for Next.js webhook handlers.
 */
export interface WebhookResponse {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Node.js readable stream interface for raw body reading.
 */
interface NodeReadable {
  on(event: 'data', listener: (chunk: Buffer) => void): void;
  on(event: 'end', listener: () => void): void;
  on(event: 'error', listener: (err: Error) => void): void;
}

/**
 * Next.js Pages Router request type.
 */
interface NextPagesRequest extends NodeReadable {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

/**
 * Next.js Pages Router response type.
 */
interface NextPagesResponse {
  status: (code: number) => { json: (body: unknown) => void };
}

/**
 * Create a Next.js App Router webhook handler.
 *
 * @param config - Webhook configuration
 * @returns A route handler for POST requests
 *
 * @example
 * ```typescript
 * // app/api/webhook/route.ts
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
export function createNextWebhookHandler(
  config: WebhookConfig
): (request: Request) => Promise<Response> {
  // The App Router speaks the Web platform, so reuse the framework-neutral handler.
  return createWebhookHandler(config);
}

/**
 * Create a Next.js Pages Router API handler.
 *
 * @param config - Webhook configuration
 * @returns An API route handler
 *
 * @example
 * ```typescript
 * // pages/api/webhook.ts
 * import { createNextPagesWebhookHandler } from '@bates-solutions/stripe/server';
 *
 * export const config = {
 *   api: { bodyParser: false }, // Required for raw body
 * };
 *
 * export default createNextPagesWebhookHandler({
 *   signingSecret: process.env.STRIPE_WEBHOOK_SECRET!,
 *   handlers: {
 *     'payment_intent.succeeded': async (event) => {
 *       console.log('Paid:', event.data.object.id);
 *     },
 *   },
 * });
 * ```
 */
export function createNextPagesWebhookHandler(
  config: WebhookConfig
): (req: NextPagesRequest, res: NextPagesResponse) => Promise<void> {
  return async (req: NextPagesRequest, res: NextPagesResponse): Promise<void> => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const rawBody = await getRawBody(req);

      const signatureHeader = req.headers[SIGNATURE_HEADER];
      const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

      if (!signature) {
        res.status(400).json({ error: 'Missing signature header' });
        return;
      }

      const verification = await verifySignature(rawBody, signature, config.signingSecret, config);

      if (!verification.valid) {
        res.status(400).json({ error: verification.error });
        return;
      }

      const event = parseWebhookEvent(rawBody);
      await processWebhookEvent(event, config);

      res.status(200).json({ received: true, eventId: event.id });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      });
    }
  };
}

/**
 * Read the raw body from a Node.js request stream.
 */
function getRawBody(req: NodeReadable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

/**
 * Verify and parse a webhook event from a Next.js request.
 *
 * Use this when you want custom handling instead of automatic processing.
 *
 * @param request - The incoming request
 * @param signingSecret - Your webhook signing secret
 * @param options - Verification options
 * @returns The parsed webhook event
 * @throws Error if verification fails
 *
 * @example
 * ```typescript
 * // app/api/webhook/route.ts
 * import { parseNextWebhook } from '@bates-solutions/stripe/server';
 *
 * export async function POST(request: Request) {
 *   const event = await parseNextWebhook(request, process.env.STRIPE_WEBHOOK_SECRET!);
 *   switch (event.type) {
 *     case 'payment_intent.succeeded':
 *       // ...
 *   }
 *   return Response.json({ received: true });
 * }
 * ```
 */
export async function parseNextWebhook(
  request: Request,
  signingSecret: string,
  options?: VerifyOptions
): Promise<WebhookEvent> {
  const rawBody = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER);

  if (!signature) {
    throw new Error('Missing signature header');
  }

  const verification = await verifySignature(rawBody, signature, signingSecret, options);

  if (!verification.valid) {
    throw new Error(verification.error ?? 'Signature verification failed');
  }

  return parseWebhookEvent(rawBody);
}
