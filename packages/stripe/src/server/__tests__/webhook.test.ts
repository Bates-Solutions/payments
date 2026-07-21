import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import {
  SIGNATURE_HEADER,
  verifySignature,
  parseWebhookEvent,
  parseAndVerifyWebhook,
  processWebhookEvent,
  createWebhookProcessor,
  getPaymentIntentId,
  getChargeId,
  getCustomerId,
} from '../webhook.js';
import type { WebhookEvent } from '../types.js';

const SECRET = 'whsec_test_secret';

/**
 * Build a valid `stripe-signature` header for a payload.
 */
function sign(payload: string, secret = SECRET, timestamp = Math.floor(Date.now() / 1000)): string {
  const signature = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

function makeEvent(overrides: Partial<WebhookEvent> = {}): string {
  return JSON.stringify({
    id: 'evt_123',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_123' } },
    ...overrides,
  });
}

describe('constants', () => {
  it('uses the stripe-signature header', () => {
    expect(SIGNATURE_HEADER).toBe('stripe-signature');
  });
});

describe('verifySignature', () => {
  it('accepts a valid signature', () => {
    const body = makeEvent();
    const result = verifySignature(body, sign(body), SECRET);
    expect(result.valid).toBe(true);
  });

  it('rejects a tampered body', () => {
    const body = makeEvent();
    const header = sign(body);
    const result = verifySignature(body + 'x', header, SECRET);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid signature');
  });

  it('rejects a wrong secret', () => {
    const body = makeEvent();
    const result = verifySignature(body, sign(body), 'whsec_wrong');
    expect(result.valid).toBe(false);
  });

  it('reports missing inputs', () => {
    expect(verifySignature('', 'sig', SECRET).error).toBe('Missing request body');
    expect(verifySignature('body', '', SECRET).error).toBe('Missing signature header');
    expect(verifySignature('body', 'sig', '').error).toBe('Missing signing secret');
  });

  it('rejects a malformed header', () => {
    const result = verifySignature(makeEvent(), 'not-a-real-header', SECRET);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid signature header format');
  });

  it('rejects a timestamp outside the tolerance', () => {
    const body = makeEvent();
    const oldTimestamp = Math.floor(Date.now() / 1000) - 1000;
    const result = verifySignature(body, sign(body, SECRET, oldTimestamp), SECRET, { tolerance: 300 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Timestamp outside the tolerance zone');
  });

  it('skips the timestamp check when tolerance is 0', () => {
    const body = makeEvent();
    const oldTimestamp = Math.floor(Date.now() / 1000) - 100000;
    const result = verifySignature(body, sign(body, SECRET, oldTimestamp), SECRET, { tolerance: 0 });
    expect(result.valid).toBe(true);
  });
});

describe('parseWebhookEvent', () => {
  it('parses a valid payload', () => {
    const event = parseWebhookEvent(makeEvent());
    expect(event.type).toBe('payment_intent.succeeded');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseWebhookEvent('{not json')).toThrow('Invalid webhook payload');
  });
});

describe('parseAndVerifyWebhook', () => {
  it('returns the parsed event when valid', () => {
    const body = makeEvent();
    const { event } = parseAndVerifyWebhook(body, sign(body), SECRET);
    expect(event.id).toBe('evt_123');
  });

  it('throws when the signature is invalid', () => {
    const body = makeEvent();
    expect(() => parseAndVerifyWebhook(body, 'bad', SECRET)).toThrow();
  });
});

describe('processWebhookEvent', () => {
  it('calls the matching handler', async () => {
    const handler = vi.fn();
    await processWebhookEvent(parseWebhookEvent(makeEvent()), {
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does nothing when no handler is registered', async () => {
    await expect(
      processWebhookEvent(parseWebhookEvent(makeEvent()), { signingSecret: SECRET, handlers: {} })
    ).resolves.toBeUndefined();
  });
});

describe('createWebhookProcessor', () => {
  it('verifies, parses, and dispatches', async () => {
    const handler = vi.fn();
    const process = createWebhookProcessor({
      signingSecret: SECRET,
      handlers: { 'payment_intent.succeeded': handler },
    });

    const body = makeEvent();
    const result = await process(body, sign(body));

    expect(result.success).toBe(true);
    expect(result.event?.id).toBe('evt_123');
    expect(handler).toHaveBeenCalledOnce();
  });

  it('returns an error on an invalid signature', async () => {
    const process = createWebhookProcessor({ signingSecret: SECRET, handlers: {} });
    const result = await process(makeEvent(), 'bad');
    expect(result.success).toBe(false);
  });
});

describe('entity extractors', () => {
  it('extracts a payment intent id from a payment_intent event', () => {
    const event = parseWebhookEvent(makeEvent());
    expect(getPaymentIntentId(event)).toBe('pi_123');
  });

  it('extracts a payment intent id from a charge event', () => {
    const event = parseWebhookEvent(
      makeEvent({ type: 'charge.succeeded', data: { object: { id: 'ch_1', payment_intent: 'pi_9' } } } as never)
    );
    expect(getChargeId(event)).toBe('ch_1');
    expect(getPaymentIntentId(event)).toBe('pi_9');
  });

  it('extracts a customer id from the object', () => {
    const event = parseWebhookEvent(
      makeEvent({ data: { object: { id: 'pi_1', customer: 'cus_42' } } } as never)
    );
    expect(getCustomerId(event)).toBe('cus_42');
  });

  it('extracts a customer id from a customer event', () => {
    const event = parseWebhookEvent(
      makeEvent({ type: 'customer.created', data: { object: { id: 'cus_7' } } } as never)
    );
    expect(getCustomerId(event)).toBe('cus_7');
  });
});
