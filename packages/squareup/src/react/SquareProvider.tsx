import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { SquareProviderConfig, SquareContextValue, Payments } from './types.js';

const SquareContext = createContext<SquareContextValue | null>(null);

const SQUARE_SDK_URL = {
  sandbox: 'https://sandbox.web.squarecdn.com/v1/square.js',
  production: 'https://web.squarecdn.com/v1/square.js',
};

/**
 * Load the Square Web Payments SDK script
 */
function loadSquareSdk(environment: 'sandbox' | 'production'): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as unknown as { Square?: unknown }).Square) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(
      `script[src="${SQUARE_SDK_URL[environment]}"]`
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => { resolve(); });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Square SDK'));
      });
      return;
    }

    // Create and append script
    const script = document.createElement('script');
    script.src = SQUARE_SDK_URL[environment];
    script.async = true;
    script.onload = () => { resolve(); };
    script.onerror = () => { reject(new Error('Failed to load Square SDK')); };
    document.head.appendChild(script);
  });
}

/**
 * Props for SquareProvider
 */
export interface SquareProviderProps extends SquareProviderConfig {
  children: React.ReactNode;
}

/**
 * Square Provider component that initializes the Web Payments SDK
 *
 * @example
 * ```tsx
 * import { SquareProvider } from '@bates/squareup/react';
 *
 * function App() {
 *   return (
 *     <SquareProvider
 *       applicationId="sq0idp-xxx"
 *       locationId="LXXX"
 *       environment="sandbox"
 *     >
 *       <Checkout />
 *     </SquareProvider>
 *   );
 * }
 * ```
 */
export function SquareProvider({
  children,
  applicationId,
  locationId,
  environment = 'sandbox',
  accessToken,
  currency = 'USD',
}: SquareProviderProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [payments, setPayments] = useState<Payments | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const config = useMemo(
    () => ({
      applicationId,
      locationId,
      environment,
      accessToken,
      currency,
    }),
    [applicationId, locationId, environment, accessToken, currency]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let mounted = true;

    async function initializeSdk() {
      try {
        await loadSquareSdk(environment);

        if (!mounted) {
          return;
        }

        const Square = (window as unknown as { Square?: { payments: (appId: string, locId: string) => Promise<Payments> } }).Square;
        if (!Square) {
          throw new Error('Square SDK not available');
        }

        const paymentsInstance = await Square.payments(applicationId, locationId);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!mounted) {
          return;
        }

        setPayments(paymentsInstance);
        setSdkLoaded(true);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to initialize Square SDK'));
      }
    }

    void initializeSdk();

    return () => {
      mounted = false;
    };
  }, [applicationId, locationId, environment]);

  const value = useMemo<SquareContextValue>(
    () => ({
      config,
      sdkLoaded,
      payments,
      error,
    }),
    [config, sdkLoaded, payments, error]
  );

  return <SquareContext.Provider value={value}>{children}</SquareContext.Provider>;
}

/**
 * Hook to access Square context
 *
 * @throws Error if used outside of SquareProvider
 *
 * @example
 * ```tsx
 * function Checkout() {
 *   const { sdkLoaded, payments, error } = useSquare();
 *
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!sdkLoaded) return <div>Loading...</div>;
 *
 *   return <div>Ready to accept payments!</div>;
 * }
 * ```
 */
export function useSquare(): SquareContextValue {
  const context = useContext(SquareContext);

  if (!context) {
    throw new Error('useSquare must be used within a SquareProvider');
  }

  return context;
}

export { SquareContext };
