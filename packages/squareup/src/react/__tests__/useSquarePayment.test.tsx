import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import { SquareContext } from '../SquareProvider.js';
import { useSquarePayment } from '../hooks/useSquarePayment.js';
import type { SquareContextValue, Card, Payments } from '../types.js';

function createMockCard(overrides: Partial<Card> = {}): Card {
  return {
    attach: vi.fn().mockResolvedValue(undefined),
    detach: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'cnon:test-token' }),
    configure: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    ...overrides,
  };
}

function createMockPayments(overrides: Partial<Payments> = {}): Payments {
  return {
    card: vi.fn().mockResolvedValue(createMockCard()),
    googlePay: vi.fn().mockResolvedValue({}),
    applePay: vi.fn().mockResolvedValue({}),
    giftCard: vi.fn().mockResolvedValue({}),
    ach: vi.fn().mockResolvedValue({}),
    verifyBuyer: vi.fn().mockResolvedValue({}),
    ...overrides,
  } as Payments;
}

function createWrapper(contextValue: SquareContextValue) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SquareContext.Provider value={contextValue}>{children}</SquareContext.Provider>;
  };
}

// Test component that uses the hook in a realistic way

// Wrapper that sets up context before using hook
function TestWrapper({
  contextValue,
  options,
  onReady,
}: {
  contextValue: SquareContextValue;
  options?: Parameters<typeof useSquarePayment>[0];
  onReady?: (result: ReturnType<typeof useSquarePayment>) => void;
}) {
  return (
    <SquareContext.Provider value={contextValue}>
      <TestInner options={options} onReady={onReady} />
    </SquareContext.Provider>
  );
}

function TestInner({
  options,
  onReady,
}: {
  options?: Parameters<typeof useSquarePayment>[0];
  onReady?: (result: ReturnType<typeof useSquarePayment>) => void;
}) {
  const result = useSquarePayment(options);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (result.ready && !initialized) {
      setInitialized(true);
      onReady?.(result);
    }
  }, [result.ready, result, initialized, onReady]);

  return (
    <div>
      <div data-testid="card-container" ref={result.cardRef} />
      <div data-testid="ready">{result.ready.toString()}</div>
      <div data-testid="loading">{result.loading.toString()}</div>
      <div data-testid="error">{result.error?.message ?? 'null'}</div>
    </div>
  );
}

describe('useSquarePayment', () => {
  let mockCard: Card;
  let mockPayments: Payments;

  beforeEach(() => {
    mockCard = createMockCard();
    mockPayments = createMockPayments({
      card: vi.fn().mockResolvedValue(mockCard),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should throw error when used outside SquareProvider', () => {
      expect(() => {
        renderHook(() => useSquarePayment());
      }).toThrow('useSquare must be used within a SquareProvider');
    });

    it('should initialize with default state when SDK not loaded', () => {
      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: false,
        payments: null,
        error: null,
      };

      const { result } = renderHook(() => useSquarePayment(), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.ready).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.card).toBeNull();
      expect(typeof result.current.cardRef).toBe('function');
      expect(typeof result.current.tokenize).toBe('function');
    });

    it('should propagate SDK error to hook state', () => {
      const sdkError = new Error('SDK failed to load');
      const onError = vi.fn();

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: false,
        payments: null,
        error: sdkError,
      };

      const { result } = renderHook(() => useSquarePayment({ onError }), {
        wrapper: createWrapper(contextValue),
      });

      expect(result.current.error).toBe(sdkError);
      expect(onError).toHaveBeenCalledWith(sdkError);
    });
  });

  describe('card initialization with component', () => {
    it('should initialize card when SDK is loaded and container is attached', async () => {
      const onReady = vi.fn();

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: mockPayments,
        error: null,
      };

      render(<TestWrapper contextValue={contextValue} options={{ onReady }} />);

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      expect(mockPayments.card).toHaveBeenCalled();
      expect(mockCard.attach).toHaveBeenCalled();
      expect(onReady).toHaveBeenCalled();
    });

    it('should pass cardOptions to payments.card', async () => {
      const cardOptions = {
        style: {
          input: { color: '#333' } as CSSStyleDeclaration,
        },
      };

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: mockPayments,
        error: null,
      };

      render(<TestWrapper contextValue={contextValue} options={{ cardOptions }} />);

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      expect(mockPayments.card).toHaveBeenCalledWith(cardOptions);
    });

    it('should handle card initialization error', async () => {
      const initError = new Error('Card initialization failed');
      const onError = vi.fn();

      const failingPayments = createMockPayments({
        card: vi.fn().mockRejectedValue(initError),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: failingPayments,
        error: null,
      };

      render(<TestWrapper contextValue={contextValue} options={{ onError }} />);

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('Card initialization failed');
      });

      expect(screen.getByTestId('ready').textContent).toBe('false');
      expect(onError).toHaveBeenCalledWith(initError);
    });

    it('should destroy card on unmount', async () => {
      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: mockPayments,
        error: null,
      };

      const { unmount } = render(<TestWrapper contextValue={contextValue} />);

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      unmount();

      expect(mockCard.destroy).toHaveBeenCalled();
    });
  });

  describe('tokenize', () => {
    it('should throw error when card not initialized', async () => {
      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: false,
        payments: null,
        error: null,
      };

      const { result } = renderHook(() => useSquarePayment(), {
        wrapper: createWrapper(contextValue),
      });

      await expect(result.current.tokenize()).rejects.toThrow('Card input not initialized');
    });

    it('should tokenize successfully and return token', async () => {
      const onTokenize = vi.fn();
      const expectedToken = 'cnon:card-nonce-123';

      const tokenizingCard = createMockCard({
        tokenize: vi.fn().mockResolvedValue({
          status: 'OK',
          token: expectedToken,
        }),
      });

      const paymentsWithTokenizing = createMockPayments({
        card: vi.fn().mockResolvedValue(tokenizingCard),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: paymentsWithTokenizing,
        error: null,
      };

      let hookResult: ReturnType<typeof useSquarePayment> | null = null;

      render(
        <TestWrapper
          contextValue={contextValue}
          options={{ onTokenize }}
          onReady={(result) => {
            hookResult = result;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      expect(hookResult).not.toBeNull();

      let token: string | undefined;
      await act(async () => {
        token = await hookResult!.tokenize();
      });

      expect(token).toBe(expectedToken);
      expect(onTokenize).toHaveBeenCalledWith(expectedToken);
    });

    it('should handle tokenization cancel', async () => {
      const onError = vi.fn();

      const cancellingCard = createMockCard({
        tokenize: vi.fn().mockResolvedValue({
          status: 'Cancel',
        }),
      });

      const paymentsWithCancellingCard = createMockPayments({
        card: vi.fn().mockResolvedValue(cancellingCard),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: paymentsWithCancellingCard,
        error: null,
      };

      let hookResult: ReturnType<typeof useSquarePayment> | null = null;

      render(
        <TestWrapper
          contextValue={contextValue}
          options={{ onError }}
          onReady={(result) => {
            hookResult = result;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      // Wait for hookResult to be set
      await waitFor(() => {
        expect(hookResult).not.toBeNull();
      });

      let error: Error | undefined;
      await act(async () => {
        try {
          await hookResult!.tokenize();
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Tokenization was cancelled');
      expect(onError).toHaveBeenCalled();
    });

    it('should handle tokenization errors with multiple messages', async () => {
      const errorCard = createMockCard({
        tokenize: vi.fn().mockResolvedValue({
          status: 'Error',
          errors: [
            { type: 'INVALID_CARD_DATA', message: 'Card number is invalid' },
            { type: 'INVALID_EXPIRATION', message: 'Expiration date is invalid' },
          ],
        }),
      });

      const paymentsWithErrorCard = createMockPayments({
        card: vi.fn().mockResolvedValue(errorCard),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: paymentsWithErrorCard,
        error: null,
      };

      let hookResult: ReturnType<typeof useSquarePayment> | null = null;

      render(
        <TestWrapper
          contextValue={contextValue}
          onReady={(result) => {
            hookResult = result;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      // Wait for hookResult to be set
      await waitFor(() => {
        expect(hookResult).not.toBeNull();
      });

      let error: Error | undefined;
      await act(async () => {
        try {
          await hookResult!.tokenize();
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Card number is invalid, Expiration date is invalid');
    });

    it('should handle tokenization with no errors array', async () => {
      const errorCard = createMockCard({
        tokenize: vi.fn().mockResolvedValue({
          status: 'Error',
          // No errors array
        }),
      });

      const paymentsWithErrorCard = createMockPayments({
        card: vi.fn().mockResolvedValue(errorCard),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: paymentsWithErrorCard,
        error: null,
      };

      let hookResult: ReturnType<typeof useSquarePayment> | null = null;

      render(
        <TestWrapper
          contextValue={contextValue}
          onReady={(result) => {
            hookResult = result;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      // Wait for hookResult to be set
      await waitFor(() => {
        expect(hookResult).not.toBeNull();
      });

      let error: Error | undefined;
      await act(async () => {
        try {
          await hookResult!.tokenize();
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Tokenization failed');
    });

    it('should handle unexpected errors during tokenization', async () => {
      const onError = vi.fn();
      const unexpectedError = new Error('Network error');

      const throwingCard = createMockCard({
        tokenize: vi.fn().mockRejectedValue(unexpectedError),
      });

      const paymentsWithThrowingCard = createMockPayments({
        card: vi.fn().mockResolvedValue(throwingCard),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: paymentsWithThrowingCard,
        error: null,
      };

      let hookResult: ReturnType<typeof useSquarePayment> | null = null;

      render(
        <TestWrapper
          contextValue={contextValue}
          options={{ onError }}
          onReady={(result) => {
            hookResult = result;
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready').textContent).toBe('true');
      });

      // Wait for hookResult to be set
      await waitFor(() => {
        expect(hookResult).not.toBeNull();
      });

      let error: Error | undefined;
      await act(async () => {
        try {
          await hookResult!.tokenize();
        } catch (e) {
          error = e as Error;
        }
      });

      expect(error?.message).toBe('Network error');
      expect(onError).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe('cardRef callback', () => {
    it('should handle null element', () => {
      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: mockPayments,
        error: null,
      };

      const { result } = renderHook(() => useSquarePayment(), {
        wrapper: createWrapper(contextValue),
      });

      // Should not throw when passing null
      act(() => {
        result.current.cardRef(null);
      });

      // Card should not be initialized since there's no container
      expect(result.current.ready).toBe(false);
    });
  });
});
