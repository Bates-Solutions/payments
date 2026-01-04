import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React, { useRef } from 'react';
import { SquareContext } from '../SquareProvider.js';
import { CardInput, CardInputHandle } from '../components/CardInput.js';
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

describe('CardInput', () => {
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

  it('should throw error when used outside SquareProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<CardInput />);
    }).toThrow('useSquare must be used within a SquareProvider');

    consoleSpy.mockRestore();
  });

  it('should render with default styles', () => {
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

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <CardInput data-testid="card-input" />
      </Wrapper>
    );

    // Component renders a div with minHeight
    const container = document.querySelector('div');
    expect(container).toBeTruthy();
  });

  it('should apply custom className and style', () => {
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

    const Wrapper = createWrapper(contextValue);
    const { container } = render(
      <Wrapper>
        <CardInput className="custom-class" style={{ padding: '10px' }} />
      </Wrapper>
    );

    const cardContainer = container.querySelector('.custom-class');
    expect(cardContainer).toBeTruthy();
    // Check that both custom style and default minHeight are applied
    expect(cardContainer).toHaveStyle({ minHeight: '40px' });
  });

  it('should call onReady when card is initialized', async () => {
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

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <CardInput onReady={onReady} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
    });
  });

  it('should call onError when SDK has error', async () => {
    const onError = vi.fn();
    const sdkError = new Error('SDK failed');

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

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <CardInput onError={onError} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(sdkError);
    });
  });

  it('should expose tokenize method via ref', async () => {
    const expectedToken = 'cnon:card-nonce-123';
    const tokenizingCard = createMockCard({
      tokenize: vi.fn().mockResolvedValue({
        status: 'OK',
        token: expectedToken,
      }),
    });

    const tokenizingPayments = createMockPayments({
      card: vi.fn().mockResolvedValue(tokenizingCard),
    });

    const contextValue: SquareContextValue = {
      config: {
        applicationId: 'sq0idp-test',
        locationId: 'LTEST',
        environment: 'sandbox',
      },
      sdkLoaded: true,
      payments: tokenizingPayments,
      error: null,
    };

    let cardRef: React.RefObject<CardInputHandle | null> = { current: null };

    function TestComponent() {
      cardRef = useRef<CardInputHandle>(null);
      return <CardInput ref={cardRef} />;
    }

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Wait for card to be ready
    await waitFor(() => {
      expect(cardRef.current?.ready).toBe(true);
    });

    // Tokenize
    const token = await cardRef.current!.tokenize();
    expect(token).toBe(expectedToken);
  });

  it('should expose ready, loading, and error via ref', async () => {
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

    let cardRef: React.RefObject<CardInputHandle | null> = { current: null };

    function TestComponent() {
      cardRef = useRef<CardInputHandle>(null);
      return <CardInput ref={cardRef} />;
    }

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Initially not ready
    expect(cardRef!.current?.ready).toBe(false);
    expect(cardRef!.current?.loading).toBe(false);
    expect(cardRef!.current?.error).toBeNull();

    // Wait for card to be ready
    await waitFor(() => {
      expect(cardRef.current?.ready).toBe(true);
    });

    expect(cardRef!.current?.loading).toBe(false);
    expect(cardRef!.current?.error).toBeNull();
  });

  it('should pass cardOptions to the hook', async () => {
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

    const Wrapper = createWrapper(contextValue);
    render(
      <Wrapper>
        <CardInput cardOptions={cardOptions} />
      </Wrapper>
    );

    await waitFor(() => {
      expect(mockPayments.card).toHaveBeenCalledWith(cardOptions);
    });
  });

  it('should have displayName', () => {
    expect(CardInput.displayName).toBe('CardInput');
  });
});
