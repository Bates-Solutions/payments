import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import { createLambdaWebhookHandler, type LambdaProxyEvent } from '../lambda.js';

const SECRET = 'whsec_test';

function sign(payload: string): string {
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', SECRET).update(`${t}.${payload}`).digest('hex');
  return `t=${t},v1=${sig}`;
}

const BODY = JSON.stringify({
  id: 'evt_1',
  type: 'payment_intent.succeeded',
  data: { object: { id: 'pi_1', customer: 'cus_1' } },
});

function proxyEvent(body: string | null, signature?: string): LambdaProxyEvent {
  return {
    httpMethod: 'POST',
    headers: signature ? { 'stripe-signature': signature } : {},
    body,
  };
}

describe('createLambdaWebhookHandler', () => {
  it('handles CORS preflight', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    const res = await handler({ httpMethod: 'OPTIONS', body: null });
    expect(res.statusCode).toBe(204);
  });

  it('verifies and dispatches with extracted context', async () => {
    const onEvent = vi.fn();
    const handler = createLambdaWebhookHandler({
      signingSecret: SECRET,
      logger: false,
      handlers: { 'payment_intent.succeeded': onEvent },
    });

    const res = await handler(proxyEvent(BODY, sign(BODY)));

    expect(res.statusCode).toBe(200);
    expect(onEvent).toHaveBeenCalledOnce();
    const context = onEvent.mock.calls[0][1] as { paymentIntentId?: string; customerId?: string };
    expect(context.paymentIntentId).toBe('pi_1');
    expect(context.customerId).toBe('cus_1');
  });

  it('returns 400 for a missing body', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    const res = await handler(proxyEvent(null, sign(BODY)));
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for an invalid signature', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    const res = await handler(proxyEvent(BODY, 't=1,v1=deadbeef'));
    expect(res.statusCode).toBe(400);
  });

  it('decodes a base64-encoded body', async () => {
    const onEvent = vi.fn();
    const handler = createLambdaWebhookHandler({
      signingSecret: SECRET,
      logger: false,
      handlers: { 'payment_intent.succeeded': onEvent },
    });

    const res = await handler({
      httpMethod: 'POST',
      headers: { 'stripe-signature': sign(BODY) },
      body: Buffer.from(BODY).toString('base64'),
      isBase64Encoded: true,
    });

    expect(res.statusCode).toBe(200);
    expect(onEvent).toHaveBeenCalledOnce();
  });

  it('returns 200 with success:false when a handler throws', async () => {
    const handler = createLambdaWebhookHandler({
      signingSecret: SECRET,
      logger: false,
      handlers: {
        'payment_intent.succeeded': () => {
          throw new Error('handler boom');
        },
      },
    });

    const res = await handler(proxyEvent(BODY, sign(BODY)));

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ success: false });
  });

  it('returns 400 for an invalid JSON body', async () => {
    const badBody = '{not json';
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac('sha256', SECRET).update(`${t}.${badBody}`).digest('hex');
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });

    const res = await handler(proxyEvent(badBody, `t=${t},v1=${sig}`));

    expect(res.statusCode).toBe(400);
  });

  it('invokes onUnhandledEvent when no handler matches', async () => {
    const onUnhandled = vi.fn();
    const handler = createLambdaWebhookHandler({
      signingSecret: SECRET,
      logger: false,
      handlers: {},
      onUnhandledEvent: onUnhandled,
    });

    await handler(proxyEvent(BODY, sign(BODY)));

    expect(onUnhandled).toHaveBeenCalledOnce();
  });
});
