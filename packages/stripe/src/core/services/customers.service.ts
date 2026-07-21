import type Stripe from 'stripe';
import type { PaginatedResponse } from '../types/index.js';
import { parseStripeError, StripeValidationError } from '../errors.js';
import { createIdempotencyKey } from '../utils.js';

/**
 * A Stripe Customer
 */
export type Customer = Stripe.Customer;

/**
 * Address for a customer
 */
export interface CustomerAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Options for creating a customer
 */
export interface CreateCustomerOptions {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  address?: CustomerAddress;
  metadata?: Record<string, string>;
  idempotencyKey?: string;
}

/**
 * Options for updating a customer
 */
export interface UpdateCustomerOptions {
  email?: string;
  name?: string;
  phone?: string;
  description?: string;
  address?: CustomerAddress;
  metadata?: Record<string, string>;
}

/**
 * Options for listing customers
 */
export interface ListCustomersOptions {
  limit?: number;
  /** Filter by exact email address */
  email?: string;
  /** Cursor: return records after this customer ID */
  startingAfter?: string;
}

function toStripeAddress(address?: CustomerAddress): Stripe.AddressParam | undefined {
  if (!address) return undefined;
  return {
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postal_code: address.postalCode,
    country: address.country,
  };
}

/**
 * Customers service wrapping Stripe Customers.
 *
 * @example
 * ```typescript
 * const customer = await stripe.customers.create({
 *   email: 'john@example.com',
 *   name: 'John Doe',
 * });
 * ```
 */
export class CustomersService {
  constructor(private readonly client: Stripe) {}

  /**
   * Create a new customer.
   *
   * @param options - Customer creation options
   * @returns Created customer
   *
   * @throws {StripeValidationError} When no identifying field is provided
   *
   * @example
   * ```typescript
   * const customer = await stripe.customers.create({
   *   email: 'john@example.com',
   *   name: 'John Doe',
   *   phone: '+15551234567',
   * });
   * ```
   */
  async create(options: CreateCustomerOptions): Promise<Customer> {
    if (!options.email && !options.name && !options.phone) {
      throw new StripeValidationError(
        'At least one of email, name, or phone is required'
      );
    }

    try {
      return await this.client.customers.create(
        {
          email: options.email,
          name: options.name,
          phone: options.phone,
          description: options.description,
          address: toStripeAddress(options.address),
          metadata: options.metadata,
        },
        { idempotencyKey: options.idempotencyKey ?? createIdempotencyKey() }
      );
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Retrieve a customer by ID.
   *
   * @param customerId - Customer ID
   * @returns The customer
   *
   * @throws {StripeApiError} When the customer has been deleted or not found
   *
   * @example
   * ```typescript
   * const customer = await stripe.customers.get('cus_123');
   * ```
   */
  async get(customerId: string): Promise<Customer> {
    try {
      const customer = await this.client.customers.retrieve(customerId);
      if ('deleted' in customer && customer.deleted) {
        throw new StripeValidationError('Customer has been deleted', 'customerId');
      }
      // Narrowed to an active Customer.
      return customer;
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Update a customer.
   *
   * @param customerId - Customer ID to update
   * @param options - Update options
   * @returns The updated customer
   *
   * @example
   * ```typescript
   * const customer = await stripe.customers.update('cus_123', {
   *   email: 'new@example.com',
   * });
   * ```
   */
  async update(customerId: string, options: UpdateCustomerOptions): Promise<Customer> {
    try {
      return await this.client.customers.update(customerId, {
        email: options.email,
        name: options.name,
        phone: options.phone,
        description: options.description,
        address: toStripeAddress(options.address),
        metadata: options.metadata,
      });
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Delete a customer.
   *
   * @param customerId - Customer ID to delete
   *
   * @example
   * ```typescript
   * await stripe.customers.delete('cus_123');
   * ```
   */
  async delete(customerId: string): Promise<void> {
    try {
      await this.client.customers.del(customerId);
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * List customers with cursor-based pagination.
   *
   * @param options - List options
   * @returns Customers and a cursor for the next page
   *
   * @example
   * ```typescript
   * const page1 = await stripe.customers.list({ limit: 50 });
   * const page2 = await stripe.customers.list({ startingAfter: page1.nextCursor });
   * ```
   */
  async list(options?: ListCustomersOptions): Promise<PaginatedResponse<Customer>> {
    try {
      const page = await this.client.customers.list({
        limit: options?.limit,
        email: options?.email,
        starting_after: options?.startingAfter,
      });

      return {
        data: page.data,
        hasMore: page.has_more,
        nextCursor: page.data.at(-1)?.id,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }

  /**
   * Search customers with Stripe's search query language.
   *
   * @param query - Search query (e.g. `email:'john@example.com'`)
   * @param options - Optional limit and pagination cursor
   * @returns Matching customers and a cursor for the next page
   *
   * @see https://docs.stripe.com/search#search-query-language
   *
   * @example
   * ```typescript
   * const { data } = await stripe.customers.search("email:'john@example.com'");
   * ```
   */
  async search(
    query: string,
    options?: { limit?: number; page?: string }
  ): Promise<PaginatedResponse<Customer>> {
    if (!query.trim()) {
      throw new StripeValidationError('query is required', 'query');
    }

    try {
      const result = await this.client.customers.search({
        query,
        limit: options?.limit,
        page: options?.page,
      });

      return {
        data: result.data,
        hasMore: result.has_more,
        nextCursor: result.next_page ?? undefined,
      };
    } catch (error) {
      throw parseStripeError(error);
    }
  }
}
