import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHmac } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { createExpressWebhookHandler, rawBodyMiddleware } from '../express.js';
import type { SquareWebhookRequest } from '../express.js';
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

// Mock response helper
function createMockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

// Mock request helper
function createMockRequest(options: {
  body?: unknown;
  rawBody?: string;
  headers?: Record<string, string | string[] | undefined>;
}): SquareWebhookRequest {
  return {
    body: options.body,
    rawBody: options.rawBody,
    headers: options.headers ?? {},
    on: vi.fn(),
  } as unknown as SquareWebhookRequest;
}

describe('express middleware', () => {
  const signatureKey = 'test-signature-key';
  const rawBody = JSON.stringify(sampleEvent);

  describe('createExpressWebhookHandler', () => {
    let mockRes: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
      mockRes = createMockResponse();
      mockNext = vi.fn();
    });

    it('should process valid webhook with Buffer body', async () => {
      const handler = vi.fn();
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: { 'payment.created': handler },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        received: true,
        eventId: 'evt_123',
      });
      expect(handler).toHaveBeenCalled();
      expect(req.squareEvent).toBeDefined();
      expect(req.rawBody).toBe(rawBody);
    });

    it('should process valid webhook with string body', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockRequest({
        body: rawBody,
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should process valid webhook with rawBody property', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockRequest({
        body: undefined,
        rawBody,
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle parsed JSON body by stringifying', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      // Generate signature for stringified body
      const body = sampleEvent;
      const bodyString = JSON.stringify(body);
      const signature = generateSignature(bodyString, signatureKey);
      const req = createMockRequest({
        body,
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 for missing signature header', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: {},
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Missing or invalid signature header',
      });
    });

    it('should return 401 for array signature header', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: ['sig1', 'sig2'] },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 for invalid signature', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {},
      });

      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: 'invalid-signature' },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid signature',
      });
    });

    it('should return 500 for handler errors', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw new Error('Handler failed');
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Handler failed' });
    });

    it('should return 500 for non-Error exceptions', async () => {
      const middleware = createExpressWebhookHandler({
        signatureKey,
        handlers: {
          'payment.created': () => {
            throw 'string error';
          },
        },
      });

      const signature = generateSignature(rawBody, signatureKey);
      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Webhook processing failed',
      });
    });

    describe('with autoRespond: false', () => {
      it('should call next() on success', async () => {
        const middleware = createExpressWebhookHandler({
          signatureKey,
          handlers: {},
          autoRespond: false,
        });

        const signature = generateSignature(rawBody, signatureKey);
        const req = createMockRequest({
          body: Buffer.from(rawBody),
          headers: { [SIGNATURE_HEADER]: signature },
        });

        await middleware(req, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(mockRes.status).not.toHaveBeenCalled();
      });

      it('should throw for missing signature', async () => {
        const middleware = createExpressWebhookHandler({
          signatureKey,
          handlers: {},
          autoRespond: false,
        });

        const req = createMockRequest({
          body: Buffer.from(rawBody),
          headers: {},
        });

        await middleware(req, mockRes, mockNext);

        expect(mockNext).not.toHaveBeenCalledWith();
      });

      it('should call next(error) for handler errors', async () => {
        const middleware = createExpressWebhookHandler({
          signatureKey,
          handlers: {
            'payment.created': () => {
              throw new Error('Handler failed');
            },
          },
          autoRespond: false,
        });

        const signature = generateSignature(rawBody, signatureKey);
        const req = createMockRequest({
          body: Buffer.from(rawBody),
          headers: { [SIGNATURE_HEADER]: signature },
        });

        await middleware(req, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('should use notification URL for signature verification', async () => {
      const notificationUrl = 'https://example.com/webhook';
      const middleware = createExpressWebhookHandler({
        signatureKey,
        notificationUrl,
        handlers: {},
      });

      const signature = generateSignature(rawBody, signatureKey, notificationUrl);
      const req = createMockRequest({
        body: Buffer.from(rawBody),
        headers: { [SIGNATURE_HEADER]: signature },
      });

      await middleware(req, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('rawBodyMiddleware', () => {
    it('should capture raw body from stream', async () => {
      const mockNext = vi.fn();
      const chunks = [Buffer.from('{"test":'), Buffer.from('"value"}')];
      let dataCallback: (chunk: Buffer) => void;
      let endCallback: () => void;

      const req = {
        on: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
          if (event === 'data') dataCallback = callback as typeof dataCallback;
          if (event === 'end') endCallback = callback as typeof endCallback;
        }),
      } as unknown as SquareWebhookRequest;

      const res = createMockResponse();

      rawBodyMiddleware(req, res, mockNext);

      // Simulate stream data
      chunks.forEach((chunk) => dataCallback(chunk));
      endCallback();

      expect(req.rawBody).toBe('{"test":"value"}');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle stream errors', async () => {
      const mockNext = vi.fn();
      let errorCallback: (err: Error) => void;

      const req = {
        on: vi.fn((event: string, callback: (...args: unknown[]) => void) => {
          if (event === 'error') errorCallback = callback as typeof errorCallback;
        }),
      } as unknown as SquareWebhookRequest;

      const res = createMockResponse();

      rawBodyMiddleware(req, res, mockNext);

      // Simulate stream error
      const error = new Error('Stream error');
      errorCallback(error);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
