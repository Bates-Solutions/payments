import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import { createLambdaWebhookHandler } from '../lambda.js';
import type { LambdaProxyEvent } from '../lambda.js';

function generateSignature(body: string, key: string, url?: string): string {
  const stringToSign = url ? url + body : body;
  return createHmac('sha256', key).update(stringToSign).digest('base64');
}

const signatureKey = 'test-key';

const samplePaymentEvent = {
  event_id: 'evt_123',
  merchant_id: 'M123',
  type: 'payment.completed',
  created_at: '2025-01-03T00:00:00Z',
  data: {
    type: 'payment',
    id: 'PAY_123',
    object: { payment: { id: 'PAY_123', order_id: 'ORD_456', customer_id: 'CUST_789', status: 'COMPLETED' } },
  },
};

const rawBody = JSON.stringify(samplePaymentEvent);

function createEvent(overrides: Partial<LambdaProxyEvent> = {}): LambdaProxyEvent {
  return {
    httpMethod: 'POST',
    headers: {
      'x-square-hmacsha256-signature': generateSignature(rawBody, signatureKey),
      'Content-Type': 'application/json',
    },
    body: rawBody,
    ...overrides,
  };
}

describe('createLambdaWebhookHandler', () => {
  it('should handle OPTIONS preflight', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({ httpMethod: 'OPTIONS', body: null }));

    expect(result.statusCode).toBe(204);
    expect(result.headers['Access-Control-Allow-Methods']).toContain('POST');
  });

  it('should return 401 for missing signature', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({ headers: {} }));

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).error).toBe('Missing signature header');
  });

  it('should return 400 for missing body', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({ body: null }));

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('Missing request body');
  });

  it('should handle null headers gracefully', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler({ httpMethod: 'POST', headers: null, body: rawBody });

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).error).toBe('Missing signature header');
  });

  it('should return 400 for malformed JSON body', async () => {
    const badBody = 'not-json';
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({
      body: badBody,
      headers: {
        'x-square-hmacsha256-signature': generateSignature(badBody, signatureKey),
      },
    }));

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toContain('Invalid webhook payload');
  });

  it('should return 401 for invalid signature', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({
      headers: { 'x-square-hmacsha256-signature': 'invalid' },
    }));

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).error).toBe('Invalid signature');
  });

  it('should process valid webhook and call handler', async () => {
    const paymentHandler = vi.fn();
    const handler = createLambdaWebhookHandler({
      signatureKey,
      handlers: { 'payment.completed': paymentHandler },
    });

    const result = await handler(createEvent());

    expect(result.statusCode).toBe(200);
    expect(paymentHandler).toHaveBeenCalled();
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.eventId).toBe('evt_123');
  });

  it('should extract entity IDs into response', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent());

    const body = JSON.parse(result.body);
    expect(body.paymentId).toBe('PAY_123');
    expect(body.orderId).toBe('ORD_456');
    expect(body.customerId).toBe('CUST_789');
  });

  it('should pass context with entity IDs to handler', async () => {
    const paymentHandler = vi.fn();
    const handler = createLambdaWebhookHandler({
      signatureKey,
      handlers: { 'payment.completed': paymentHandler },
    });

    await handler(createEvent());

    expect(paymentHandler).toHaveBeenCalledWith(
      expect.objectContaining({ event_id: 'evt_123' }),
      expect.objectContaining({
        paymentId: 'PAY_123',
        orderId: 'ORD_456',
        customerId: 'CUST_789',
      })
    );
  });

  it('should return 200 on handler errors', async () => {
    const handler = createLambdaWebhookHandler({
      signatureKey,
      handlers: {
        'payment.completed': () => { throw new Error('Handler failed'); },
      },
    });

    const result = await handler(createEvent());

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Handler failed');
  });

  it('should handle base64 encoded body', async () => {
    const base64Body = Buffer.from(rawBody).toString('base64');
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({
      body: base64Body,
      isBase64Encoded: true,
      headers: {
        'x-square-hmacsha256-signature': generateSignature(rawBody, signatureKey),
      },
    }));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).success).toBe(true);
  });

  it('should normalize header case', async () => {
    const handler = createLambdaWebhookHandler({ signatureKey, handlers: {} });
    const result = await handler(createEvent({
      headers: {
        'X-Square-Hmacsha256-Signature': generateSignature(rawBody, signatureKey),
      },
    }));

    expect(result.statusCode).toBe(200);
  });

  it('should use custom CORS headers', async () => {
    const handler = createLambdaWebhookHandler({
      signatureKey,
      handlers: {},
      corsHeaders: { 'Access-Control-Allow-Origin': 'https://example.com' },
    });

    const result = await handler(createEvent({ httpMethod: 'OPTIONS', body: null }));

    expect(result.headers['Access-Control-Allow-Origin']).toBe('https://example.com');
  });

  it('should support notification URL for verification', async () => {
    const notificationUrl = 'https://example.com/webhook';
    const handler = createLambdaWebhookHandler({
      signatureKey,
      handlers: {},
      notificationUrl,
    });

    // Signature without URL should fail
    const result1 = await handler(createEvent());
    expect(result1.statusCode).toBe(401);

    // Signature with URL should succeed
    const result2 = await handler(createEvent({
      headers: {
        'x-square-hmacsha256-signature': generateSignature(rawBody, signatureKey, notificationUrl),
      },
    }));
    expect(result2.statusCode).toBe(200);
  });
});
