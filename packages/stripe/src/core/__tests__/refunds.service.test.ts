import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { RefundsService } from '../services/refunds.service.js';
import { StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    refunds: {
      create: vi.fn(),
      retrieve: vi.fn(),
      list: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

describe('RefundsService', () => {
  describe('create', () => {
    it('creates a full refund for a payment intent', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 're_123', status: 'succeeded' }),
      });

      const service = new RefundsService(client);
      const result = await service.create({ paymentIntentId: 'pi_123' });

      expect(result.id).toBe('re_123');
      expect(client.refunds.create).toHaveBeenCalledWith(
        expect.objectContaining({ payment_intent: 'pi_123' }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('creates a partial refund with a reason', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 're_123' }),
      });

      const service = new RefundsService(client);
      await service.create({ chargeId: 'ch_123', amount: 500, reason: 'requested_by_customer' });

      expect(client.refunds.create).toHaveBeenCalledWith(
        expect.objectContaining({ charge: 'ch_123', amount: 500, reason: 'requested_by_customer' }),
        expect.anything()
      );
    });

    it('throws when neither payment nor charge is provided', async () => {
      const service = new RefundsService(createMockClient());
      await expect(service.create({})).rejects.toThrow(StripeValidationError);
    });

    it('throws for a non-positive amount', async () => {
      const service = new RefundsService(createMockClient());
      await expect(service.create({ paymentIntentId: 'pi_123', amount: 0 })).rejects.toThrow(
        StripeValidationError
      );
    });
  });

  describe('get', () => {
    it('retrieves a refund by ID', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ id: 're_123' }),
      });

      const service = new RefundsService(client);
      const result = await service.get('re_123');

      expect(result.id).toBe('re_123');
      expect(client.refunds.retrieve).toHaveBeenCalledWith('re_123');
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      const service = new RefundsService(client);
      await expect(service.get('re_missing')).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('lists refunds for a payment intent', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ data: [{ id: 're_1' }], has_more: false }),
      });

      const service = new RefundsService(client);
      const result = await service.list({ paymentIntentId: 'pi_123' });

      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBe('re_1');
      expect(client.refunds.list).toHaveBeenCalledWith({
        limit: undefined,
        payment_intent: 'pi_123',
        charge: undefined,
        starting_after: undefined,
      });
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 }),
      });
      const service = new RefundsService(client);
      await expect(service.list()).rejects.toThrow();
    });
  });

  describe('create errors', () => {
    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      const service = new RefundsService(client);
      await expect(service.create({ paymentIntentId: 'pi_1' })).rejects.toThrow();
    });
  });
});
