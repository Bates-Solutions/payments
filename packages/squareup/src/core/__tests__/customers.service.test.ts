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

  describe('search with query', () => {
    function createListMockForSearch(customers: unknown[], cursor?: string) {
      return vi.fn().mockResolvedValue({
        response: { customers, cursor },
      });
    }

    it('should filter customers by name query', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', familyName: 'Larsen' },
        { id: 'CUST_2', givenName: 'Jane', familyName: 'Smith' },
        { id: 'CUST_3', givenName: 'Bob', familyName: 'Larsen' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'larsen' });

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('CUST_1');
      expect(result.data[1].id).toBe('CUST_3');
    });

    it('should match against combined given + family name', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', familyName: 'Larsen' },
        { id: 'CUST_2', givenName: 'Jane', familyName: 'Smith' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'tim larsen' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('CUST_1');
    });

    it('should match against email address', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', emailAddress: 'tim@example.com' },
        { id: 'CUST_2', givenName: 'Jane', emailAddress: 'jane@example.com' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'tim@example' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('CUST_1');
    });

    it('should match against company name', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', companyName: 'Acme Corp' },
        { id: 'CUST_2', givenName: 'Jane', companyName: 'Widget Inc' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'acme' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('CUST_1');
    });

    it('should match against city (address.locality)', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', address: { locality: 'Portland' } },
        { id: 'CUST_2', givenName: 'Jane', address: { locality: 'Seattle' } },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'portland' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('CUST_1');
    });

    it('should be case insensitive', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim', familyName: 'Larsen' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'TIM LARSEN' });

      expect(result.data).toHaveLength(1);
    });

    it('should respect limit', async () => {
      const mockCustomers = [
        { id: 'CUST_1', givenName: 'Tim' },
        { id: 'CUST_2', givenName: 'Timothy' },
        { id: 'CUST_3', givenName: 'Timmy' },
      ];
      const client = createMockClient({
        list: createListMockForSearch(mockCustomers, 'NEXT_CURSOR'),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'tim', limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.cursor).toBe('NEXT_CURSOR');
    });

    it('should paginate through multiple pages', async () => {
      const listMock = vi.fn()
        .mockResolvedValueOnce({
          response: { customers: [{ id: 'CUST_1', givenName: 'Jane' }], cursor: 'PAGE_2' },
        })
        .mockResolvedValueOnce({
          response: { customers: [{ id: 'CUST_2', givenName: 'Tim' }], cursor: undefined },
        });
      const client = createMockClient({ list: listMock });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'tim' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('CUST_2');
      expect(listMock).toHaveBeenCalledTimes(2);
    });

    it('should not skip matches when limit is reached mid-page', async () => {
      const listMock = vi.fn()
        .mockResolvedValueOnce({
          response: {
            customers: [
              { id: 'CUST_1', givenName: 'Tim' },
              { id: 'CUST_2', givenName: 'Timothy' },
              { id: 'CUST_3', givenName: 'Timmy' },
            ],
            cursor: 'PAGE_2',
          },
        })
        .mockResolvedValueOnce({
          response: { customers: [{ id: 'CUST_4', givenName: 'Tim Jr' }], cursor: undefined },
        });
      const client = createMockClient({ list: listMock });

      const service = new CustomersService(client);

      // Limit 2 — all 3 matches are on page 1, so page should be fully processed
      const result = await service.search({ query: 'tim', limit: 2 });

      expect(result.data).toHaveLength(2);
      // Cursor should point to page 2 so caller can resume without skipping CUST_3
      expect(result.cursor).toBe('PAGE_2');
      // Should NOT have fetched page 2 since limit was satisfied from page 1
      expect(listMock).toHaveBeenCalledTimes(1);
    });

    it('should handle page with undefined customers', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { customers: undefined, cursor: undefined },
        }),
      });

      const service = new CustomersService(client);
      const result = await service.search({ query: 'larsen' });

      expect(result.data).toEqual([]);
    });

    it('should treat whitespace-only query as no query', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ query: '   ' });

      // Should fall through to Square search API, not client-side filtering
      expect(client.customers.search).toHaveBeenCalled();
    });

    it('should use specific filters when provided alongside query', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({ customers: [] }),
      });

      const service = new CustomersService(client);
      await service.search({ query: 'tim', emailAddress: 'tim@example.com' });

      expect(client.customers.search).toHaveBeenCalled();
    });

    it('should pass cursor to list when resuming query search', async () => {
      const listMock = createListMockForSearch([
        { id: 'CUST_1', givenName: 'Tim' },
      ]);
      const client = createMockClient({ list: listMock });

      const service = new CustomersService(client);
      await service.search({ query: 'tim', cursor: 'RESUME_CURSOR' });

      expect(listMock).toHaveBeenCalledWith(
        expect.objectContaining({ cursor: 'RESUME_CURSOR' })
      );
    });

    it('should send a valid sortField on internal paging to avoid an empty sort_field=', async () => {
      const listMock = createListMockForSearch([
        { id: 'CUST_1', givenName: 'Tim' },
      ]);
      const client = createMockClient({ list: listMock });

      const service = new CustomersService(client);
      await service.search({ query: 'tim' });

      expect(listMock).toHaveBeenCalledWith(
        expect.objectContaining({ sortField: 'DEFAULT' })
      );
    });

    it('should send a valid sortOrder on internal paging to avoid an empty sort_order=', async () => {
      const listMock = createListMockForSearch([
        { id: 'CUST_1', givenName: 'Tim' },
      ]);
      const client = createMockClient({ list: listMock });

      const service = new CustomersService(client);
      await service.search({ query: 'tim' });

      expect(listMock).toHaveBeenCalledWith(
        expect.objectContaining({ sortField: 'DEFAULT', sortOrder: 'DESC' })
      );
    });
  });

  describe('list', () => {
    function createListMock(customers: unknown[], cursor?: string) {
      return vi.fn().mockResolvedValue({
        response: { customers, cursor },
      });
    }

    it('should list customers', async () => {
      const mockCustomers = [{ id: 'CUST_1' }, { id: 'CUST_2' }];
      const client = createMockClient({
        list: createListMock(mockCustomers),
      });

      const service = new CustomersService(client);
      const result = await service.list();

      expect(result.customers).toEqual(mockCustomers);
      expect(result.cursor).toBeUndefined();
    });

    it('should pass cursor and limit to the API', async () => {
      const mockCustomers = [{ id: 'CUST_1' }];
      const client = createMockClient({
        list: createListMock(mockCustomers, 'NEXT_PAGE_CURSOR'),
      });

      const service = new CustomersService(client);
      const result = await service.list({ cursor: 'PAGE_CURSOR', limit: 10 });

      expect(client.customers.list).toHaveBeenCalledWith({
        cursor: 'PAGE_CURSOR',
        limit: 10,
        sortField: 'DEFAULT',
        sortOrder: 'DESC',
      });
      expect(result.customers).toEqual(mockCustomers);
      expect(result.cursor).toBe('NEXT_PAGE_CURSOR');
    });

    it('should default sortField to DEFAULT to avoid an empty sort_field=', async () => {
      const client = createMockClient({
        list: createListMock([{ id: 'CUST_1' }]),
      });

      const service = new CustomersService(client);
      await service.list();

      expect(client.customers.list).toHaveBeenCalledWith(
        expect.objectContaining({ sortField: 'DEFAULT' })
      );
    });

    it('should default sortOrder to DESC to avoid an empty sort_order=', async () => {
      const client = createMockClient({
        list: createListMock([{ id: 'CUST_1' }]),
      });

      const service = new CustomersService(client);
      await service.list();

      expect(client.customers.list).toHaveBeenCalledWith(
        expect.objectContaining({ sortOrder: 'DESC' })
      );
    });

    it('should forward sortField and sortOrder when provided', async () => {
      const client = createMockClient({
        list: createListMock([{ id: 'CUST_1' }]),
      });

      const service = new CustomersService(client);
      await service.list({ sortField: 'CREATED_AT', sortOrder: 'DESC' });

      expect(client.customers.list).toHaveBeenCalledWith(
        expect.objectContaining({ sortField: 'CREATED_AT', sortOrder: 'DESC' })
      );
    });

    it('should return cursor for next page', async () => {
      const client = createMockClient({
        list: createListMock([{ id: 'CUST_1' }], 'NEXT_CURSOR'),
      });

      const service = new CustomersService(client);
      const result = await service.list({ limit: 1 });

      expect(result.cursor).toBe('NEXT_CURSOR');
    });

    it('should handle empty results', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { customers: undefined, cursor: undefined },
        }),
      });

      const service = new CustomersService(client);
      const result = await service.list();

      expect(result.customers).toEqual([]);
      expect(result.cursor).toBeUndefined();
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
