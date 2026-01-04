import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SquareProvider, useSquare } from '../SquareProvider.js';

// Mock Square SDK
const mockPayments = {
  card: vi.fn(),
  googlePay: vi.fn(),
  applePay: vi.fn(),
};

const mockSquare = {
  payments: vi.fn().mockResolvedValue(mockPayments),
};

describe('SquareProvider', () => {
  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = '';
    // Reset window.Square
    delete (window as unknown as { Square?: unknown }).Square;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <div data-testid="child">Child content</div>
        </SquareProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should use sandbox environment by default', () => {
      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <div>Content</div>
        </SquareProvider>
      );

      // Script should be added to head with sandbox URL
      const script = document.querySelector('script[src*="sandbox"]');
      expect(script).toBeInTheDocument();
    });

    it('should use production environment when specified', () => {
      render(
        <SquareProvider applicationId="app-id" locationId="loc-id" environment="production">
          <div>Content</div>
        </SquareProvider>
      );

      // Script should be added to head with production URL
      const script = document.querySelector('script[src*="web.squarecdn.com"]');
      expect(script).toBeInTheDocument();
      expect(script?.getAttribute('src')).not.toContain('sandbox');
    });
  });

  describe('SDK loading', () => {
    it('should add Square SDK script to document', () => {
      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <div>Content</div>
        </SquareProvider>
      );

      const scripts = document.querySelectorAll('script');
      const squareScript = Array.from(scripts).find((s) => s.src.includes('squarecdn.com'));
      expect(squareScript).toBeTruthy();
    });

    it('should not add duplicate scripts', () => {
      // Add initial script
      const existingScript = document.createElement('script');
      existingScript.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      document.head.appendChild(existingScript);

      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <div>Content</div>
        </SquareProvider>
      );

      const scripts = document.querySelectorAll('script[src*="squarecdn.com"]');
      expect(scripts.length).toBe(1);
    });

    it('should initialize payments when SDK loads', async () => {
      (window as unknown as { Square: typeof mockSquare }).Square = mockSquare;

      function TestComponent() {
        const { sdkLoaded, payments } = useSquare();
        return (
          <div>
            <span data-testid="loaded">{String(sdkLoaded)}</span>
            <span data-testid="payments">{payments ? 'ready' : 'null'}</span>
          </div>
        );
      }

      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <TestComponent />
        </SquareProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loaded').textContent).toBe('true');
      });

      expect(screen.getByTestId('payments').textContent).toBe('ready');
      expect(mockSquare.payments).toHaveBeenCalledWith('app-id', 'loc-id');
    });
  });

  describe('error handling', () => {
    it('should set error when SDK fails to load', async () => {
      const failingSquare = {
        payments: vi.fn().mockRejectedValue(new Error('SDK init failed')),
      };
      (window as unknown as { Square: typeof failingSquare }).Square = failingSquare;

      function TestComponent() {
        const { error } = useSquare();
        return <div data-testid="error">{error?.message ?? 'no error'}</div>;
      }

      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <TestComponent />
        </SquareProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error').textContent).toBe('SDK init failed');
      });
    });
  });

  describe('context', () => {
    it('should provide config to children', () => {
      function TestComponent() {
        const { config } = useSquare();
        return (
          <div>
            <span data-testid="appId">{config.applicationId}</span>
            <span data-testid="locId">{config.locationId}</span>
            <span data-testid="env">{config.environment}</span>
            <span data-testid="currency">{config.currency}</span>
          </div>
        );
      }

      render(
        <SquareProvider
          applicationId="test-app"
          locationId="test-loc"
          environment="sandbox"
          currency="EUR"
        >
          <TestComponent />
        </SquareProvider>
      );

      expect(screen.getByTestId('appId').textContent).toBe('test-app');
      expect(screen.getByTestId('locId').textContent).toBe('test-loc');
      expect(screen.getByTestId('env').textContent).toBe('sandbox');
      expect(screen.getByTestId('currency').textContent).toBe('EUR');
    });

    it('should use default currency USD', () => {
      function TestComponent() {
        const { config } = useSquare();
        return <span data-testid="currency">{config.currency}</span>;
      }

      render(
        <SquareProvider applicationId="app-id" locationId="loc-id">
          <TestComponent />
        </SquareProvider>
      );

      expect(screen.getByTestId('currency').textContent).toBe('USD');
    });
  });
});

describe('useSquare', () => {
  it('should throw error when used outside provider', () => {
    function TestComponent() {
      useSquare();
      return null;
    }

    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSquare must be used within a SquareProvider');

    spy.mockRestore();
  });
});
