import { describe, it, expect, vi } from 'vitest';
import { createWebhookHandler } from '../web.js';

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

function request(body: string, signature?: string, method = 'POST'): Request {
  return new Request('https://edge.example/webhook', {
    method,
    body: method === 'POST' ? body : undefined,
    headers: signature ? { 'clover-signature': signature } : {},
  });
}

describe('createWebhookHandler (edge)', () => {
  it('verifies via WebCrypto and dispatches', async () => {
    const handler = vi.fn();
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: { CHARGE: handler } });
    const res = await webhook(request(BODY, await sign(BODY)));
    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('answers the verification handshake with 200 and echoes the code', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    const res = await webhook(request(JSON.stringify({ verificationCode: 'code_42' })));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ verificationCode: 'code_42' });
  });

  it('rejects non-POST with 405', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    expect((await webhook(request(BODY, undefined, 'GET'))).status).toBe(405);
  });

  it('returns 400 for a missing signature (non-handshake body)', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    expect((await webhook(request(BODY))).status).toBe(400);
  });

  it('returns 400 for an invalid signature', async () => {
    const webhook = createWebhookHandler({ signingSecret: SECRET, handlers: {} });
    expect((await webhook(request(BODY, 't=1,v1=deadbeef'))).status).toBe(400);
  });

  it('returns 500 when a handler throws', async () => {
    const webhook = createWebhookHandler({
      signingSecret: SECRET,
      handlers: {
        CHARGE: () => {
          throw new Error('boom');
        },
      },
    });
    expect((await webhook(request(BODY, await sign(BODY)))).status).toBe(500);
  });
});
