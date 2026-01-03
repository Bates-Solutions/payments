import { useState, useCallback } from 'react';
import type { MutationState } from '../types.js';

/**
 * Payment creation options for the hook
 */
export interface CreatePaymentInput {
  /** Payment source token from card tokenization */
  sourceId: string;
  /** Amount in smallest currency unit (cents for USD) */
  amount: number;
  /** Currency code */
  currency?: string;
  /** Customer ID to associate with payment */
  customerId?: string;
  /** Order ID to associate with payment */
  orderId?: string;
  /** Reference ID for external tracking */
  referenceId?: string;
  /** Note for the payment */
  note?: string;
  /** Whether to auto-complete the payment */
  autocomplete?: boolean;
}

/**
 * Payment response
 */
export interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  sourceType?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  orderId?: string;
  customerId?: string;
  createdAt?: string;
}

/**
 * Options for usePayments hook
 */
export interface UsePaymentsOptions {
  /** API endpoint for creating payments (default: /api/payments) */
  apiEndpoint?: string;
  /** Callback on successful payment */
  onSuccess?: (payment: PaymentResponse) => void;
  /** Callback on payment error */
  onError?: (error: Error) => void;
}

/**
 * Return type for usePayments hook
 */
export interface UsePaymentsReturn extends MutationState<PaymentResponse> {
  /** Create a new payment */
  create: (options: CreatePaymentInput) => Promise<PaymentResponse>;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Hook for creating payments via your backend API
 *
 * This hook sends payment requests to your backend, which should then
 * use the Square Payments API to process the payment.
 *
 * @param options - Hook configuration
 * @returns Payment creation function and state
 *
 * @example
 * ```tsx
 * function Checkout() {
 *   const { cardRef, tokenize, ready } = useSquarePayment();
 *   const { create: createPayment, loading, error } = usePayments({
 *     onSuccess: (payment) => console.log('Payment successful:', payment.id),
 *     onError: (err) => console.error('Payment failed:', err),
 *   });
 *
 *   const handlePay = async () => {
 *     const token = await tokenize();
 *     await createPayment({
 *       sourceId: token,
 *       amount: 1000, // $10.00
 *       currency: 'USD',
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <div ref={cardRef} />
 *       <button onClick={handlePay} disabled={!ready || loading}>
 *         Pay $10.00
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePayments(options: UsePaymentsOptions = {}): UsePaymentsReturn {
  const { apiEndpoint = '/api/payments', onSuccess, onError } = options;

  const [data, setData] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const create = useCallback(
    async (input: CreatePaymentInput): Promise<PaymentResponse> => {
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
          throw new Error(errorData.message ?? `Payment failed: ${response.statusText}`);
        }

        const payment = (await response.json()) as PaymentResponse;
        setData(payment);
        onSuccess?.(payment);
        return payment;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Payment failed');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, onSuccess, onError]
  );

  return {
    create,
    reset,
    data,
    error,
    loading,
  };
}
