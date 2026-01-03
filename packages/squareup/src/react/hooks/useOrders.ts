import { useState, useCallback } from 'react';
import type { MutationState } from '../types.js';

/**
 * Line item input for order creation
 */
export interface OrderLineItemInput {
  /** Item name (for ad-hoc items) */
  name?: string;
  /** Catalog object ID (for catalog items) */
  catalogObjectId?: string;
  /** Quantity (default: 1) */
  quantity?: number;
  /** Amount in smallest currency unit (required for ad-hoc items) */
  amount?: number;
  /** Item note */
  note?: string;
}

/**
 * Order creation options
 */
export interface CreateOrderInput {
  /** Line items for the order */
  lineItems: OrderLineItemInput[];
  /** Customer ID to associate with order */
  customerId?: string;
  /** Reference ID for external tracking */
  referenceId?: string;
  /** Optional payment token to pay for the order */
  paymentToken?: string;
}

/**
 * Order response
 */
export interface OrderResponse {
  id: string;
  status: string;
  totalMoney?: {
    amount: number;
    currency: string;
  };
  lineItems?: Array<{
    uid?: string;
    name?: string;
    quantity?: string;
    totalMoney?: {
      amount: number;
      currency: string;
    };
  }>;
  customerId?: string;
  referenceId?: string;
  createdAt?: string;
}

/**
 * Options for useOrders hook
 */
export interface UseOrdersOptions {
  /** API endpoint for orders (default: /api/orders) */
  apiEndpoint?: string;
  /** Callback on successful order creation */
  onSuccess?: (order: OrderResponse) => void;
  /** Callback on order error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useOrders hook
 */
export interface UseOrdersReturn extends MutationState<OrderResponse> {
  /** Create a new order */
  create: (options: CreateOrderInput) => Promise<OrderResponse>;
  /** Get an order by ID */
  get: (orderId: string) => Promise<OrderResponse>;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Hook for managing orders via your backend API
 *
 * @param options - Hook configuration
 * @returns Order management functions and state
 *
 * @example
 * ```tsx
 * function Checkout() {
 *   const { cardRef, tokenize, ready } = useSquarePayment();
 *   const { create: createOrder, loading, error } = useOrders({
 *     onSuccess: (order) => console.log('Order created:', order.id),
 *   });
 *
 *   const handleCheckout = async () => {
 *     const token = await tokenize();
 *     await createOrder({
 *       lineItems: [
 *         { name: 'Latte', amount: 450 },
 *         { name: 'Croissant', amount: 350 },
 *       ],
 *       paymentToken: token,
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <div ref={cardRef} />
 *       <button onClick={handleCheckout} disabled={!ready || loading}>
 *         Pay $8.00
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { apiEndpoint = '/api/orders', onSuccess, onError } = options;

  const [data, setData] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: CreateOrderInput): Promise<OrderResponse> => {
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
          throw new Error(errorData.message ?? `Order creation failed: ${response.statusText}`);
        }

        const order = (await response.json()) as OrderResponse;
        setData(order);
        onSuccess?.(order);
        return order;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Order creation failed');
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
    async (orderId: string): Promise<OrderResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiEndpoint}/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string };
          throw new Error(errorData.message ?? `Failed to get order: ${response.statusText}`);
        }

        const order = (await response.json()) as OrderResponse;
        setData(order);
        return order;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get order');
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
    reset,
    data,
    error,
    loading,
  };
}
