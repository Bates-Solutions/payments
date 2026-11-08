import { describe, it, expect, vi } from 'vitest';
import { createWebhookHandler } from '../web.js';

const SECRET = 'whsec_test';

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

const BODY = JSON.stringify({
  id: 'evt_1',
  type: 'checkout.session.completed',
  data: { object: { id: 'cs_1', subscription: 'sub_1' } },
});

function request(body: string, signature?: string, method = 'POST'): Request {
  return new Request('https://edge.example/webhook', {
    method,
    body: method === 'POST' ? body : undefined,
    headers: signature ? { 'stripe-signature': signature } : {},
  });
}

describe('createWebhookHandler (edge)', () => {
  it('verifies via WebCrypto and dispatches', async () => {
    const handler = vi.fn();
    const webhook = createWebhookHandler({
      signingSecret: SECRET,
      handlers: { 'checkout.session.completed': handler },
    });

    const res = await webhook(request(BODY, await sign(BODY)));

    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('rejects non-POST with 405', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await webhook(request(BODY, undefined, 'GET'));
    expect(res.status).toBe(405);
  });

  it('returns 400 for a missing signature', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await webhook(request(BODY));
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid signature', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await webhook(request(BODY, 't=1,v1=deadbeef'));
    expect(res.status).toBe(400);
  });

  it('returns 500 when a handler throws', async () => {
    const webhook = createWebhookHandler({
      signingSecret: SECRET,
      handlers: {
        'checkout.session.completed': () => {
          throw new Error('boom');
        },
      },
    });
    const res = await webhook(request(BODY, await sign(BODY)));
    expect(res.status).toBe(500);
  });
});
