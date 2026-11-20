/**
 * Compile-only guard for the Lambda adapter config: `notificationUrl` is
 * required (Square signs `notificationUrl + body`, so a handler without it
 * never verifies a real delivery), and `signatureKey` takes one key or a list
 * during rotation.
 *
 * Type-checked via `tsconfig.type-tests.json`; never built or run.
 */
import { createLambdaWebhookHandler } from '../lambda.js';

// @ts-expect-error notificationUrl is required
createLambdaWebhookHandler({ signatureKey: 'key', handlers: {} });

createLambdaWebhookHandler({
  signatureKey: 'key',
  notificationUrl: 'https://example.com/webhook',
  handlers: {},
});

createLambdaWebhookHandler({
  signatureKey: ['new-key', 'old-key'],
  notificationUrl: 'https://example.com/webhook',
  handlers: {},
});
