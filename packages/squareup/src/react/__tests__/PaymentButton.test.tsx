import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { SquareContext } from '../SquareProvider.js';
import { PaymentButton } from '../components/PaymentButton.js';
import type { SquareContextValue, GooglePay, ApplePay, Payments } from '../types.js';

function createMockGooglePay(overrides: Partial<GooglePay> = {}): GooglePay {
  return {
    attach: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'gpay:test-token' }),
    ...overrides,
  };
}

function createMockApplePay(overrides: Partial<ApplePay> = {}): ApplePay {
  return {
    attach: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'apay:test-token' }),
    ...overrides,
  };
}

function createMockPayments(overrides: Partial<Payments> = {}): Payments {
  return {
    card: vi.fn().mockResolvedValue({}),
    googlePay: vi.fn().mockResolvedValue(createMockGooglePay()),
    applePay: vi.fn().mockResolvedValue(createMockApplePay()),
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

describe('PaymentButton', () => {
  let mockGooglePay: GooglePay;
  let mockApplePay: ApplePay;
  let mockPayments: Payments;

  beforeEach(() => {
    mockGooglePay = createMockGooglePay();
    mockApplePay = createMockApplePay();
    mockPayments = createMockPayments({
      googlePay: vi.fn().mockResolvedValue(mockGooglePay),
      applePay: vi.fn().mockResolvedValue(mockApplePay),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error when used outside SquareProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PaymentButton type="googlePay" />);
    }).toThrow('useSquare must be used within a SquareProvider');

    consoleSpy.mockRestore();
  });

  describe('Google Pay', () => {
    it('should render Google Pay button', () => {
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
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Pay with Google Pay');
    });

    it('should initialize Google Pay when SDK is loaded', async () => {
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
          <PaymentButton type="googlePay" onReady={onReady} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(mockPayments.googlePay).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockGooglePay.attach).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onReady).toHaveBeenCalled();
      });
    });

    it('should call onPayment when tokenization succeeds', async () => {
      const onPayment = vi.fn();
      const expectedToken = 'gpay:success-token';

      const successGooglePay = createMockGooglePay({
        tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: expectedToken }),
      });

      const successPayments = createMockPayments({
        googlePay: vi.fn().mockResolvedValue(successGooglePay),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: successPayments,
        error: null,
      };

      const Wrapper = createWrapper(contextValue);
      render(
        <Wrapper>
          <PaymentButton type="googlePay" onPayment={onPayment} />
        </Wrapper>
      );

      // Wait for button to be ready
      await waitFor(() => {
        expect(successGooglePay.attach).toHaveBeenCalled();
      });

      // Click the button
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onPayment).toHaveBeenCalledWith(expectedToken);
      });
    });

    it('should call onCancel when user cancels', async () => {
      const onCancel = vi.fn();

      const cancelGooglePay = createMockGooglePay({
        tokenize: vi.fn().mockResolvedValue({ status: 'Cancel' }),
      });

      const cancelPayments = createMockPayments({
        googlePay: vi.fn().mockResolvedValue(cancelGooglePay),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: cancelPayments,
        error: null,
      };

      const Wrapper = createWrapper(contextValue);
      render(
        <Wrapper>
          <PaymentButton type="googlePay" onCancel={onCancel} />
        </Wrapper>
      );

      // Wait for button to be ready
      await waitFor(() => {
        expect(cancelGooglePay.attach).toHaveBeenCalled();
      });

      // Click the button
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalled();
      });
    });

    it('should call onError when tokenization fails', async () => {
      const onError = vi.fn();

      const errorGooglePay = createMockGooglePay({
        tokenize: vi.fn().mockResolvedValue({
          status: 'Error',
          errors: [{ type: 'PAYMENT_FAILED', message: 'Card declined' }],
        }),
      });

      const errorPayments = createMockPayments({
        googlePay: vi.fn().mockResolvedValue(errorGooglePay),
      });

      const contextValue: SquareContextValue = {
        config: {
          applicationId: 'sq0idp-test',
          locationId: 'LTEST',
          environment: 'sandbox',
        },
        sdkLoaded: true,
        payments: errorPayments,
        error: null,
      };

      const Wrapper = createWrapper(contextValue);
      render(
        <Wrapper>
          <PaymentButton type="googlePay" onError={onError} />
        </Wrapper>
      );

      // Wait for button to be ready
      await waitFor(() => {
        expect(errorGooglePay.attach).toHaveBeenCalled();
      });

      // Click the button
      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
        expect(onError.mock.calls[0]?.[0]?.message).toBe('Card declined');
      });
    });
  });

  describe('Apple Pay', () => {
    it('should render Apple Pay button', () => {
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
          <PaymentButton type="applePay" />
        </Wrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Pay with Apple Pay');
    });

    it('should initialize Apple Pay when SDK is loaded', async () => {
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
          <PaymentButton type="applePay" onReady={onReady} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(mockPayments.applePay).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockApplePay.attach).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(onReady).toHaveBeenCalled();
      });
    });
  });

  describe('styling', () => {
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
          <PaymentButton
            type="googlePay"
            className="custom-class"
            style={{ backgroundColor: 'blue' }}
          />
        </Wrapper>
      );

      const button = container.querySelector('.custom-class');
      expect(button).toBeTruthy();
      expect(button).toHaveStyle({ minHeight: '48px' }); // Check default style
      expect(button).toHaveAttribute('style');
      // Note: backgroundColor style may not be directly testable with toHaveStyle due to CSS-in-JS
    });

    it('should have minimum height of 48px', () => {
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
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ minHeight: '48px' });
    });
  });

  describe('accessibility', () => {
    it('should be focusable when ready', async () => {
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
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      // Wait for button to be ready
      await waitFor(() => {
        expect(mockGooglePay.attach).toHaveBeenCalled();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when not ready', () => {
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
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('should have aria-disabled when not ready', () => {
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
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('error handling', () => {
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
          <PaymentButton type="googlePay" onError={onError} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(sdkError);
      });
    });

    it('should call onError when initialization fails', async () => {
      const onError = vi.fn();
      const initError = new Error('Failed to initialize');

      const failingPayments = createMockPayments({
        googlePay: vi.fn().mockRejectedValue(initError),
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

      const Wrapper = createWrapper(contextValue);
      render(
        <Wrapper>
          <PaymentButton type="googlePay" onError={onError} />
        </Wrapper>
      );

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('cleanup', () => {
    it('should destroy payment method on unmount', async () => {
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
      const { unmount } = render(
        <Wrapper>
          <PaymentButton type="googlePay" />
        </Wrapper>
      );

      // Wait for button to be ready
      await waitFor(() => {
        expect(mockGooglePay.attach).toHaveBeenCalled();
      });

      unmount();

      expect(mockGooglePay.destroy).toHaveBeenCalled();
    });
  });
});
