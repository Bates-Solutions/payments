import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { CustomersService } from '../services/customers.service.js';
import { StripeValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): Stripe {
  return {
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
      update: vi.fn(),
      del: vi.fn(),
      list: vi.fn(),
      search: vi.fn(),
      ...overrides,
    },
  } as unknown as Stripe;
}

describe('CustomersService', () => {
  describe('create', () => {
    it('creates a customer successfully', async () => {
      const mockCustomer = { id: 'cus_123', email: 'john@example.com' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue(mockCustomer),
      });

      const service = new CustomersService(client);
      const result = await service.create({ email: 'john@example.com', name: 'John Doe' });

      expect(result).toEqual(mockCustomer);
      expect(client.customers.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'john@example.com', name: 'John Doe' }),
        expect.objectContaining({ idempotencyKey: expect.any(String) })
      );
    });

    it('maps address fields to snake_case', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ id: 'cus_123' }),
      });

      const service = new CustomersService(client);
      await service.create({
        email: 'a@b.com',
        address: { line1: '1 Main St', postalCode: '90210', country: 'US' },
      });

      expect(client.customers.create).toHaveBeenCalledWith(
        expect.objectContaining({
          address: expect.objectContaining({ line1: '1 Main St', postal_code: '90210', country: 'US' }),
        }),
        expect.anything()
      );
    });

    it('throws StripeValidationError when no identifying field is provided', async () => {
      const service = new CustomersService(createMockClient());
      await expect(service.create({})).rejects.toThrow(StripeValidationError);
    });
  });

  describe('get', () => {
    it('retrieves an active customer', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ id: 'cus_123', email: 'john@example.com' }),
      });

      const service = new CustomersService(client);
      const result = await service.get('cus_123');

      expect(result.id).toBe('cus_123');
      expect(client.customers.retrieve).toHaveBeenCalledWith('cus_123');
    });

    it('throws when the customer has been deleted', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockResolvedValue({ id: 'cus_123', deleted: true }),
      });

      const service = new CustomersService(client);
      await expect(service.get('cus_123')).rejects.toThrow(StripeValidationError);
    });
  });

  describe('update', () => {
    it('updates a customer', async () => {
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ id: 'cus_123', email: 'new@example.com' }),
      });

      const service = new CustomersService(client);
      const result = await service.update('cus_123', { email: 'new@example.com' });

      expect(result.email).toBe('new@example.com');
      expect(client.customers.update).toHaveBeenCalledWith(
        'cus_123',
        expect.objectContaining({ email: 'new@example.com' })
      );
    });
  });

  describe('delete', () => {
    it('deletes a customer', async () => {
      const client = createMockClient({
        del: vi.fn().mockResolvedValue({ id: 'cus_123', deleted: true }),
      });

      const service = new CustomersService(client);
      await service.delete('cus_123');

      expect(client.customers.del).toHaveBeenCalledWith('cus_123');
    });
  });

  describe('list', () => {
    it('lists customers and returns a cursor', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          data: [{ id: 'cus_1' }, { id: 'cus_2' }],
          has_more: false,
        }),
      });

      const service = new CustomersService(client);
      const result = await service.list({ limit: 2, email: 'john@example.com' });

      expect(result.data).toHaveLength(2);
      expect(result.nextCursor).toBe('cus_2');
      expect(client.customers.list).toHaveBeenCalledWith({
        limit: 2,
        email: 'john@example.com',
        starting_after: undefined,
      });
    });
  });

  describe('search', () => {
    it('searches customers with a query', async () => {
      const client = createMockClient({
        search: vi.fn().mockResolvedValue({
          data: [{ id: 'cus_1' }],
          has_more: true,
          next_page: 'page_2',
        }),
      });

      const service = new CustomersService(client);
      const result = await service.search("email:'john@example.com'");

      expect(result.data).toHaveLength(1);
      expect(result.nextCursor).toBe('page_2');
      expect(client.customers.search).toHaveBeenCalledWith(
        expect.objectContaining({ query: "email:'john@example.com'" })
      );
    });

    it('throws StripeValidationError for an empty query', async () => {
      const service = new CustomersService(createMockClient());
      await expect(service.search('   ')).rejects.toThrow(StripeValidationError);
    });

    it('parses and rethrows API errors', async () => {
      const client = createMockClient({
        search: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 400 }),
      });
      const service = new CustomersService(client);
      await expect(service.search("email:'x'")).rejects.toThrow();
    });
  });

  describe('error paths', () => {
    it('rethrows on create failure', async () => {
      const client = createMockClient({
        create: vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 }),
      });
      await expect(new CustomersService(client).create({ email: 'a@b.com' })).rejects.toThrow();
    });

    it('rethrows on update failure', async () => {
      const client = createMockClient({
        update: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      await expect(new CustomersService(client).update('cus_1', {})).rejects.toThrow();
    });

    it('rethrows on delete failure', async () => {
      const client = createMockClient({
        del: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      await expect(new CustomersService(client).delete('cus_1')).rejects.toThrow();
    });

    it('rethrows on list failure', async () => {
      const client = createMockClient({
        list: vi.fn().mockRejectedValue({ type: 'api_error', statusCode: 500 }),
      });
      await expect(new CustomersService(client).list()).rejects.toThrow();
    });

    it('rethrows on get failure', async () => {
      const client = createMockClient({
        retrieve: vi.fn().mockRejectedValue({ type: 'invalid_request_error', statusCode: 404 }),
      });
      await expect(new CustomersService(client).get('cus_1')).rejects.toThrow();
    });
  });
});
