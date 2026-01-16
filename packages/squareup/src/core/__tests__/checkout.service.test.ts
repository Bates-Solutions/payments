import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { CheckoutService } from '../services/checkout.service.js';
import { SquareValidationError, SquareApiError } from '../errors.js';

// Create mock Square client
function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    checkout: {
      paymentLinks: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        ...overrides,
      },
    },
  } as unknown as SquareClient;
}

describe('CheckoutService', () => {
  describe('paymentLinks', () => {
    describe('create', () => {
      it('should create a payment link with quickPay', async () => {
        const mockLink = {
          id: 'LINK_123',
          url: 'https://squareup.com/pay/LINK_123',
          version: 1,
        };

        const client = createMockClient({
          create: vi.fn().mockResolvedValue({ paymentLink: mockLink }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.create({
          quickPay: {
            name: 'Auto Detailing',
            priceMoney: { amount: BigInt(5000), currency: 'USD' },
            locationId: 'LOC_123',
          },
        });

        expect(result).toEqual(mockLink);
        expect(client.checkout.paymentLinks.create).toHaveBeenCalledWith(
          expect.objectContaining({
            quickPay: {
              name: 'Auto Detailing',
              priceMoney: { amount: BigInt(5000), currency: 'USD' },
              locationId: 'LOC_123',
            },
          })
        );
      });

      it('should create a payment link with order', async () => {
        const mockLink = { id: 'LINK_123', url: 'https://squareup.com/pay/LINK_123' };

        const client = createMockClient({
          create: vi.fn().mockResolvedValue({ paymentLink: mockLink }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.create({
          order: {
            locationId: 'LOC_123',
            lineItems: [
              { name: 'Product', quantity: '1', basePriceMoney: { amount: BigInt(1000), currency: 'USD' } },
            ],
          },
        });

        expect(result).toEqual(mockLink);
        expect(client.checkout.paymentLinks.create).toHaveBeenCalledWith(
          expect.objectContaining({
            order: {
              locationId: 'LOC_123',
              lineItems: [
                { name: 'Product', quantity: '1', basePriceMoney: { amount: BigInt(1000), currency: 'USD' } },
              ],
            },
          })
        );
      });

      it('should pass optional parameters', async () => {
        const client = createMockClient({
          create: vi.fn().mockResolvedValue({ paymentLink: { id: 'LINK_123' } }),
        });

        const service = new CheckoutService(client);
        await service.paymentLinks.create({
          quickPay: {
            name: 'Service',
            priceMoney: { amount: BigInt(1000), currency: 'USD' },
            locationId: 'LOC_123',
          },
          description: 'Test payment',
          checkoutOptions: {
            askForShippingAddress: true,
            redirectUrl: 'https://example.com/thanks',
          },
          prePopulatedData: {
            buyerEmail: 'test@example.com',
          },
          paymentNote: 'Order note',
          idempotencyKey: 'custom-key',
        });

        expect(client.checkout.paymentLinks.create).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Test payment',
            checkoutOptions: {
              askForShippingAddress: true,
              redirectUrl: 'https://example.com/thanks',
            },
            prePopulatedData: {
              buyerEmail: 'test@example.com',
            },
            paymentNote: 'Order note',
            idempotencyKey: 'custom-key',
          })
        );
      });

      it('should throw SquareValidationError when neither quickPay nor order provided', async () => {
        const client = createMockClient();
        const service = new CheckoutService(client);

        await expect(service.paymentLinks.create({})).rejects.toThrow(SquareValidationError);
        await expect(service.paymentLinks.create({})).rejects.toThrow(
          'Either quickPay or order must be provided'
        );
      });

      it('should throw if payment link not returned', async () => {
        const client = createMockClient({
          create: vi.fn().mockResolvedValue({}),
        });

        const service = new CheckoutService(client);

        await expect(
          service.paymentLinks.create({
            quickPay: {
              name: 'Test',
              priceMoney: { amount: BigInt(100), currency: 'USD' },
              locationId: 'LOC_123',
            },
          })
        ).rejects.toThrow('Payment link was not created');
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

        const service = new CheckoutService(client);

        await expect(
          service.paymentLinks.create({
            quickPay: {
              name: 'Test',
              priceMoney: { amount: BigInt(100), currency: 'USD' },
              locationId: 'LOC_123',
            },
          })
        ).rejects.toThrow(SquareApiError);
      });
    });

    describe('get', () => {
      it('should get a payment link by ID', async () => {
        const mockLink = { id: 'LINK_123', url: 'https://squareup.com/pay/LINK_123' };
        const client = createMockClient({
          get: vi.fn().mockResolvedValue({ paymentLink: mockLink }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.get('LINK_123');

        expect(result).toEqual(mockLink);
        expect(client.checkout.paymentLinks.get).toHaveBeenCalledWith({ id: 'LINK_123' });
      });

      it('should throw SquareValidationError for empty id', async () => {
        const client = createMockClient();
        const service = new CheckoutService(client);

        await expect(service.paymentLinks.get('')).rejects.toThrow(SquareValidationError);
        await expect(service.paymentLinks.get('')).rejects.toThrow('id is required');
      });

      it('should throw if payment link not found', async () => {
        const client = createMockClient({
          get: vi.fn().mockResolvedValue({}),
        });

        const service = new CheckoutService(client);

        await expect(service.paymentLinks.get('LINK_123')).rejects.toThrow('Payment link not found');
      });

      it('should parse and rethrow API errors', async () => {
        const client = createMockClient({
          get: vi.fn().mockRejectedValue({
            statusCode: 404,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND', detail: 'Not found' }] },
          }),
        });

        const service = new CheckoutService(client);

        await expect(service.paymentLinks.get('LINK_123')).rejects.toThrow();
      });
    });

    describe('update', () => {
      it('should update a payment link', async () => {
        const mockLink = { id: 'LINK_123', version: 2, description: 'Updated' };
        const client = createMockClient({
          update: vi.fn().mockResolvedValue({ paymentLink: mockLink }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.update('LINK_123', {
          paymentLink: {
            version: 1,
            description: 'Updated',
          },
        });

        expect(result).toEqual(mockLink);
        expect(client.checkout.paymentLinks.update).toHaveBeenCalledWith({
          id: 'LINK_123',
          paymentLink: {
            version: 1,
            description: 'Updated',
          },
        });
      });

      it('should throw SquareValidationError for empty id', async () => {
        const client = createMockClient();
        const service = new CheckoutService(client);

        await expect(
          service.paymentLinks.update('', { paymentLink: { version: 1 } })
        ).rejects.toThrow(SquareValidationError);
        await expect(
          service.paymentLinks.update('', { paymentLink: { version: 1 } })
        ).rejects.toThrow('id is required');
      });

      it('should throw if update fails', async () => {
        const client = createMockClient({
          update: vi.fn().mockResolvedValue({}),
        });

        const service = new CheckoutService(client);

        await expect(
          service.paymentLinks.update('LINK_123', { paymentLink: { version: 1 } })
        ).rejects.toThrow('Payment link update failed');
      });

      it('should parse and rethrow API errors', async () => {
        const client = createMockClient({
          update: vi.fn().mockRejectedValue({
            statusCode: 400,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
          }),
        });

        const service = new CheckoutService(client);

        await expect(
          service.paymentLinks.update('LINK_123', { paymentLink: { version: 1 } })
        ).rejects.toThrow();
      });
    });

    describe('delete', () => {
      it('should delete a payment link', async () => {
        const client = createMockClient({
          delete: vi.fn().mockResolvedValue({}),
        });

        const service = new CheckoutService(client);
        await service.paymentLinks.delete('LINK_123');

        expect(client.checkout.paymentLinks.delete).toHaveBeenCalledWith({ id: 'LINK_123' });
      });

      it('should throw SquareValidationError for empty id', async () => {
        const client = createMockClient();
        const service = new CheckoutService(client);

        await expect(service.paymentLinks.delete('')).rejects.toThrow(SquareValidationError);
        await expect(service.paymentLinks.delete('')).rejects.toThrow('id is required');
      });

      it('should parse and rethrow API errors', async () => {
        const client = createMockClient({
          delete: vi.fn().mockRejectedValue({
            statusCode: 404,
            body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
          }),
        });

        const service = new CheckoutService(client);

        await expect(service.paymentLinks.delete('LINK_123')).rejects.toThrow();
      });
    });

    describe('list', () => {
      it('should list payment links', async () => {
        const mockLinks = [{ id: 'LINK_1' }, { id: 'LINK_2' }];
        const client = createMockClient({
          list: vi.fn().mockReturnValue({
            [Symbol.asyncIterator]: async function* () {
              for (const link of mockLinks) {
                yield link;
              }
            },
          }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.list();

        expect(result.data).toEqual(mockLinks);
        expect(client.checkout.paymentLinks.list).toHaveBeenCalledWith({
          cursor: undefined,
          limit: undefined,
        });
      });

      it('should respect limit option', async () => {
        const mockLinks = [{ id: 'LINK_1' }, { id: 'LINK_2' }, { id: 'LINK_3' }];
        const client = createMockClient({
          list: vi.fn().mockReturnValue({
            [Symbol.asyncIterator]: async function* () {
              for (const link of mockLinks) {
                yield link;
              }
            },
          }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.list({ limit: 2 });

        expect(result.data).toHaveLength(2);
      });

      it('should pass cursor option', async () => {
        const client = createMockClient({
          list: vi.fn().mockReturnValue({
            [Symbol.asyncIterator]: async function* () {
              yield { id: 'LINK_1' };
            },
          }),
        });

        const service = new CheckoutService(client);
        await service.paymentLinks.list({ cursor: 'next_page', limit: 10 });

        expect(client.checkout.paymentLinks.list).toHaveBeenCalledWith({
          cursor: 'next_page',
          limit: 10,
        });
      });

      it('should return empty array when no links exist', async () => {
        const client = createMockClient({
          list: vi.fn().mockReturnValue({
            [Symbol.asyncIterator]: async function* () {
              // Empty iterator
            },
          }),
        });

        const service = new CheckoutService(client);
        const result = await service.paymentLinks.list();

        expect(result.data).toEqual([]);
      });

      it('should parse and rethrow API errors', async () => {
        const client = createMockClient({
          list: vi.fn().mockRejectedValue({
            statusCode: 401,
            body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
          }),
        });

        const service = new CheckoutService(client);

        await expect(service.paymentLinks.list()).rejects.toThrow();
      });
    });
  });
});
