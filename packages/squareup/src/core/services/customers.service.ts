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
 * Field used to sort customers when listing.
 *
 * - `DEFAULT` — sort by the attribute Square selects by default
 * - `CREATED_AT` — sort by customer creation time
 */
export type CustomerSortField = 'DEFAULT' | 'CREATED_AT';

/**
 * Sort direction for list results.
 */
export type CustomerSortOrder = 'ASC' | 'DESC';

/**
 * Options for listing customers
 */
export interface ListCustomersOptions {
  limit?: number;
  cursor?: string;
  /**
   * Field to sort by. Defaults to `DEFAULT` when omitted.
   *
   * A valid value is always sent to avoid an empty `sort_field=` query
   * parameter, which the Square API rejects with a 400.
   */
  sortField?: CustomerSortField;
  /**
   * Sort direction. Defaults to `DESC` when omitted.
   *
   * A valid value is always sent alongside `sort_field` to avoid an empty
   * `sort_order=` query parameter, which the Square API rejects with a 400.
   */
  sortOrder?: CustomerSortOrder;
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
      const hasFilters = options?.emailAddress ?? options?.phoneNumber ?? options?.referenceId;

      // When query is provided without specific filters, use list + client-side filtering
      const query = options?.query?.trim();
      if (query && !hasFilters) {
        return await this.searchByQuery(query, options?.cursor, options?.limit);
      }

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

  private matchesQuery(customer: Customer, terms: string[]): boolean {
    const fields = [
      customer.givenName,
      customer.familyName,
      `${customer.givenName ?? ''} ${customer.familyName ?? ''}`.trim(),
      customer.emailAddress,
      customer.companyName,
      customer.address?.locality,
    ];

    return terms.every((term) =>
      fields.some((field) => field?.toLowerCase().includes(term))
    );
  }

  private async searchByQuery(
    query: string,
    cursor?: string,
    limit?: number
  ): Promise<{ data: Customer[]; cursor?: string }> {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results: Customer[] = [];
    const pageSize = 100;
    let currentCursor = cursor;

    do {
      const page = await this.client.customers.list({
        cursor: currentCursor,
        limit: pageSize,
        // Always send a valid sort_field/sort_order pair; see list() for why.
        // Omitting sortOrder serializes `sort_order=` and 400s on text queries.
        sortField: 'DEFAULT',
        sortOrder: 'DESC',
      });

      const customers = (page.response.customers ?? []) as Customer[];
      for (const customer of customers) {
        if (this.matchesQuery(customer, terms)) {
          results.push(customer);
        }
      }

      currentCursor = page.response.cursor;

      if (limit && results.length >= limit) {
        return { data: results.slice(0, limit), cursor: currentCursor };
      }
    } while (currentCursor);

    return { data: results };
  }

  /**
   * List customers with cursor-based pagination
   *
   * @param options - List options including cursor for pagination
   * @returns Customers and optional cursor for next page
   *
   * @example
   * ```typescript
   * // Get first page
   * const page1 = await square.customers.list({ limit: 50 });
   *
   * // Get next page using cursor
   * const page2 = await square.customers.list({ cursor: page1.cursor, limit: 50 });
   *
   * // Sort by creation time, newest first
   * const recent = await square.customers.list({ sortField: 'CREATED_AT', sortOrder: 'DESC' });
   * ```
   */
  async list(
    options?: ListCustomersOptions
  ): Promise<{ customers: Customer[]; cursor?: string }> {
    try {
      const page = await this.client.customers.list({
        cursor: options?.cursor,
        limit: options?.limit,
        // Always send a valid enum. With sortField undefined, square SDK
        // v44.1.0 emits `sort_field=` (empty), which Square rejects with a 400.
        sortField: options?.sortField ?? 'DEFAULT',
        // Same SDK serialization issue as sortField: an undefined sortOrder is
        // emitted as an empty `sort_order=`, which Square rejects with a 400.
        // Default it so a valid value always accompanies sort_field.
        sortOrder: options?.sortOrder ?? 'DESC',
      });

      return {
        customers: (page.response.customers ?? []) as Customer[],
        cursor: page.response.cursor,
      };
    } catch (error) {
      throw parseSquareError(error);
    }
  }
}
