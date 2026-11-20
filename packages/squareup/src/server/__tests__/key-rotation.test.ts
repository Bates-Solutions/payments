import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  verifySignature,
  parseAndVerifyWebhook,
  createWebhookProcessor,
  SIGNATURE_HEADER,
} from '../webhook.js';
import { verifySignatureAsync } from '../webcrypto.js';
import { createWebhookHandler } from '../middleware/web.js';
import { createExpressWebhookHandler } from '../middleware/express.js';
import type { ExpressResponseLike, SquareWebhookRequest } from '../middleware/express.js';
import { createNextWebhookHandler, parseNextWebhook } from '../middleware/nextjs.js';
import { createLambdaWebhookHandler } from '../middleware/lambda.js';

/**
 * Signature key rotation: while Square moves a subscription to a new key,
 * deliveries can be signed with either the old or the new one. Every verifier
 * accepts a list of keys and passes when any of them matches.
 */
const OLD_KEY = 'old-signature-key';
const NEW_KEY = 'new-signature-key';
const OTHER_KEY = 'unrelated-key';
const KEYS = [NEW_KEY, OLD_KEY];
const URL_ = 'https://example.com/webhook';
const BODY = JSON.stringify({
  event_id: 'evt_rotate',
  merchant_id: 'M123',
  type: 'payment.created',
  created_at: '2026-11-20T00:00:00Z',
  data: { type: 'payment', id: 'PAY_1', object: { payment: { id: 'PAY_1' } } },
});

function sign(key: string, body = BODY, url = URL_): string {
  return createHmac('sha256', key)
    .update(url + body)
    .digest('base64');
}

describe('verifySignature with several keys', () => {
  it.each([OLD_KEY, NEW_KEY])('accepts a signature made with %s', (key) => {
    expect(verifySignature(BODY, sign(key), KEYS, URL_)).toEqual({ valid: true });
  });

  it('rejects a signature made with neither key', () => {
    expect(verifySignature(BODY, sign(OTHER_KEY), KEYS, URL_)).toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('still accepts a single string key', () => {
    expect(verifySignature(BODY, sign(OLD_KEY), OLD_KEY, URL_)).toEqual({ valid: true });
    expect(verifySignature(BODY, sign(NEW_KEY), OLD_KEY, URL_).valid).toBe(false);
  });

  it('ignores empty keys and reports a list with none as a missing key', () => {
    expect(verifySignature(BODY, sign(OLD_KEY), ['', OLD_KEY], URL_)).toEqual({ valid: true });
    expect(verifySignature(BODY, sign(OLD_KEY), [], URL_)).toEqual({
      valid: false,
      error: 'Missing signature key',
    });
    expect(verifySignature(BODY, sign(OLD_KEY), ['', ''], URL_).error).toBe(
      'Missing signature key'
    );
  });
});

describe('verifySignatureAsync with several keys', () => {
  it.each([OLD_KEY, NEW_KEY])('accepts a signature made with %s', async (key) => {
    await expect(verifySignatureAsync(BODY, sign(key), KEYS, URL_)).resolves.toEqual({
      valid: true,
    });
  });

  it('rejects a signature made with neither key', async () => {
    await expect(verifySignatureAsync(BODY, sign(OTHER_KEY), KEYS, URL_)).resolves.toEqual({
      valid: false,
      error: 'Invalid signature',
    });
  });

  it('still accepts a single string key', async () => {
    await expect(verifySignatureAsync(BODY, sign(NEW_KEY), NEW_KEY, URL_)).resolves.toEqual({
      valid: true,
    });
  });

  it('reports a list with no keys as a missing key', async () => {
    await expect(verifySignatureAsync(BODY, sign(OLD_KEY), [''], URL_)).resolves.toEqual({
      valid: false,
      error: 'Missing signature key',
    });
  });

  it('agrees with verifySignature for every key', async () => {
    for (const key of [OLD_KEY, NEW_KEY, OTHER_KEY]) {
      const signature = sign(key);
      expect((await verifySignatureAsync(BODY, signature, KEYS, URL_)).valid).toBe(
        verifySignature(BODY, signature, KEYS, URL_).valid
      );
    }
  });
});

describe('helpers and adapters with several keys', () => {
  it('parseAndVerifyWebhook accepts the old key', () => {
    expect(parseAndVerifyWebhook(BODY, sign(OLD_KEY), KEYS, URL_).event.event_id).toBe(
      'evt_rotate'
    );
  });

  it('createWebhookProcessor dispatches for either key', async () => {
    const handler = vi.fn();
    const process = createWebhookProcessor({
      signatureKey: KEYS,
      notificationUrl: URL_,
      handlers: { 'payment.created': handler },
    });

    expect((await process(BODY, sign(OLD_KEY))).success).toBe(true);
    expect((await process(BODY, sign(NEW_KEY))).success).toBe(true);
    expect((await process(BODY, sign(OTHER_KEY))).success).toBe(false);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('the web handler accepts either key', async () => {
    const webhook = createWebhookHandler({
      signatureKey: KEYS,
      notificationUrl: URL_,
      handlers: {},
    });
    const post = (signature: string) =>
      webhook(
        new Request(URL_, {
          method: 'POST',
          body: BODY,
          headers: { [SIGNATURE_HEADER]: signature },
        })
      );

    expect((await post(sign(OLD_KEY))).status).toBe(200);
    expect((await post(sign(NEW_KEY))).status).toBe(200);
    expect((await post(sign(OTHER_KEY))).status).toBe(401);
  });

  it('the Next.js App Router handler and parseNextWebhook accept either key', async () => {
    const route = createNextWebhookHandler({
      signatureKey: KEYS,
      notificationUrl: URL_,
      handlers: {},
    });
    const request = (signature: string) =>
      new Request(URL_, { method: 'POST', body: BODY, headers: { [SIGNATURE_HEADER]: signature } });

    expect((await route(request(sign(OLD_KEY)))).status).toBe(200);
    expect((await route(request(sign(OTHER_KEY)))).status).toBe(401);
    await expect(parseNextWebhook(request(sign(NEW_KEY)), KEYS, URL_)).resolves.toMatchObject({
      event_id: 'evt_rotate',
    });
  });

  it('the Express handler accepts either key', async () => {
    const middleware = createExpressWebhookHandler({
      signatureKey: KEYS,
      notificationUrl: URL_,
      handlers: {},
    });
    const status = async (signature: string): Promise<unknown> => {
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const req = {
        body: Buffer.from(BODY),
        headers: { [SIGNATURE_HEADER]: signature },
        on: vi.fn(),
      } as unknown as SquareWebhookRequest;
      await middleware(req, res as unknown as ExpressResponseLike, vi.fn());
      return res.status.mock.calls[0]?.[0];
    };

    expect(await status(sign(OLD_KEY))).toBe(200);
    expect(await status(sign(NEW_KEY))).toBe(200);
    expect(await status(sign(OTHER_KEY))).toBe(401);
  });

  it('the Lambda handler accepts either key', async () => {
    const handler = createLambdaWebhookHandler({
      signatureKey: KEYS,
      notificationUrl: URL_,
      handlers: {},
      logger: false,
    });
    const invoke = (signature: string) =>
      handler({ httpMethod: 'POST', headers: { [SIGNATURE_HEADER]: signature }, body: BODY });

    expect((await invoke(sign(OLD_KEY))).statusCode).toBe(200);
    expect((await invoke(sign(NEW_KEY))).statusCode).toBe(200);
    expect((await invoke(sign(OTHER_KEY))).statusCode).toBe(401);
  });
});
