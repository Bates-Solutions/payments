import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SquareClient } from 'square';
import { PaymentsService } from '../services/payments.service.js';
import { SquareValidationError, SquareApiError } from '../errors.js';

// Create mock Square client
function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    payments: {
      create: vi.fn(),
      get: vi.fn(),
      cancel: vi.fn(),
      complete: vi.fn(),
      list: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('PaymentsService', () => {
  const defaultLocationId = 'LOC_123';

  describe('create', () => {
    it('should create a payment successfully', async () => {
      const mockPayment = {
        id: 'PAY_123',
        status: 'COMPLETED',
        amountMoney: { amount: BigInt(1000), currency: 'USD' },
      };

      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ payment: mockPayment }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.create({
        sourceId: 'cnon:card-nonce-ok',
        amount: 1000,
      });

      expect(result).toEqual(mockPayment);
      expect(client.payments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceId: 'cnon:card-nonce-ok',
          amountMoney: { amount: BigInt(1000), currency: 'USD' },
          locationId: defaultLocationId,
          autocomplete: true,
        })
      );
    });

    it('should use custom currency', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ payment: { id: 'PAY_123' } }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      await service.create({
        sourceId: 'cnon:card-nonce-ok',
        amount: 1000,
        currency: 'EUR',
      });

      expect(client.payments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMoney: { amount: BigInt(1000), currency: 'EUR' },
        })
      );
    });

    it('should pass optional parameters', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ payment: { id: 'PAY_123' } }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      await service.create({
        sourceId: 'cnon:card-nonce-ok',
        amount: 1000,
        customerId: 'CUST_123',
        orderId: 'ORDER_123',
        referenceId: 'REF_123',
        note: 'Test payment',
        autocomplete: false,
        idempotencyKey: 'custom-key',
      });

      expect(client.payments.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'CUST_123',
          orderId: 'ORDER_123',
          referenceId: 'REF_123',
          note: 'Test payment',
          autocomplete: false,
          idempotencyKey: 'custom-key',
        })
      );
    });

    it('should throw SquareValidationError for missing sourceId', async () => {
      const client = createMockClient();
      const service = new PaymentsService(client, defaultLocationId);

      await expect(
        service.create({ sourceId: '', amount: 1000 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for zero amount', async () => {
      const client = createMockClient();
      const service = new PaymentsService(client, defaultLocationId);

      await expect(
        service.create({ sourceId: 'cnon:card-nonce-ok', amount: 0 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for negative amount', async () => {
      const client = createMockClient();
      const service = new PaymentsService(client, defaultLocationId);

      await expect(
        service.create({ sourceId: 'cnon:card-nonce-ok', amount: -100 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw SquareValidationError for missing locationId', async () => {
      const client = createMockClient();
      const service = new PaymentsService(client); // No default location

      await expect(
        service.create({ sourceId: 'cnon:card-nonce-ok', amount: 1000 })
      ).rejects.toThrow(SquareValidationError);
    });

    it('should throw if payment not returned', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({}),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(
        service.create({ sourceId: 'cnon:card-nonce-ok', amount: 1000 })
      ).rejects.toThrow('Payment was not created');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: {
            errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST', detail: 'Bad request' }],
          },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(
        service.create({ sourceId: 'cnon:card-nonce-ok', amount: 1000 })
      ).rejects.toThrow(SquareApiError);
    });
  });

  describe('get', () => {
    it('should get a payment by ID', async () => {
      const mockPayment = { id: 'PAY_123', status: 'COMPLETED' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ payment: mockPayment }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.get('PAY_123');

      expect(result).toEqual(mockPayment);
      expect(client.payments.get).toHaveBeenCalledWith({ paymentId: 'PAY_123' });
    });

    it('should throw if payment not found', async () => {
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({}),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.get('PAY_123')).rejects.toThrow('Payment not found');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        get: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND', detail: 'Not found' }] },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.get('PAY_123')).rejects.toThrow();
    });
  });

  describe('cancel', () => {
    it('should cancel a payment', async () => {
      const mockPayment = { id: 'PAY_123', status: 'CANCELLED' };
      const client = createMockClient({
        cancel: vi.fn().mockResolvedValue({ payment: mockPayment }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.cancel('PAY_123');

      expect(result).toEqual(mockPayment);
      expect(client.payments.cancel).toHaveBeenCalledWith({ paymentId: 'PAY_123' });
    });

    it('should throw if cancellation fails', async () => {
      const client = createMockClient({
        cancel: vi.fn().mockResolvedValue({}),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.cancel('PAY_123')).rejects.toThrow('Payment cancellation failed');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        cancel: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.cancel('PAY_123')).rejects.toThrow();
    });
  });

  describe('complete', () => {
    it('should complete a payment', async () => {
      const mockPayment = { id: 'PAY_123', status: 'COMPLETED' };
      const client = createMockClient({
        complete: vi.fn().mockResolvedValue({ payment: mockPayment }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.complete('PAY_123');

      expect(result).toEqual(mockPayment);
      expect(client.payments.complete).toHaveBeenCalledWith({ paymentId: 'PAY_123' });
    });

    it('should throw if completion fails', async () => {
      const client = createMockClient({
        complete: vi.fn().mockResolvedValue({}),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.complete('PAY_123')).rejects.toThrow('Payment completion failed');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        complete: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.complete('PAY_123')).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list payments', async () => {
      const mockPayments = [{ id: 'PAY_1' }, { id: 'PAY_2' }];
      const client = createMockClient({
        list: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const payment of mockPayments) {
              yield payment;
            }
          },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.list();

      expect(result).toEqual(mockPayments);
      expect(client.payments.list).toHaveBeenCalledWith({
        locationId: defaultLocationId,
      });
    });

    it('should respect limit option', async () => {
      const mockPayments = [{ id: 'PAY_1' }, { id: 'PAY_2' }, { id: 'PAY_3' }];
      const client = createMockClient({
        list: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const payment of mockPayments) {
              yield payment;
            }
          },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      const result = await service.list({ limit: 2 });

      expect(result).toHaveLength(2);
    });

    it('should use custom locationId', async () => {
      const client = createMockClient({
        list: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            yield { id: 'PAY_1' };
          },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);
      await service.list({ locationId: 'CUSTOM_LOC' });

      expect(client.payments.list).toHaveBeenCalledWith({
        locationId: 'CUSTOM_LOC',
      });
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new PaymentsService(client, defaultLocationId);

      await expect(service.list()).rejects.toThrow();
    });
  });
});
