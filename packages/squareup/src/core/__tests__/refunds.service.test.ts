import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { RefundsService } from '../services/refunds.service.js';
import { SquareApiError, SquareValidationError } from '../errors.js';
import type { RefundPaymentOptions } from '../types/index.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    refunds: {
      refundPayment: vi.fn(),
      get: vi.fn(),
      list: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

const mockRefund = {
  id: 'REFUND_123',
  status: 'PENDING',
  paymentId: 'PAYMENT_123',
  amountMoney: { amount: BigInt(500), currency: 'USD' },
};

const validOptions: RefundPaymentOptions = {
  paymentId: 'PAYMENT_123',
  amountMoney: { amount: 500 },
  idempotencyKey: 'refund-key',
};

describe('RefundsService', () => {
  describe('refundPayment', () => {
    it('should refund a payment in the default currency', async () => {
      const client = createMockClient({
        refundPayment: vi.fn().mockResolvedValue({ refund: mockRefund }),
      });
      const service = new RefundsService(client);

      const result = await service.refundPayment({ ...validOptions, reason: 'Damaged item' });

      expect(result).toEqual(mockRefund);
      expect(client.refunds.refundPayment).toHaveBeenCalledWith({
        idempotencyKey: 'refund-key',
        paymentId: 'PAYMENT_123',
        amountMoney: { amount: BigInt(500), currency: 'USD' },
        reason: 'Damaged item',
      });
    });

    it('should use the client default currency, or the one given', async () => {
      const client = createMockClient({
        refundPayment: vi.fn().mockResolvedValue({ refund: mockRefund }),
      });
      const service = new RefundsService(client, 'CAD');

      await service.refundPayment(validOptions);
      await service.refundPayment({
        ...validOptions,
        amountMoney: { amount: BigInt(700), currency: 'EUR' },
      });

      expect(client.refunds.refundPayment).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ amountMoney: { amount: BigInt(500), currency: 'CAD' } })
      );
      expect(client.refunds.refundPayment).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ amountMoney: { amount: BigInt(700), currency: 'EUR' } })
      );
    });

    it.each(['paymentId', 'idempotencyKey'] as const)(
      'should throw a SquareValidationError naming %s when it is empty',
      async (field) => {
        const client = createMockClient();
        const service = new RefundsService(client);

        const error: unknown = await service
          .refundPayment({ ...validOptions, [field]: '' })
          .catch((e: unknown) => e);
        expect(error).toBeInstanceOf(SquareValidationError);
        expect((error as SquareValidationError).field).toBe(field);
        expect(client.refunds.refundPayment).not.toHaveBeenCalled();
      }
    );

    it('should throw when idempotencyKey is omitted at runtime', async () => {
      const client = createMockClient();
      const service = new RefundsService(client);
      const { idempotencyKey: _omitted, ...options } = validOptions;

      await expect(
        service.refundPayment(options as unknown as RefundPaymentOptions)
      ).rejects.toThrow('idempotencyKey is required');
      expect(client.refunds.refundPayment).not.toHaveBeenCalled();
    });

    it.each([0, -100, BigInt(0)])('should reject a non-positive amount (%s)', async (amount) => {
      const client = createMockClient();
      const service = new RefundsService(client);

      const error: unknown = await service
        .refundPayment({ ...validOptions, amountMoney: { amount } })
        .catch((e: unknown) => e);
      expect(error).toBeInstanceOf(SquareValidationError);
      expect((error as SquareValidationError).field).toBe('amountMoney.amount');
    });

    it('should throw when no refund is returned', async () => {
      const client = createMockClient({ refundPayment: vi.fn().mockResolvedValue({}) });
      const service = new RefundsService(client);

      await expect(service.refundPayment(validOptions)).rejects.toThrow('Refund was not created');
    });

    it('should parse SDK errors', async () => {
      const client = createMockClient({
        refundPayment: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: {
            errors: [
              {
                category: 'INVALID_REQUEST_ERROR',
                code: 'REFUND_AMOUNT_INVALID',
                detail: 'too much',
              },
            ],
          },
        }),
      });
      const service = new RefundsService(client);

      await expect(service.refundPayment(validOptions)).rejects.toBeInstanceOf(SquareApiError);
    });
  });

  describe('get', () => {
    it('should get a refund by ID', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({ refund: mockRefund }) });
      const service = new RefundsService(client);

      await expect(service.get('REFUND_123')).resolves.toEqual(mockRefund);
      expect(client.refunds.get).toHaveBeenCalledWith({ refundId: 'REFUND_123' });
    });

    it('should throw when the refund is not found', async () => {
      const client = createMockClient({ get: vi.fn().mockResolvedValue({}) });
      const service = new RefundsService(client);

      await expect(service.get('REFUND_123')).rejects.toThrow('Refund not found');
    });

    it('should require a refund ID', async () => {
      const client = createMockClient();
      const service = new RefundsService(client);

      await expect(service.get('')).rejects.toBeInstanceOf(SquareValidationError);
      expect(client.refunds.get).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should pass the filters and return one page', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ response: { refunds: [mockRefund], cursor: 'next' } }),
      });
      const service = new RefundsService(client);

      const options = {
        beginTime: '2026-01-01T00:00:00Z',
        endTime: '2026-02-01T00:00:00Z',
        sortOrder: 'ASC' as const,
        locationId: 'LOC_1',
        status: 'COMPLETED',
        sourceType: 'CARD',
        limit: 10,
        cursor: 'prev',
      };
      const result = await service.list(options);

      expect(result).toEqual({ refunds: [mockRefund], cursor: 'next' });
      expect(client.refunds.list).toHaveBeenCalledWith(options);
    });

    it('should default to an empty page', async () => {
      const client = createMockClient({ list: vi.fn().mockResolvedValue({ response: {} }) });
      const service = new RefundsService(client);

      await expect(service.list()).resolves.toEqual({ refunds: [], cursor: undefined });
    });

    it('should throw on errors in the page response', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: {
            errors: [{ category: 'AUTHENTICATION_ERROR', code: 'INSUFFICIENT_SCOPES' }],
          },
        }),
      });
      const service = new RefundsService(client);

      await expect(service.list()).rejects.toBeInstanceOf(SquareApiError);
    });
  });
});
