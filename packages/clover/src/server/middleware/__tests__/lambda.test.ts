import { describe, it, expect, vi } from 'vitest';
import { createLambdaWebhookHandler, type LambdaProxyEvent } from '../lambda.js';

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

function proxyEvent(body: string | null, signature?: string): LambdaProxyEvent {
  return { httpMethod: 'POST', headers: signature ? { 'clover-signature': signature } : {}, body };
}

describe('createLambdaWebhookHandler', () => {
  it('handles CORS preflight', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    expect((await handler({ httpMethod: 'OPTIONS', body: null })).statusCode).toBe(204);
  });

  it('verifies and dispatches', async () => {
    const onEvent = vi.fn();
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, logger: false, handlers: { CHARGE: onEvent } });
    const res = await handler(proxyEvent(BODY, await sign(BODY)));
    expect(res.statusCode).toBe(200);
    expect(onEvent).toHaveBeenCalledOnce();
  });

  it('answers the verification handshake', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    const res = await handler(proxyEvent(JSON.stringify({ verificationCode: 'c9' })));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ verificationCode: 'c9' });
  });

  it('returns 400 for a missing body / invalid signature', async () => {
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: {}, logger: false });
    expect((await handler(proxyEvent(null, await sign(BODY)))).statusCode).toBe(400);
    expect((await handler(proxyEvent(BODY, 't=1,v1=deadbeef'))).statusCode).toBe(400);
  });

  it('decodes a base64 body', async () => {
    const onEvent = vi.fn();
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, logger: false, handlers: { CHARGE: onEvent } });
    const res = await handler({
      httpMethod: 'POST',
      headers: { 'clover-signature': await sign(BODY) },
      body: Buffer.from(BODY).toString('base64'),
      isBase64Encoded: true,
    });
    expect(res.statusCode).toBe(200);
    expect(onEvent).toHaveBeenCalledOnce();
  });

  it('works with the default console logger', async () => {
    const onEvent = vi.fn();
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const handler = createLambdaWebhookHandler({ signingSecret: SECRET, handlers: { CHARGE: onEvent } });
    const res = await handler(proxyEvent(BODY, await sign(BODY)));
    expect(res.statusCode).toBe(200);
    expect(infoSpy).toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it('returns 200 with success:false when a handler throws', async () => {
    const handler = createLambdaWebhookHandler({
      signingSecret: SECRET,
      logger: false,
      handlers: {
        CHARGE: () => {
          throw new Error('boom');
        },
      },
    });
    const res = await handler(proxyEvent(BODY, await sign(BODY)));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ success: false });
  });
});
