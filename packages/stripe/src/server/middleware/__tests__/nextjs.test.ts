import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import { Readable } from 'stream';
import { createNextWebhookHandler, createNextPagesWebhookHandler, parseNextWebhook } from '../nextjs.js';

const SECRET = 'whsec_test';

function sign(payload: string): string {
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac('sha256', SECRET).update(`${t}.${payload}`).digest('hex');
  return `t=${t},v1=${sig}`;
}

const BODY = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded', data: { object: { id: 'pi_1' } } });

function makeRequest(body: string, signature?: string): Request {
  return new Request('https://example.com/webhook', {
    method: 'POST',
    body,
    headers: signature ? { 'stripe-signature': signature } : {},
  });
}

describe('createNextWebhookHandler', () => {
  it('verifies and dispatches a valid webhook', async () => {
    const handler = vi.fn();
    const POST = createNextWebhookHandler({
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });

    const res = await POST(makeRequest(BODY, sign(BODY)));

    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('returns 400 when the signature is missing', async () => {
    const POST = createNextWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await POST(makeRequest(BODY));
    expect(res.status).toBe(400);
  });

  it('returns 400 when the signature is invalid', async () => {
    const POST = createNextWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await POST(makeRequest(BODY, 't=1,v1=deadbeef'));
    expect(res.status).toBe(400);
  });
});

function pagesReq(body: string, method = 'POST', signature?: string) {
  const stream = Readable.from([Buffer.from(body)]) as unknown as {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
  };
  stream.method = method;
  stream.headers = signature ? { 'stripe-signature': signature } : {};
  return stream;
}

function pagesRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { res: { status } as never, status, json };
}

describe('createNextPagesWebhookHandler', () => {
  it('verifies and dispatches a valid webhook', async () => {
    const handler = vi.fn();
    const api = createNextPagesWebhookHandler({
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });
    const { res, status } = pagesRes();

    await api(pagesReq(BODY, 'POST', sign(BODY)) as never, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('rejects non-POST with 405', async () => {
    const api = createNextPagesWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const { res, status } = pagesRes();
    await api(pagesReq(BODY, 'GET') as never, res);
    expect(status).toHaveBeenCalledWith(405);
  });

  it('rejects a missing signature with 400', async () => {
    const api = createNextPagesWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const { res, status } = pagesRes();
    await api(pagesReq(BODY, 'POST') as never, res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('rejects an invalid signature with 400', async () => {
    const api = createNextPagesWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const { res, status } = pagesRes();
    await api(pagesReq(BODY, 'POST', 't=1,v1=deadbeef') as never, res);
    expect(status).toHaveBeenCalledWith(400);
  });
});

describe('parseNextWebhook', () => {
  it('returns the parsed event when valid', async () => {
    const event = await parseNextWebhook(makeRequest(BODY, sign(BODY)), SECRET);
    expect(event.id).toBe('evt_1');
  });

  it('throws when the signature is missing', async () => {
    await expect(parseNextWebhook(makeRequest(BODY), SECRET)).rejects.toThrow('Missing signature header');
  });
});
