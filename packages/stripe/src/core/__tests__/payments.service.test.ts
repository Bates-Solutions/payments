import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { PaymentsService } from '../services/payments.service.js';
import { StripeValidationError, StripePaymentError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
      capture: vi.fn(),
      cancel: vi.fn(),
      list: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

describe('PaymentsService', () => {
  describe('create', () => {
    it('creates a payment successfully', async () => {
      const mockPayment = { id: 'pi_123', status: 'succeeded', amount: 1000 };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue(mockPayment),
      });

      const service = new PaymentsService(client);
      const result = await service.create({ amount: 1000, paymentMethod: 'pm_card_visa', confirm: true });

      expect(result).toEqual(mockPayment);
      expect(client.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1000,
          currency: 'usd',
          payment_method: 'pm_card_visa',
          confirm: true,
        }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('uses a custom currency', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'pi_123' }),
      });

      const service = new PaymentsService(client);
      await service.create({ amount: 1000, currency: 'eur' });

      expect(client.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'eur' }),
        expect.anything()
      );
    });

    it('passes a custom idempotency key', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'pi_123' }),
      });

      const service = new PaymentsService(client);
      await service.create({ amount: 1000, idempotencyKey: 'custom-key' });

      expect(client.paymentIntents.create).toHaveBeenCalledWith(
        expect.anything(),
        { idempotencyKey: 'custom-key' }
      );
    });

    it('throws StripeValidationError for zero amount', async () => {
      const service = new PaymentsService(createMockClient());
      await expect(service.create({ amount: 0 })).rejects.toThrow(StripeValidationError);
    });

    it('throws StripeValidationError for negative amount', async () => {
      const service = new PaymentsService(createMockClient());
      await expect(service.create({ amount: -100 })).rejects.toThrow(StripeValidationError);
    });

    it('maps a card decline to StripePaymentError', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          type: 'card_error',
          code: 'card_declined',
          decline_code: 'insufficient_funds',
          message: 'Your card was declined.',
          statusCode: 402,
          payment_intent: { id: 'pi_declined' },
        }),
      });

      const service = new PaymentsService(client);
      await expect(service.create({ amount: 1000 })).rejects.toThrow(StripePaymentError);
    });
  });

  describe('get', () => {
    it('retrieves a payment by ID', async () => {
      const mockPayment = { id: 'pi_123', status: 'succeeded' };
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue(mockPayment),
      });

      const service = new PaymentsService(client);
      const result = await service.get('pi_123');

      expect(result).toEqual(mockPayment);
      expect(client.paymentIntents.retrieve).toHaveBeenCalledWith('pi_123');
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockRejectedValue({
          type: 'invalid_request_error',
          statusCode: 404,
          message: 'No such payment_intent',
        }),
      });

      const service = new PaymentsService(client);
      await expect(service.get('pi_missing')).rejects.toThrow();
    });
  });

  describe('capture', () => {
    it('captures a payment', async () => {
      const client = createMockClient({
        capture: vi.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
      });

      const service = new PaymentsService(client);
      const result = await service.capture('pi_123');

      expect(result.id).toBe('pi_123');
      expect(client.paymentIntents.capture).toHaveBeenCalledWith('pi_123');
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        capture: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(new PaymentsService(client).capture('pi_1')).rejects.toThrow();
    });
  });

  describe('cancel', () => {
    it('cancels a payment', async () => {
      const client = createMockClient({
        cancel: vi.fn().mockResolvedValue({ id: 'pi_123', status: 'canceled' }),
      });

      const service = new PaymentsService(client);
      const result = await service.cancel('pi_123');

      expect(result.status).toBe('canceled');
      expect(client.paymentIntents.cancel).toHaveBeenCalledWith('pi_123');
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        cancel: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      await expect(new PaymentsService(client).cancel('pi_1')).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('lists payments and returns a cursor', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          data: [{ id: 'pi_1' }, { id: 'pi_2' }],
          has_more: true,
        }),
      });

      const service = new PaymentsService(client);
      const result = await service.list({ limit: 2, customerId: 'cus_1' });

      expect(result.data).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBe('pi_2');
      expect(client.paymentIntents.list).toHaveBeenCalledWith({
        limit: 2,
        customer: 'cus_1',
        starting_after: undefined,
      });
    });

    it('returns no cursor when the page is empty', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ data: [], has_more: false }),
      });

      const service = new PaymentsService(client);
      const result = await service.list();

      expect(result.data).toHaveLength(0);
      expect(result.nextCursor).toBeUndefined();
    });

    it('rethrows API errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({ type: 'authentication_error', statusCode: 401 }),
      });
      await expect(new PaymentsService(client).list()).rejects.toThrow();
    });
  });
});
