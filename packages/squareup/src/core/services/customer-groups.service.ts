import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Customer group from Square API
 */
export interface CustomerGroup {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Options for creating a customer group
 */
export interface CreateCustomerGroupOptions {
  name: string;
  idempotencyKey?: string;
}

/**
 * Options for updating a customer group
 */
export interface UpdateCustomerGroupOptions {
  name: string;
}

/**
 * Options for listing customer groups
 */
export interface ListCustomerGroupsOptions {
  limit?: number;
  cursor?: string;
}

/**
 * Customer Groups service for managing Square customer groups and memberships.
 *
 * Customer groups are the primary way to gate pricing rules (wholesale tiers,
 * member discounts) to specific customers.
 *
 * @example
 * ```typescript
 * const group = await square.customerGroups.create({ name: 'Wholesale' });
 * await square.customerGroups.addCustomer(group.id!, 'CUST_123');
 * ```
 */
export class CustomerGroupsService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Create a new customer group.
   */
  async create(options: CreateCustomerGroupOptions): Promise<CustomerGroup> {
    if (!options.name) {
      throw new SquareValidationError('Customer group name is required', 'name');
    }

    try {
      const response = await this.client.customers.groups.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        group: { name: options.name },
      });

      if (!response.group) {
        throw new Error('Customer group was not created');
      }

      return response.group as CustomerGroup;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a customer group by ID.
   */
  async get(groupId: string): Promise<CustomerGroup> {
    try {
      const response = await this.client.customers.groups.get({ groupId });

      if (!response.group) {
        throw new Error('Customer group not found');
      }

      return response.group as CustomerGroup;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update a customer group's name.
   */
  async update(
    groupId: string,
    options: UpdateCustomerGroupOptions
  ): Promise<CustomerGroup> {
    if (!options.name) {
      throw new SquareValidationError('Customer group name is required', 'name');
    }
    try {
      const response = await this.client.customers.groups.update({
        groupId,
        group: { name: options.name },
      });

      if (!response.group) {
        throw new Error('Customer group update failed');
      }

      return response.group as CustomerGroup;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a customer group. Customers are not deleted — only the group and
   * its memberships.
   */
  async delete(groupId: string): Promise<void> {
    try {
      await this.client.customers.groups.delete({ groupId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List customer groups with cursor-based pagination.
   */
  async list(
    options?: ListCustomerGroupsOptions
  ): Promise<{ groups: CustomerGroup[]; cursor?: string }> {
    try {
      const page = await this.client.customers.groups.list({
        cursor: options?.cursor,
        limit: options?.limit,
      });

      return {
        groups: (page.response.groups ?? []) as CustomerGroup[],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Add a customer to a group.
   */
  async addCustomer(groupId: string, customerId: string): Promise<void> {
    try {
      await this.client.customers.groups.add({ groupId, customerId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Remove a customer from a group.
   */
  async removeCustomer(groupId: string, customerId: string): Promise<void> {
    try {
      await this.client.customers.groups.remove({ groupId, customerId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
