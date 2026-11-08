import { describe, it, expect, vi } from 'vitest';
import {
  SIGNATURE_HEADER,
  verifySignature,
  parseWebhookEvent,
  parseAndVerifyWebhook,
  processWebhookEvent,
  createWebhookProcessor,
  getVerificationCode,
} from '../webhook.js';

const SECRET = 'whsec_clover';

async function sign(payload: string, secret = SECRET, timestamp = Math.floor(Date.now() / 1000)): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `t=${timestamp},v1=${hex}`;
}

const BODY = JSON.stringify({ type: 'CHARGE', data: { id: 'CHG_1' } });

describe('constants', () => {
  it('uses the clover-signature header', () => {
    expect(SIGNATURE_HEADER).toBe('clover-signature');
  });
});

describe('verifySignature', () => {
  it('accepts a valid signature', async () => {
    const result = await verifySignature(BODY, await sign(BODY), SECRET);
    expect(result.valid).toBe(true);
  });

  it('rejects a tampered body', async () => {
    const header = await sign(BODY);
    const result = await verifySignature(BODY + 'x', header, SECRET);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid signature');
  });

  it('rejects a wrong secret', async () => {
    const result = await verifySignature(BODY, await sign(BODY), 'nope');
    expect(result.valid).toBe(false);
  });

  it('reports missing inputs', async () => {
    expect((await verifySignature('', 'sig', SECRET)).error).toBe('Missing request body');
    expect((await verifySignature('b', '', SECRET)).error).toBe('Missing signature header');
    expect((await verifySignature('b', 'sig', '')).error).toBe('Missing signing secret');
  });

  it('rejects a stale timestamp and honors tolerance:0', async () => {
    const old = Math.floor(Date.now() / 1000) - 1000;
    expect((await verifySignature(BODY, await sign(BODY, SECRET, old), SECRET, { tolerance: 300 })).valid).toBe(false);
    expect((await verifySignature(BODY, await sign(BODY, SECRET, old), SECRET, { tolerance: 0 })).valid).toBe(true);
  });
});

describe('parseAndVerifyWebhook', () => {
  it('returns the parsed event when valid', async () => {
    const { event } = await parseAndVerifyWebhook(BODY, await sign(BODY), SECRET);
    expect(event.type).toBe('CHARGE');
  });
  it('throws when invalid', async () => {
    await expect(parseAndVerifyWebhook(BODY, 'bad', SECRET)).rejects.toThrow();
  });
});

describe('processWebhookEvent', () => {
  it('dispatches to the handler for the event type', async () => {
    const handler = vi.fn();
    await processWebhookEvent(parseWebhookEvent(BODY), { signingSecret: SECRET, handlers: { CHARGE: handler } });
    expect(handler).toHaveBeenCalledOnce();
  });
  it('does nothing when the event has no type', async () => {
    const handler = vi.fn();
    await processWebhookEvent({ data: {} }, { signingSecret: SECRET, handlers: { CHARGE: handler } });
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('createWebhookProcessor', () => {
  it('verifies, parses, and dispatches', async () => {
    const handler = vi.fn();
    const process = createWebhookProcessor({ signingSecret: SECRET, handlers: { CHARGE: handler } });
    const result = await process(BODY, await sign(BODY));
    expect(result.success).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('never dispatches a forged event, even with throwOnInvalidSignature:false', async () => {
    const handler = vi.fn();
    const process = createWebhookProcessor({
      signingSecret: SECRET,
      throwOnInvalidSignature: false,
      handlers: { CHARGE: handler },
    });
    const result = await process(BODY, 'bad');
    expect(result.success).toBe(false);
    expect(result.event).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('getVerificationCode', () => {
  it('reads the handshake verification code', () => {
    expect(getVerificationCode({ verificationCode: 'abc123' })).toBe('abc123');
    expect(getVerificationCode({ type: 'CHARGE' })).toBeUndefined();
  });
});
