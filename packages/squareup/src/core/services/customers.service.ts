import type { SquareClient } from 'square';
import { parseSquareError, SquareValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * Customer object type from Square API
 */
export interface Customer {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  companyName?: string;
  nickname?: string;
  note?: string;
  referenceId?: string;
  preferences?: {
    emailUnsubscribed?: boolean;
  };
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  };
}

/**
 * Options for creating a customer
 */
export interface CreateCustomerOptions {
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  companyName?: string;
  nickname?: string;
  note?: string;
  referenceId?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  };
  idempotencyKey?: string;
}

/**
 * Options for updating a customer
 */
export interface UpdateCustomerOptions {
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  companyName?: string;
  nickname?: string;
  note?: string;
  referenceId?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  };
}

/**
 * Options for searching customers
 */
export interface SearchCustomersOptions {
  query?: string;
  emailAddress?: string;
  phoneNumber?: string;
  referenceId?: string;
  limit?: number;
  cursor?: string;
}

/**
 * Customers service for managing Square customers
 *
 * @example
 * ```typescript
 * // Create a customer
 * const customer = await square.customers.create({
 *   givenName: 'John',
 *   familyName: 'Doe',
 *   emailAddress: 'john@example.com',
 * });
 *
 * // Search customers
 * const results = await square.customers.search({
 *   emailAddress: 'john@example.com',
 * });
 * ```
 */
export class CustomersService {
  constructor(private readonly client: SquareClient) {}

  /**
   * Create a new customer
   *
   * @param options - Customer creation options
   * @returns Created customer
   *
   * @example
   * ```typescript
   * const customer = await square.customers.create({
   *   givenName: 'John',
   *   familyName: 'Doe',
   *   emailAddress: 'john@example.com',
   *   phoneNumber: '+15551234567',
   * });
   * ```
   */
  async create(options: CreateCustomerOptions): Promise<Customer> {
    // At least one identifying field should be provided
    if (
      !options.givenName &&
      !options.familyName &&
      !options.emailAddress &&
      !options.phoneNumber &&
      !options.companyName
    ) {
      throw new SquareValidationError(
        'At least one of givenName, familyName, emailAddress, phoneNumber, or companyName is required'
      );
    }

    try {
      const response = await this.client.customers.create({
        idempotencyKey: options.idempotencyKey ?? createIdempotencyKey(),
        givenName: options.givenName,
        familyName: options.familyName,
        emailAddress: options.emailAddress,
        phoneNumber: options.phoneNumber,
        companyName: options.companyName,
        nickname: options.nickname,
        note: options.note,
        referenceId: options.referenceId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        address: options.address as any,
      });

      if (!response.customer) {
        throw new Error('Customer was not created');
      }

      return response.customer as Customer;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Get a customer by ID
   *
   * @param customerId - Customer ID
   * @returns Customer details
   *
   * @example
   * ```typescript
   * const customer = await square.customers.get('CUST_123');
   * ```
   */
  async get(customerId: string): Promise<Customer> {
    try {
      const response = await this.client.customers.get({ customerId });

      if (!response.customer) {
        throw new Error('Customer not found');
      }

      return response.customer as Customer;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Update a customer
   *
   * @param customerId - Customer ID to update
   * @param options - Update options
   * @returns Updated customer
   *
   * @example
   * ```typescript
   * const customer = await square.customers.update('CUST_123', {
   *   emailAddress: 'newemail@example.com',
   * });
   * ```
   */
  async update(customerId: string, options: UpdateCustomerOptions): Promise<Customer> {
    try {
      const response = await this.client.customers.update({
        customerId,
        givenName: options.givenName,
        familyName: options.familyName,
        emailAddress: options.emailAddress,
        phoneNumber: options.phoneNumber,
        companyName: options.companyName,
        nickname: options.nickname,
        note: options.note,
        referenceId: options.referenceId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        address: options.address as any,
      });

      if (!response.customer) {
        throw new Error('Customer update failed');
      }

      return response.customer as Customer;
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Delete a customer
   *
   * @param customerId - Customer ID to delete
   *
   * @example
   * ```typescript
   * await square.customers.delete('CUST_123');
   * ```
   */
  async delete(customerId: string): Promise<void> {
    try {
      await this.client.customers.delete({ customerId });
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * Search for customers
   *
   * @param options - Search options
   * @returns Matching customers with pagination
   *
   * @example
   * ```typescript
   * // Search by email
   * const results = await square.customers.search({
   *   emailAddress: 'john@example.com',
   * });
   *
   * // Search by phone
   * const results = await square.customers.search({
   *   phoneNumber: '+15551234567',
   * });
   * ```
   */
  async search(options?: SearchCustomersOptions): Promise<{ data: Customer[]; cursor?: string }> {
    try {
      // Build the query filter
      const filters: Record<string, unknown>[] = [];

      if (options?.emailAddress) {
        filters.push({
          emailAddress: {
            exact: options.emailAddress,
          },
        });
      }

      if (options?.phoneNumber) {
        filters.push({
          phoneNumber: {
            exact: options.phoneNumber,
          },
        });
      }

      if (options?.referenceId) {
        filters.push({
          referenceId: {
            exact: options.referenceId,
          },
        });
      }

      const response = await this.client.customers.search({
        cursor: options?.cursor,
        limit: options?.limit ? BigInt(options.limit) : undefined,
        query:
          filters.length > 0
            ? {
                filter: {
                  ...filters.reduce((acc, f) => ({ ...acc, ...f }), {}),
                },
              }
            : undefined,
      });

      return {
        data: (response.customers ?? []) as Customer[],
        cursor: response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }

  /**
   * List all customers
   *
   * @param options - List options
   * @returns Array of customers
   *
   * @example
   * ```typescript
   * const customers = await square.customers.list({ limit: 50 });
   * ```
   */
  async list(options?: { limit?: number }): Promise<Customer[]> {
    try {
      const customers: Customer[] = [];
      const limit = options?.limit ?? 100;

      const page = await this.client.customers.list({});

      for await (const customer of page) {
        customers.push(customer as Customer);
        if (customers.length >= limit) {
          break;
        }
      }

      return customers;
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
