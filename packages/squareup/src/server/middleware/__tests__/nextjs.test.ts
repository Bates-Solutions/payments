import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'crypto';
import {
  createNextWebhookHandler,
  createNextPagesWebhookHandler,
  parseNextWebhook,
} from '../nextjs.js';
import { SIGNATURE_HEADER } from '../../webhook.js';

// Helper to generate valid signature
function generateSignature(body: string, key: string, url?: string): string {
  const stringToSign = url ? url + body : body;
  return createHmac('sha256', key).update(stringToSign).digest('base64');
}

// Sample webhook event
const sampleEvent = {
  event_id: 'evt_123',
  merchant_id: 'M123',
  type: 'payment.created',
  created_at: '2025-01-03T00:00:00Z',
  data: {
    type: 'payment',
    id: 'PAY_123',
    object: { payment: { id: 'PAY_123', status: 'COMPLETED' } },
  },
};

// Mock Next.js Pages Request
function createMockPagesRequest(options: {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: string;
}) {
  const chunks = options.body ? [Buffer.from(options.body)] : [];
  let dataCallback: ((chunk: Buffer) => void) | null = null;
  let endCallback: (() => void) | null = null;
  let errorCallback: ((err: Error) => void) | null = null;

  const req = {
    method: options.method ?? 'POST',
    headers: options.headers ?? {},
    on: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
      if (event === 'data') dataCallback = callback as typeof dataCallback;
      if (event === 'end') endCallback = callback as typeof endCallback;
      if (event === 'error') errorCallback = callback as typeof errorCallback;
    }),
  };

  // Simulate async stream
  setTimeout(() => {
    chunks.forEach((chunk) => dataCallback?.(chunk));
    endCallback?.();
  }, 0);

  return req;
}

// Mock Next.js Pages Response
function createMockPagesResponse() {
  const jsonFn = vi.fn();
  const statusFn = vi.fn(() => ({ json: jsonFn }));
  return { status: statusFn, json: jsonFn, _jsonFn: jsonFn, _statusFn: statusFn };
}

describe('nextjs middleware', () => {
  const signatureKey = 'test-signature-key';
  const rawBody = JSON.stringify(sampleEvent);

  describe('createNextWebhookHandler', () => {
    it('should process valid webhook', async () => {
      const handler = vi.fn();
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        handlers: { 'payment.created': handler },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json).toEqual({ received: true, eventId: 'evt_123' });
      expect(handler).toHaveBeenCalled();
    });

    it('should return 401 for missing signature', async () => {
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json).toEqual({ error: 'Missing signature header' });
    });

    it('should return 401 for invalid signature', async () => {
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: 'invalid-signature' },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json).toEqual({ error: 'Invalid signature' });
    });

    it('should return 500 for handler errors', async () => {
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw new Error('Handler failed');
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json).toEqual({ error: 'Handler failed' });
    });

    it('should return 500 for non-Error exceptions', async () => {
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw 'string error';
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json).toEqual({ error: 'Webhook processing failed' });
    });

    it('should use notification URL for verification', async () => {
      const notificationUrl = 'https://example.com/webhook';
      const webhookHandler = createNextWebhookHandler({
        signatureKey,
        notificationUrl,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey, notificationUrl);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const response = await webhookHandler(request);
      expect(response.status).toBe(200);
    });
  });

  describe('createNextPagesWebhookHandler', () => {
    it('should process valid webhook', async () => {
      const handler = vi.fn();
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: { 'payment.created': handler },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockPagesRequest({
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(200);
      expect(res._jsonFn).toHaveBeenCalledWith({
        received: true,
        eventId: 'evt_123',
      });
      expect(handler).toHaveBeenCalled();
    });

    it('should return 405 for non-POST requests', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockPagesRequest({
        method: 'GET',
        headers: {},
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(405);
      expect(res._jsonFn).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });

    it('should return 401 for missing signature', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockPagesRequest({
        headers: {},
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(401);
      expect(res._jsonFn).toHaveBeenCalledWith({ error: 'Missing signature header' });
    });

    it('should handle array signature header', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockPagesRequest({
        headers: { [SIGNATURE_HEADER]: [signature, 'extra'] },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(200);
    });

    it('should return 401 for invalid signature', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockPagesRequest({
        headers: { [SIGNATURE_HEADER]: 'invalid' },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(401);
    });

    it('should return 500 for handler errors', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw new Error('Handler failed');
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockPagesRequest({
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(500);
      expect(res._jsonFn).toHaveBeenCalledWith({ error: 'Handler failed' });
    });

    it('should return 500 for non-Error exceptions', async () => {
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw 'string error';
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockPagesRequest({
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(500);
      expect(res._jsonFn).toHaveBeenCalledWith({
        error: 'Webhook processing failed',
      });
    });

    it('should use notification URL for verification', async () => {
      const notificationUrl = 'https://example.com/webhook';
      const webhookHandler = createNextPagesWebhookHandler({
        signatureKey,
        notificationUrl,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey, notificationUrl);
      const req = createMockPagesRequest({
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });
      const res = createMockPagesResponse();

      await webhookHandler(req, res);

      expect(res._statusFn).toHaveBeenCalledWith(200);
    });
  });

  describe('parseNextWebhook', () => {
    it('should parse and verify valid webhook', async () => {
      const signature = generateSignature(rawBody, signatureKey);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const event = await parseNextWebhook(request, signatureKey);

      expect(event.event_id).toBe('evt_123');
      expect(event.type).toBe('payment.created');
    });

    it('should throw for missing signature', async () => {
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        body: rawBody,
      });

      await expect(parseNextWebhook(request, signatureKey)).rejects.toThrow(
        'Missing signature header'
      );
    });

    it('should throw for invalid signature', async () => {
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: 'invalid' },
        body: rawBody,
      });

      await expect(parseNextWebhook(request, signatureKey)).rejects.toThrow(
        'Invalid signature'
      );
    });

    it('should use notification URL for verification', async () => {
      const notificationUrl = 'https://example.com/webhook';
      const signature = generateSignature(rawBody, signatureKey, notificationUrl);
      const request = new Request('http://localhost/webhook', {
        method: 'POST',
        headers: { [SIGNATURE_HEADER]: signature },
        body: rawBody,
      });

      const event = await parseNextWebhook(request, signatureKey, notificationUrl);

      expect(event.event_id).toBe('evt_123');
    });
  });
});
