import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSquare } from '../SquareProvider.js';
import type { GooglePay, ApplePay, DigitalWalletOptions, TokenResult } from '../types.js';

/**
 * Payment method type
 */
export type PaymentMethodType = 'googlePay' | 'applePay';

/**
 * Props for PaymentButton component
 */
export interface PaymentButtonProps {
  /** Payment method type */
  type: PaymentMethodType;
  /** Amount to display/charge (for display purposes) */
  amount?: number;
  /** Currency code */
  currency?: string;
  /** Button styling options */
  buttonOptions?: DigitalWalletOptions;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Callback when payment method is ready */
  onReady?: () => void;
  /** Callback when payment is successful */
  onPayment?: (token: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when payment is cancelled */
  onCancel?: () => void;
}

/**
 * Digital wallet payment button (Google Pay / Apple Pay)
 *
 * @example
 * ```tsx
 * import { PaymentButton } from '@bates-solutions/squareup/react';
 *
 * function Checkout() {
 *   const handlePayment = async (token: string) => {
 *     // Send token to your server to complete payment
 *     const response = await fetch('/api/payments', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ sourceId: token, amount: 1000 }),
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <PaymentButton
 *         type="googlePay"
 *         amount={1000}
 *         currency="USD"
 *         onPayment={handlePayment}
 *         onError={(err) => console.error('Error:', err)}
 *       />
 *       <PaymentButton
 *         type="applePay"
 *         amount={1000}
 *         currency="USD"
 *         onPayment={handlePayment}
 *         onError={(err) => console.error('Error:', err)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function PaymentButton({
  type,
  amount: _amount,
  currency: _currency,
  buttonOptions,
  className,
  style,
  onReady,
  onPayment,
  onError,
  onCancel,
}: PaymentButtonProps) {
  const { payments, sdkLoaded, error: sdkError } = useSquare();
  const containerRef = useRef<HTMLDivElement>(null);
  const paymentMethodRef = useRef<GooglePay | ApplePay | null>(null);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<Error | null>(sdkError);

  // Initialize payment method
  useEffect(() => {
    if (!sdkLoaded || !payments || !containerRef.current) {
      return;
    }

    let mounted = true;

    async function initializePaymentMethod() {
      if (!payments) return;

      try {
        let paymentMethod: GooglePay | ApplePay;

        if (type === 'googlePay') {
          paymentMethod = await payments.googlePay({});
        } else {
          paymentMethod = await payments.applePay({});
        }

        if (!mounted || !containerRef.current) {
          await paymentMethod.destroy();
          return;
        }

        await paymentMethod.attach(containerRef.current, buttonOptions);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!mounted) {
          await paymentMethod.destroy();
          return;
        }

        paymentMethodRef.current = paymentMethod;
        setReady(true);
        setError(null);
        onReady?.();
      } catch (err) {
        if (!mounted) return;
        const error = err instanceof Error ? err : new Error(`Failed to initialize ${type}`);
        setError(error);
        onError?.(error);
      }
    }

    void initializePaymentMethod();

    return () => {
      mounted = false;
      if (paymentMethodRef.current) {
        void paymentMethodRef.current.destroy();
        paymentMethodRef.current = null;
      }
    };
  }, [sdkLoaded, payments, type, buttonOptions, onReady, onError]);

  // Handle click/tap on the button
  const handleClick = useCallback(async () => {
    if (!paymentMethodRef.current || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result: TokenResult = await paymentMethodRef.current.tokenize();

      if (result.status === 'OK' && result.token) {
        onPayment?.(result.token);
      } else if (result.status === 'Cancel') {
        onCancel?.();
      } else {
        const errorMessage =
          result.errors?.map((e) => e.message).join(', ') ?? 'Payment failed';
        throw new Error(errorMessage);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [loading, onPayment, onCancel, onError]);

  // Update error state when SDK error changes
  useEffect(() => {
    if (sdkError) {
      setError(sdkError);
      onError?.(sdkError);
    }
  }, [sdkError, onError]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        minHeight: '48px',
        cursor: ready && !loading ? 'pointer' : 'default',
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
      onClick={() => { void handleClick(); }}
      role="button"
      tabIndex={ready ? 0 : -1}
      aria-disabled={!ready || loading}
      aria-label={`Pay with ${type === 'googlePay' ? 'Google Pay' : 'Apple Pay'}`}
    />
  );
}
