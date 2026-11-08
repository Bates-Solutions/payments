import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import type { Response } from 'express';
import { createExpressWebhookHandler, type StripeWebhookRequest } from '../express.js';

const SECRET = 'whsec_test';

function sign(payload: string): string {
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', SECRET).update(`${t}.${payload}`).digest('hex');
  return `t=${t},v1=${sig}`;
}

const BODY = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded', data: { object: { id: 'pi_1' } } });

function mockRes(): Response {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  } as unknown as Response;
  return res;
}

describe('createExpressWebhookHandler', () => {
  it('verifies and dispatches a valid webhook', async () => {
    const handler = vi.fn();
    const middleware = createExpressWebhookHandler({
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });

    const req = {
      body: Buffer.from(BODY),
      headers: { 'stripe-signature': sign(BODY) },
    } as unknown as StripeWebhookRequest;
    const res = mockRes();

    await middleware(req, res, vi.fn());

    expect(handler).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(req.stripeEvent?.id).toBe('evt_1');
  });

  it('rejects a missing signature with 400', async () => {
    const middleware = createExpressWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const req = { body: Buffer.from(BODY), headers: {} } as unknown as StripeWebhookRequest;
    const res = mockRes();

    await middleware(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects an invalid signature with 400', async () => {
    const middleware = createExpressWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const req = {
      body: Buffer.from(BODY),
      headers: { 'stripe-signature': 't=1,v1=deadbeef' },
    } as unknown as StripeWebhookRequest;
    const res = mockRes();

    await middleware(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 500 when a handler throws', async () => {
    const middleware = createExpressWebhookHandler({
      signingSecret: SECRET,
      handlers: {
        'payment_intent.succeeded': () => {
          throw new Error('handler boom');
        },
      },
    });
    const req = {
      body: Buffer.from(BODY),
      headers: { 'stripe-signature': sign(BODY) },
    } as unknown as StripeWebhookRequest;
    const res = mockRes();

    await middleware(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('reads a string body', async () => {
    const handler = vi.fn();
    const middleware = createExpressWebhookHandler({
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });
    const req = {
      body: BODY,
      headers: { 'stripe-signature': sign(BODY) },
    } as unknown as StripeWebhookRequest;

    await middleware(req, mockRes(), vi.fn());

    expect(handler).toHaveBeenCalledOnce();
  });

  it('calls next instead of responding when autoRespond is false', async () => {
    const next = vi.fn();
    const middleware = createExpressWebhookHandler({
      signingSecret: SECRET,
      handlers: {},
      autoRespond: false,
    });
    const req = {
      body: Buffer.from(BODY),
      headers: { 'stripe-signature': sign(BODY) },
    } as unknown as StripeWebhookRequest;

    await middleware(req, mockRes(), next);

    expect(next).toHaveBeenCalledOnce();
  });
});
