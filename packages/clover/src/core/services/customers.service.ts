import type { CloverHttp } from '../http.js';
import type { PaginatedResponse, PaginationOptions } from '../types/index.js';
import { parseCloverError, CloverValidationError } from '../errors.js';

/**
 * A Clover Platform customer (`/v3/merchants/{mId}/customers`).
 */
export interface Customer {
  id?: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: { emailAddress: string }[];
  phoneNumbers?: { phoneNumber: string }[];
  marketingAllowed?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Options for creating a customer. `email`/`phone` are conveniences that map to
 * Clover's `emailAddresses` / `phoneNumbers` arrays.
 */
export interface CreateCustomerOptions {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  marketingAllowed?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Options for updating a customer.
 */
export type UpdateCustomerOptions = CreateCustomerOptions;

function toCustomerBody(options: CreateCustomerOptions): Record<string, unknown> {
  const body: Record<string, unknown> = {
    firstName: options.firstName,
    lastName: options.lastName,
    marketingAllowed: options.marketingAllowed,
    metadata: options.metadata,
  };
  if (options.email) {
    body.emailAddresses = [{ emailAddress: options.email }];
  }
  if (options.phone) {
    body.phoneNumbers = [{ phoneNumber: options.phone }];
  }
  return body;
}

/**
 * Clover Platform list envelope (`{ elements, href }`).
 */
interface CloverListResponse<T> {
  elements?: T[];
}

/**
 * Customers service wrapping Clover's Platform
 * [customers](https://docs.clover.com/dev/reference/customerscreatecustomer)
 * API (`/v3/merchants/{mId}/customers`).
 *
 * Requires a `merchantId` on the client.
 *
 * @example
 * ```typescript
 * const customer = await clover.customers.create({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 * });
 * ```
 */
export class CustomersService {
  constructor(private readonly http: CloverHttp) {}

  private basePath(): string {
    const merchantId = this.http.merchantId;
    if (!merchantId) {
      throw new CloverValidationError(
        'merchantId is required for customer operations. Set it in the client config.',
        'merchantId'
      );
    }
    return `/v3/merchants/${encodeURIComponent(merchantId)}/customers`;
  }

  /**
   * Create a customer.
   *
   * @throws {CloverValidationError} When no identifying field is provided
   */
  async create(options: CreateCustomerOptions): Promise<Customer> {
    if (!options.firstName && !options.lastName && !options.email && !options.phone) {
      throw new CloverValidationError(
        'At least one of firstName, lastName, email, or phone is required'
      );
    }

    try {
      return await this.http.request<Customer>('platform', 'POST', this.basePath(), {
        body: toCustomerBody(options),
      });
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Retrieve a customer by ID.
   */
  async get(customerId: string): Promise<Customer> {
    try {
      return await this.http.request<Customer>(
        'platform',
        'GET',
        `${this.basePath()}/${encodeURIComponent(customerId)}`
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Update a customer.
   */
  async update(customerId: string, options: UpdateCustomerOptions): Promise<Customer> {
    try {
      return await this.http.request<Customer>(
        'platform',
        'POST',
        `${this.basePath()}/${encodeURIComponent(customerId)}`,
        { body: toCustomerBody(options) }
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * Delete a customer.
   */
  async delete(customerId: string): Promise<void> {
    try {
      await this.http.request<unknown>(
        'platform',
        'DELETE',
        `${this.basePath()}/${encodeURIComponent(customerId)}`
      );
    } catch (error) {
      throw parseCloverError(error);
    }
  }

  /**
   * List customers with offset-based pagination.
   */
  async list(options?: PaginationOptions): Promise<PaginatedResponse<Customer>> {
    try {
      const response = await this.http.request<CloverListResponse<Customer>>(
        'platform',
        'GET',
        this.basePath(),
        { query: { limit: options?.limit, offset: options?.offset } }
      );
      return { data: response.elements ?? [] };
    } catch (error) {
      throw parseCloverError(error);
    }
  }
}
