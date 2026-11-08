import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import { createExpressWebhookHandler, type CloverWebhookRequest } from '../express.js';

const SECRET = 'whsec_clover';

async function sign(payload: string): Promise<string> {
  const t = Math.floor(Date.now() / 1000);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `t=${t},v1=${hex}`;
}

const BODY = JSON.stringify({ type: 'CHARGE', data: { id: 'CHG_1' } });

function mockRes(): Response {
  const res = { status: vi.fn(() => res), json: vi.fn(() => res) } as unknown as Response;
  return res;
}

describe('createExpressWebhookHandler', () => {
  it('verifies and dispatches a valid webhook', async () => {
    const handler = vi.fn();
    const mw = createExpressWebhookHandler({ signingSecret: SECRET, handlers: { CHARGE: handler } });
    const req = { body: Buffer.from(BODY), headers: { 'clover-signature': await sign(BODY) } } as unknown as CloverWebhookRequest;
    const res = mockRes();

    await mw(req, res, vi.fn());

    expect(handler).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(req.cloverEvent?.type).toBe('CHARGE');
  });

  it('answers the verification handshake with 200', async () => {
    const mw = createExpressWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const req = { body: Buffer.from(JSON.stringify({ verificationCode: 'c1' })), headers: {} } as unknown as CloverWebhookRequest;
    const res = mockRes();

    await mw(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ verificationCode: 'c1' });
  });

  it('rejects an invalid signature with 400', async () => {
    const mw = createExpressWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const req = { body: Buffer.from(BODY), headers: { 'clover-signature': 't=1,v1=deadbeef' } } as unknown as CloverWebhookRequest;
    const res = mockRes();

    await mw(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for a missing signature on a non-handshake body', async () => {
    const mw = createExpressWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const req = { body: Buffer.from(BODY), headers: {} } as unknown as CloverWebhookRequest;
    const res = mockRes();
    await mw(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('reads a string body and calls next when autoRespond is false', async () => {
    const handler = vi.fn();
    const next = vi.fn();
    const mw = createExpressWebhookHandler({
      signingSecret: SECRET,
      autoRespond: false,
      handlers: { CHARGE: handler },
    });
    const req = { body: BODY, headers: { 'clover-signature': await sign(BODY) } } as unknown as CloverWebhookRequest;
    await mw(req, mockRes(), next);
    expect(handler).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 500 when a handler throws', async () => {
    const mw = createExpressWebhookHandler({
      signingSecret: SECRET,
      handlers: {
        CHARGE: () => {
          throw new Error('boom');
        },
      },
    });
    const req = { body: Buffer.from(BODY), headers: { 'clover-signature': await sign(BODY) } } as unknown as CloverWebhookRequest;
    const res = mockRes();

    await mw(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
