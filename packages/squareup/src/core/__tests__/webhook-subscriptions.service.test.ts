import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { WebhookSubscriptionsService } from '../services/webhook-subscriptions.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    webhooks: {
      subscriptions: {
        create: vi.fn(),
        list: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        test: vi.fn(),
        updateSignatureKey: vi.fn(),
        ...overrides,
      },
    },
  } as unknown as SquareClient;
}

const validCreate = {
  name: 'platform-events',
  eventTypes: ['payment.updated', 'order.updated'],
  notificationUrl: 'https://api.example.com/webhook',
};

describe('WebhookSubscriptionsService', () => {
  describe('create', () => {
    it('creates a subscription and surfaces the signature key', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({
          subscription: { id: 'wbhk_1', name: 'platform-events', signatureKey: 'sig_abc' },
        }),
      });

      const service = new WebhookSubscriptionsService(client);
      const result = await service.create(validCreate);

      expect(result.signatureKey).toBe('sig_abc');
      const subs = client.webhooks.subscriptions;
      expect(subs.create).toHaveBeenCalledWith(
        expect.objectContaining({
          idempotencyKey: expect.any(String),
          subscription: expect.objectContaining({
            name: 'platform-events',
            eventTypes: ['payment.updated', 'order.updated'],
            notificationUrl: 'https://api.example.com/webhook',
            enabled: true,
          }),
        })
      );
    });

    it('throws for a missing name', async () => {
      const service = new WebhookSubscriptionsService(createMockClient());
      await expect(service.create({ ...validCreate, name: '' })).rejects.toThrow(SquareValidationError);
    });

    it('throws for a missing notificationUrl', async () => {
      const service = new WebhookSubscriptionsService(createMockClient());
      await expect(service.create({ ...validCreate, notificationUrl: '' })).rejects.toThrow(
        SquareValidationError
      );
    });

    it('throws for empty eventTypes', async () => {
      const service = new WebhookSubscriptionsService(createMockClient());
      await expect(service.create({ ...validCreate, eventTypes: [] })).rejects.toThrow(
        SquareValidationError
      );
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });
      await expect(new WebhookSubscriptionsService(client).create(validCreate)).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('unwraps the pager response and returns data + cursor', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { subscriptions: [{ id: 'wbhk_1' }, { id: 'wbhk_2' }], cursor: 'next' },
        }),
      });

      const service = new WebhookSubscriptionsService(client);
      const result = await service.list({ includeDisabled: true });

      expect(result.data).toHaveLength(2);
      expect(result.cursor).toBe('next');
      expect(client.webhooks.subscriptions.list).toHaveBeenCalledWith(
        expect.objectContaining({ includeDisabled: true })
      );
    });

    it('returns an empty array when none present', async () => {
      const client = createMockClient({ list: vi.fn().mockResolvedValue({ response: {} }) });
      const result = await new WebhookSubscriptionsService(client).list();
      expect(result.data).toEqual([]);
      expect(result.cursor).toBeUndefined();
    });
  });

  describe('get / update / delete', () => {
    it('gets a subscription', async () => {
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ subscription: { id: 'wbhk_1' } }),
      });
      const result = await new WebhookSubscriptionsService(client).get('wbhk_1');
      expect(result.id).toBe('wbhk_1');
      expect(client.webhooks.subscriptions.get).toHaveBeenCalledWith({ subscriptionId: 'wbhk_1' });
    });

    it('throws when a subscription is not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });
      await expect(new WebhookSubscriptionsService(client).get('x')).rejects.toThrow(
        'Webhook subscription not found'
      );
    });

    it('updates a subscription', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ subscription: { id: 'wbhk_1', enabled: false } }),
      });
      const result = await new WebhookSubscriptionsService(client).update('wbhk_1', { enabled: false });
      expect(result.enabled).toBe(false);
      expect(client.webhooks.subscriptions.update).toHaveBeenCalledWith(
        expect.objectContaining({ subscriptionId: 'wbhk_1', subscription: expect.objectContaining({ enabled: false }) })
      );
    });

    it('deletes a subscription', async () => {
      const client = createMockClient({ delete: vi.fn().mockResolvedValue({}) });
      await new WebhookSubscriptionsService(client).delete('wbhk_1');
      expect(client.webhooks.subscriptions.delete).toHaveBeenCalledWith({ subscriptionId: 'wbhk_1' });
    });
  });

  describe('test', () => {
    it('sends a test event and returns the result', async () => {
      const client = createMockClient({
        test: vi.fn().mockResolvedValue({ subscriptionTestResult: { id: 'test_1', statusCode: 200 } }),
      });
      const result = await new WebhookSubscriptionsService(client).test('wbhk_1', {
        eventType: 'payment.created',
      });
      expect(result.statusCode).toBe(200);
      expect(client.webhooks.subscriptions.test).toHaveBeenCalledWith({
        subscriptionId: 'wbhk_1',
        eventType: 'payment.created',
      });
    });
  });

  describe('rotateSignatureKey', () => {
    it('rotates and returns a new signature key', async () => {
      const client = createMockClient({
        updateSignatureKey: vi.fn().mockResolvedValue({ signatureKey: 'sig_new' }),
      });
      const result = await new WebhookSubscriptionsService(client).rotateSignatureKey('wbhk_1');
      expect(result.signatureKey).toBe('sig_new');
      expect(client.webhooks.subscriptions.updateSignatureKey).toHaveBeenCalledWith(
        expect.objectContaining({ subscriptionId: 'wbhk_1', idempotencyKey: expect.any(String) })
      );
    });
  });
});
