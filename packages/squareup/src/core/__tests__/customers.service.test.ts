import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { CustomersService } from '../services/customers.service.js';
import { SquareValidationError } from '../errors.js';

// Create mock Square client
function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    customers: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
      list: vi.fn(),
      ...overrides,
    },
  } as unknown as SquareClient;
}

describe('CustomersService', () => {
  describe('create', () => {
    it('should create a customer', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      const result = await service.create({ givenName: 'John' });

      expect(result).toEqual(mockCustomer);
      expect(client.customers.create).toHaveBeenCalledWith(
        expect.objectContaining({ givenName: 'John' })
      );
    });

    it('should pass all optional fields', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.create({
        givenName: 'John',
        familyName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '+15551234567',
        companyName: 'Acme Inc',
        nickname: 'JD',
        note: 'VIP customer',
        referenceId: 'REF_123',
        idempotencyKey: 'custom-key',
        address: {
          addressLine1: '123 Main St',
          locality: 'San Francisco',
          administrativeDistrictLevel1: 'CA',
          postalCode: '94102',
          country: 'US',
        },
      });

      expect(client.customers.create).toHaveBeenCalledWith(
        expect.objectContaining({
          givenName: 'John',
          familyName: 'Doe',
          emailAddress: 'john@example.com',
          phoneNumber: '+15551234567',
          companyName: 'Acme Inc',
          nickname: 'JD',
          note: 'VIP customer',
          referenceId: 'REF_123',
          idempotencyKey: 'custom-key',
        })
      );
    });

    it('should accept familyName only', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.create({ familyName: 'Doe' });

      expect(client.customers.create).toHaveBeenCalled();
    });

    it('should accept emailAddress only', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.create({ emailAddress: 'john@example.com' });

      expect(client.customers.create).toHaveBeenCalled();
    });

    it('should accept phoneNumber only', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.create({ phoneNumber: '+15551234567' });

      expect(client.customers.create).toHaveBeenCalled();
    });

    it('should accept companyName only', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.create({ companyName: 'Acme Inc' });

      expect(client.customers.create).toHaveBeenCalled();
    });

    it('should throw SquareValidationError for missing all identifying fields', async () => {
      const client = createMockClient();
      const service = new CustomersService(client);

      await expect(service.create({})).rejects.toThrow(SquareValidationError);
    });

    it('should throw if customer not returned', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({}),
      });

      const service = new CustomersService(client);

      await expect(service.create({ givenName: 'John' })).rejects.toThrow(
        'Customer was not created'
      );
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.create({ givenName: 'John' })).rejects.toThrow();
    });
  });

  describe('get', () => {
    it('should get a customer by ID', async () => {
      const mockCustomer = { id: 'CUST_123', givenName: 'John' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      const result = await service.get('CUST_123');

      expect(result).toEqual(mockCustomer);
      expect(client.customers.get).toHaveBeenCalledWith({ customerId: 'CUST_123' });
    });

    it('should throw if customer not found', async () => {
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({}),
      });

      const service = new CustomersService(client);

      await expect(service.get('CUST_123')).rejects.toThrow('Customer not found');
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        get: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.get('CUST_123')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const mockCustomer = { id: 'CUST_123', emailAddress: 'new@example.com' };
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      const result = await service.update('CUST_123', { emailAddress: 'new@example.com' });

      expect(result).toEqual(mockCustomer);
      expect(client.customers.update).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'CUST_123',
          emailAddress: 'new@example.com',
        })
      );
    });

    it('should pass all update fields', async () => {
      const mockCustomer = { id: 'CUST_123' };
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ customer: mockCustomer }),
      });

      const service = new CustomersService(client);
      await service.update('CUST_123', {
        givenName: 'Jane',
        familyName: 'Smith',
        emailAddress: 'jane@example.com',
        phoneNumber: '+15559876543',
        companyName: 'New Corp',
        nickname: 'JS',
        note: 'Updated',
        referenceId: 'REF_456',
        address: {
          addressLine1: '456 Oak St',
        },
      });

      expect(client.customers.update).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'CUST_123',
          givenName: 'Jane',
          familyName: 'Smith',
          emailAddress: 'jane@example.com',
          phoneNumber: '+15559876543',
          companyName: 'New Corp',
          nickname: 'JS',
          note: 'Updated',
          referenceId: 'REF_456',
        })
      );
    });

    it('should throw if update fails', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({}),
      });

      const service = new CustomersService(client);

      await expect(service.update('CUST_123', { givenName: 'Jane' })).rejects.toThrow(
        'Customer update failed'
      );
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        update: vi.fn().mockRejectedValue({
          statusCode: 400,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'BAD_REQUEST' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.update('CUST_123', { givenName: 'Jane' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      const client = createMockClient({
        delete: vi.fn().mockResolvedValue({}),
      });

      const service = new CustomersService(client);
      await service.delete('CUST_123');

      expect(client.customers.delete).toHaveBeenCalledWith({ customerId: 'CUST_123' });
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        delete: vi.fn().mockRejectedValue({
          statusCode: 404,
          body: { errors: [{ category: 'INVALID_REQUEST_ERROR', code: 'NOT_FOUND' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.delete('CUST_123')).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search for customers', async () => {
      const mockCustomers = [{ id: 'CUST_1' }, { id: 'CUST_2' }];
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: mockCustomers, cursor: 'next' }),
      });

      const service = new CustomersService(client);
      const result = await service.search();

      expect(result.data).toEqual(mockCustomers);
      expect(result.cursor).toBe('next');
    });

    it('should search by emailAddress', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ emailAddress: 'john@example.com' });

      expect(client.customers.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            filter: {
              emailAddress: { exact: 'john@example.com' },
            },
          },
        })
      );
    });

    it('should search by phoneNumber', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ phoneNumber: '+15551234567' });

      expect(client.customers.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            filter: {
              phoneNumber: { exact: '+15551234567' },
            },
          },
        })
      );
    });

    it('should search by referenceId', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ referenceId: 'REF_123' });

      expect(client.customers.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            filter: {
              referenceId: { exact: 'REF_123' },
            },
          },
        })
      );
    });

    it('should pass cursor and limit', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ cursor: 'some_cursor', limit: 25 });

      expect(client.customers.search).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: 'some_cursor',
          limit: BigInt(25),
        })
      );
    });

    it('should return empty array when no customers', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({}),
      });

      const service = new CustomersService(client);
      const result = await service.search();

      expect(result.data).toEqual([]);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.search()).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list customers', async () => {
      const mockCustomers = [{ id: 'CUST_1' }, { id: 'CUST_2' }];
      const client = createMockClient({
        list: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const customer of mockCustomers) {
              yield customer;
            }
          },
        }),
      });

      const service = new CustomersService(client);
      const result = await service.list();

      expect(result).toEqual(mockCustomers);
    });

    it('should respect limit option', async () => {
      const mockCustomers = [{ id: 'CUST_1' }, { id: 'CUST_2' }, { id: 'CUST_3' }];
      const client = createMockClient({
        list: vi.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            for (const customer of mockCustomers) {
              yield customer;
            }
          },
        }),
      });

      const service = new CustomersService(client);
      const result = await service.list({ limit: 2 });

      expect(result).toHaveLength(2);
    });

    it('should parse and rethrow API errors', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({
          statusCode: 401,
          body: { errors: [{ category: 'AUTHENTICATION_ERROR', code: 'UNAUTHORIZED' }] },
        }),
      });

      const service = new CustomersService(client);

      await expect(service.list()).rejects.toThrow();
    });
  });
});
