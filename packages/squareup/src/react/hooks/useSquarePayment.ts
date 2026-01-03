import { useState, useCallback, useRef, useEffect } from 'react';
import { useSquare } from '../SquareProvider.js';
import type { Card, CardOptions, UseSquarePaymentReturn, TokenResult } from '../types.js';

/**
 * Options for useSquarePayment hook
 */
export interface UseSquarePaymentOptions {
  /** Card input styling options */
  cardOptions?: CardOptions;
  /** Callback when card is ready */
  onReady?: () => void;
  /** Callback when tokenization succeeds */
  onTokenize?: (token: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Hook for integrating Square Web Payments SDK card input
 *
 * @param options - Configuration options
 * @returns Card input ref, tokenize function, and state
 *
 * @example
 * ```tsx
 * function Checkout() {
 *   const { cardRef, tokenize, ready, loading, error } = useSquarePayment({
 *     onReady: () => console.log('Card input ready'),
 *     onTokenize: (token) => console.log('Token:', token),
 *     onError: (err) => console.error('Error:', err),
 *   });
 *
 *   const handlePay = async () => {
 *     try {
 *       const token = await tokenize();
 *       // Send token to your server to complete payment
 *     } catch (err) {
 *       console.error('Tokenization failed:', err);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <div ref={cardRef} />
 *       <button onClick={handlePay} disabled={!ready || loading}>
 *         Pay
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSquarePayment(options: UseSquarePaymentOptions = {}): UseSquarePaymentReturn {
  const { cardOptions, onReady, onTokenize, onError } = options;
  const { payments, sdkLoaded, error: sdkError } = useSquare();

  const [card, setCard] = useState<Card | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(sdkError);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<Card | null>(null);

  // Update error state when SDK error changes
  useEffect(() => {
    if (sdkError) {
      setError(sdkError);
      onError?.(sdkError);
    }
  }, [sdkError, onError]);

  // Initialize card when SDK is loaded
  useEffect(() => {
    if (!sdkLoaded || !payments || !containerRef.current) {
      return;
    }

    let mounted = true;

    async function initializeCard() {
      if (!payments) return;

      try {
        const cardInstance = await payments.card(cardOptions);

        if (!mounted || !containerRef.current) {
          await cardInstance.destroy();
          return;
        }

        await cardInstance.attach(containerRef.current);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!mounted) {
          await cardInstance.destroy();
          return;
        }

        cardRef.current = cardInstance;
        setCard(cardInstance);
        setReady(true);
        setError(null);
        onReady?.();
      } catch (err) {
        if (!mounted) return;
        const error = err instanceof Error ? err : new Error('Failed to initialize card');
        setError(error);
        onError?.(error);
      }
    }

    void initializeCard();

    return () => {
      mounted = false;
      if (cardRef.current) {
        void cardRef.current.destroy();
        cardRef.current = null;
      }
    };
  }, [sdkLoaded, payments, cardOptions, onReady, onError]);

  /**
   * Tokenize the card input
   * @returns Payment token
   */
  const tokenize = useCallback(async (): Promise<string> => {
    if (!card) {
      throw new Error('Card input not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const result: TokenResult = await card.tokenize();

      if (result.status === 'OK' && result.token) {
        onTokenize?.(result.token);
        return result.token;
      }

      if (result.status === 'Cancel') {
        throw new Error('Tokenization was cancelled');
      }

      const errorMessage =
        result.errors?.map((e) => e.message).join(', ') ?? 'Tokenization failed';
      throw new Error(errorMessage);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Tokenization failed');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [card, onTokenize, onError]);

  /**
   * Ref callback to attach container element
   */
  const cardRefCallback = useCallback((element: HTMLDivElement | null) => {
    containerRef.current = element;
  }, []);

  return {
    cardRef: cardRefCallback,
    tokenize,
    card,
    ready,
    loading,
    error,
  };
}
