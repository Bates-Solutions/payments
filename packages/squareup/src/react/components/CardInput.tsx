import React, { forwardRef, useImperativeHandle } from 'react';
import { useSquarePayment } from '../hooks/useSquarePayment.js';
import type { CardOptions } from '../types.js';

/**
 * Props for CardInput component
 */
export interface CardInputProps {
  /** Card input styling options */
  cardOptions?: CardOptions;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Callback when card is ready */
  onReady?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when card brand changes */
  onCardBrandChanged?: (brand: string) => void;
}

/**
 * CardInput imperative handle
 */
export interface CardInputHandle {
  /** Tokenize the card input */
  tokenize: () => Promise<string>;
  /** Whether the card is ready */
  ready: boolean;
  /** Current error, if any */
  error: Error | null;
  /** Whether tokenization is in progress */
  loading: boolean;
}

/**
 * Pre-built card input component using Square Web Payments SDK
 *
 * @example
 * ```tsx
 * import { CardInput, CardInputHandle } from '@bates-solutions/squareup/react';
 *
 * function Checkout() {
 *   const cardRef = useRef<CardInputHandle>(null);
 *
 *   const handlePay = async () => {
 *     if (!cardRef.current?.ready) return;
 *
 *     try {
 *       const token = await cardRef.current.tokenize();
 *       // Send token to your server
 *       console.log('Token:', token);
 *     } catch (err) {
 *       console.error('Tokenization failed:', err);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <CardInput
 *         ref={cardRef}
 *         onReady={() => console.log('Card input ready')}
 *         onError={(err) => console.error('Error:', err)}
 *       />
 *       <button onClick={handlePay}>Pay</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const CardInput = forwardRef<CardInputHandle, CardInputProps>(function CardInput(
  { cardOptions, className, style, onReady, onError, onCardBrandChanged: _onCardBrandChanged },
  ref
) {
  const { cardRef, tokenize, ready, loading, error } = useSquarePayment({
    cardOptions,
    onReady,
    onError,
  });

  // Expose imperative methods
  useImperativeHandle(
    ref,
    () => ({
      tokenize,
      ready,
      error,
      loading,
    }),
    [tokenize, ready, error, loading]
  );

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        minHeight: '40px',
        ...style,
      }}
    />
  );
});

CardInput.displayName = 'CardInput';
