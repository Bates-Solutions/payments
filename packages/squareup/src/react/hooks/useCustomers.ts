import { useState, useCallback } from 'react';
import type { MutationState } from '../types.js';

/**
 * Customer address input
 */
export interface CustomerAddressInput {
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  administrativeDistrictLevel1?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Customer creation/update options
 */
export interface CustomerInput {
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  companyName?: string;
  nickname?: string;
  note?: string;
  referenceId?: string;
  address?: CustomerAddressInput;
}

/**
 * Customer response
 */
export interface CustomerResponse {
  id: string;
  givenName?: string;
  familyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  companyName?: string;
  nickname?: string;
  note?: string;
  referenceId?: string;
  address?: CustomerAddressInput;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Options for useCustomers hook
 */
export interface UseCustomersOptions {
  /** API endpoint for customers (default: /api/customers) */
  apiEndpoint?: string;
  /** Callback on successful operation */
  onSuccess?: (customer: CustomerResponse) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useCustomers hook
 */
export interface UseCustomersReturn extends MutationState<CustomerResponse> {
  /** Create a new customer */
  create: (input: CustomerInput) => Promise<CustomerResponse>;
  /** Get a customer by ID */
  get: (customerId: string) => Promise<CustomerResponse>;
  /** Update a customer */
  update: (customerId: string, input: CustomerInput) => Promise<CustomerResponse>;
  /** Search for customers */
  search: (query: { email?: string; phone?: string }) => Promise<CustomerResponse[]>;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Hook for managing customers via your backend API
 *
 * @param options - Hook configuration
 * @returns Customer management functions and state
 *
 * @example
 * ```tsx
 * function CustomerForm() {
 *   const { create: createCustomer, loading, error, data } = useCustomers({
 *     onSuccess: (customer) => console.log('Created:', customer.id),
 *   });
 *
 *   const handleSubmit = async (formData: CustomerInput) => {
 *     await createCustomer({
 *       givenName: formData.givenName,
 *       familyName: formData.familyName,
 *       emailAddress: formData.emailAddress,
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {loading && <p>Creating customer...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *       {data && <p>Customer created: {data.id}</p>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useCustomers(options: UseCustomersOptions = {}): UseCustomersReturn {
  const { apiEndpoint = '/api/customers', onSuccess, onError } = options;

  const [data, setData] = useState<CustomerResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: CustomerInput): Promise<CustomerResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Customer creation failed: ${response.statusText}`);
        }

        const customer = (await response.json()) as CustomerResponse;
        setData(customer);
        onSuccess?.(customer);
        return customer;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Customer creation failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onSuccess, onError]
  );

  const get = useCallback(
    async (customerId: string): Promise<CustomerResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiEndpoint}/${customerId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Failed to get customer: ${response.statusText}`);
        }

        const customer = (await response.json()) as CustomerResponse;
        setData(customer);
        return customer;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get customer');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onError]
  );

  const update = useCallback(
    async (customerId: string, input: CustomerInput): Promise<CustomerResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiEndpoint}/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Customer update failed: ${response.statusText}`);
        }

        const customer = (await response.json()) as CustomerResponse;
        setData(customer);
        onSuccess?.(customer);
        return customer;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Customer update failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onSuccess, onError]
  );

  const search = useCallback(
    async (query: { email?: string; phone?: string }): Promise<CustomerResponse[]> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (query.email) params.set('email', query.email);
        if (query.phone) params.set('phone', query.phone);

        const response = await fetch(`${apiEndpoint}/search?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Customer search failed: ${response.statusText}`);
        }

        const result = (await response.json()) as { customers: CustomerResponse[] };
        return result.customers;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Customer search failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onError]
  );

  return {
    create,
    get,
    update,
    search,
    reset,
    data,
    error,
    loading,
  };
}
