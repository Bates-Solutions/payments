import { describe, it, expect, vi } from 'vitest';
import type { SquareClient } from 'square';
import { CustomerGroupsService } from '../services/customer-groups.service.js';
import { SquareValidationError } from '../errors.js';

function createMockClient(overrides: Record<string, unknown> = {}): SquareClient {
  return {
    customers: {
      groups: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        ...overrides,
      },
    },
  } as unknown as SquareClient;
}

describe('CustomerGroupsService', () => {
  describe('create', () => {
    it('should create a group', async () => {
      const mockGroup = { id: 'GRP_1', name: 'Wholesale' };
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ group: mockGroup }),
      });

      const service = new CustomerGroupsService(client);
      const result = await service.create({ name: 'Wholesale' });

      expect(result).toEqual(mockGroup);
      expect(client.customers.groups.create).toHaveBeenCalledWith({
        idempotencyKey: undefined,
        group: { name: 'Wholesale' },
      });
    });

    it('should require a name', async () => {
      const service = new CustomerGroupsService(createMockClient());
      await expect(service.create({ name: '' })).rejects.toThrow(SquareValidationError);
    });

    it('should pass idempotencyKey when provided', async () => {
      const client = createMockClient({
        create: vi.fn().mockResolvedValue({ group: { id: 'GRP_1' } }),
      });

      await new CustomerGroupsService(client).create({
        name: 'VIP',
        idempotencyKey: 'key-1',
      });

      expect(client.customers.groups.create).toHaveBeenCalledWith(
        expect.objectContaining({ idempotencyKey: 'key-1' })
      );
    });
  });

  describe('get', () => {
    it('should get a group by id', async () => {
      const mockGroup = { id: 'GRP_1', name: 'Wholesale' };
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({ group: mockGroup }),
      });

      const result = await new CustomerGroupsService(client).get('GRP_1');

      expect(result).toEqual(mockGroup);
      expect(client.customers.groups.get).toHaveBeenCalledWith({ groupId: 'GRP_1' });
    });

    it('should throw when not found', async () => {
      const client = createMockClient({
        get: vi.fn().mockResolvedValue({}),
      });
      await expect(new CustomerGroupsService(client).get('X')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update name', async () => {
      const mockGroup = { id: 'GRP_1', name: 'VIP' };
      const client = createMockClient({
        update: vi.fn().mockResolvedValue({ group: mockGroup }),
      });

      const result = await new CustomerGroupsService(client).update('GRP_1', {
        name: 'VIP',
      });

      expect(result).toEqual(mockGroup);
      expect(client.customers.groups.update).toHaveBeenCalledWith({
        groupId: 'GRP_1',
        group: { name: 'VIP' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a group', async () => {
      const client = createMockClient({
        delete: vi.fn().mockResolvedValue({}),
      });

      await new CustomerGroupsService(client).delete('GRP_1');

      expect(client.customers.groups.delete).toHaveBeenCalledWith({ groupId: 'GRP_1' });
    });
  });

  describe('list', () => {
    it('should list groups with cursor', async () => {
      const mockGroups = [{ id: 'GRP_1' }, { id: 'GRP_2' }];
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({
          response: { groups: mockGroups, cursor: 'next' },
        }),
      });

      const result = await new CustomerGroupsService(client).list({ limit: 10 });

      expect(result).toEqual({ groups: mockGroups, cursor: 'next' });
      expect(client.customers.groups.list).toHaveBeenCalledWith({
        cursor: undefined,
        limit: 10,
      });
    });

    it('should handle empty results', async () => {
      const client = createMockClient({
        list: vi.fn().mockResolvedValue({ response: {} }),
      });

      const result = await new CustomerGroupsService(client).list();

      expect(result).toEqual({ groups: [], cursor: undefined });
    });
  });

  describe('membership', () => {
    it('should add a customer to a group', async () => {
      const client = createMockClient({
        add: vi.fn().mockResolvedValue({}),
      });

      await new CustomerGroupsService(client).addCustomer('GRP_1', 'CUST_1');

      expect(client.customers.groups.add).toHaveBeenCalledWith({
        groupId: 'GRP_1',
        customerId: 'CUST_1',
      });
    });

    it('should remove a customer from a group', async () => {
      const client = createMockClient({
        remove: vi.fn().mockResolvedValue({}),
      });

      await new CustomerGroupsService(client).removeCustomer('GRP_1', 'CUST_1');

      expect(client.customers.groups.remove).toHaveBeenCalledWith({
        groupId: 'GRP_1',
        customerId: 'CUST_1',
      });
    });
  });
});
