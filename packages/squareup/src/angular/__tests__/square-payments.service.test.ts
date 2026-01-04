import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { SquarePaymentsService } from '../services/square-payments.service.js';
import type { Payments, Card, TokenResult, SquareConfig } from '../types.js';

describe('SquarePaymentsService', () => {
  let mockCard: Card;
  let mockPayments: Payments;
  let originalFetch: typeof fetch;

  const testConfig: SquareConfig = {
    applicationId: 'sq0idp-test',
    locationId: 'LTEST123',
    currency: 'USD',
  };

  beforeEach(() => {
    originalFetch = globalThis.fetch;

    mockCard = {
      attach: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'test-token' }),
    };

    mockPayments = {
      card: vi.fn().mockResolvedValue(mockCard),
      googlePay: vi.fn(),
      applePay: vi.fn(),
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function createService(): SquarePaymentsService {
    // Create service with mocked dependencies
    const service = Object.create(SquarePaymentsService.prototype);

    service.sdk = {
      whenReady: vi.fn().mockReturnValue(of(mockPayments)),
    };
    service.config = testConfig;
    service.loadingSubject = new BehaviorSubject<boolean>(false);
    service.errorSubject = new BehaviorSubject<Error | null>(null);
    service.readySubject = new BehaviorSubject<boolean>(false);
    service.card = null;

    // Set up the observable properties
    service.loading$ = service.loadingSubject.asObservable();
    service.error$ = service.errorSubject.asObservable();
    service.ready$ = service.readySubject.asObservable();

    return service;
  }

  describe('initialization', () => {
    it('should create service', () => {
      const service = createService();
      expect(service).toBeTruthy();
    });

    it('should expose loading$ observable', () => {
      const service = createService();
      expect(service.loading$).toBeDefined();
    });

    it('should expose error$ observable', () => {
      const service = createService();
      expect(service.error$).toBeDefined();
    });

    it('should expose ready$ observable', () => {
      const service = createService();
      expect(service.ready$).toBeDefined();
    });
  });

  describe('attachCard', () => {
    it('should call whenReady on SDK', async () => {
      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));

      expect(service.sdk.whenReady).toHaveBeenCalled();
    });

    it('should create card instance', async () => {
      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));

      expect(mockPayments.card).toHaveBeenCalled();
    });

    it('should attach card to container', async () => {
      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));

      expect(mockCard.attach).toHaveBeenCalledWith(container);
    });

    it('should pass options to card', async () => {
      const service = createService();
      const container = document.createElement('div');
      const options = { style: { input: { fontSize: '16px' } } };

      await firstValueFrom(service.attachCard(container, options));

      expect(mockPayments.card).toHaveBeenCalledWith(options);
    });

    it('should handle SDK errors', async () => {
      const service = createService();
      service.sdk.whenReady = vi.fn().mockReturnValue(
        throwError(() => new Error('SDK failed'))
      );
      const container = document.createElement('div');

      await expect(firstValueFrom(service.attachCard(container))).rejects.toThrow(
        'SDK failed'
      );
    });
  });

  describe('destroyCard', () => {
    it('should destroy card instance', async () => {
      const service = createService();
      const container = document.createElement('div');

      // First attach a card
      await firstValueFrom(service.attachCard(container));

      // Then destroy it
      service.destroyCard();

      expect(mockCard.destroy).toHaveBeenCalled();
    });

    it('should handle no card attached', () => {
      const service = createService();

      // Should not throw
      expect(() => service.destroyCard()).not.toThrow();
    });
  });

  describe('tokenize', () => {
    it('should return token on success', async () => {
      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));
      const token = await firstValueFrom(service.tokenize());

      expect(token).toBe('test-token');
    });

    it('should throw if card not initialized', async () => {
      const service = createService();

      await expect(firstValueFrom(service.tokenize())).rejects.toThrow();
    });

    it('should handle cancel status', async () => {
      mockCard.tokenize = vi.fn().mockResolvedValue({ status: 'Cancel' });

      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));

      await expect(firstValueFrom(service.tokenize())).rejects.toThrow('cancelled');
    });

    it('should handle error status with messages', async () => {
      const result: TokenResult = {
        status: 'Error',
        errors: [
          { type: 'VALIDATION', message: 'Invalid card number' },
          { type: 'VALIDATION', message: 'Invalid CVV' },
        ],
      };
      mockCard.tokenize = vi.fn().mockResolvedValue(result);

      const service = createService();
      const container = document.createElement('div');

      await firstValueFrom(service.attachCard(container));

      await expect(firstValueFrom(service.tokenize())).rejects.toThrow('Invalid card number');
    });
  });

  describe('createPayment', () => {
    it('should post to API endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ payment: { id: 'PAY_123' } }),
      });

      const service = createService();

      const result = await firstValueFrom(
        service.createPayment({ sourceId: 'token', amount: 1000 })
      );

      expect(fetch).toHaveBeenCalledWith(
        '/api/payments',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual({ payment: { id: 'PAY_123' } });
    });

    it('should use custom endpoint', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      await firstValueFrom(
        service.createPayment({ sourceId: 'token', amount: 1000 }, '/custom/payments')
      );

      expect(fetch).toHaveBeenCalledWith('/custom/payments', expect.anything());
    });

    it('should include currency from config', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const service = createService();

      await firstValueFrom(service.createPayment({ sourceId: 'token', amount: 1000 }));

      const call = vi.mocked(fetch).mock.calls[0];
      const body = JSON.parse(call[1]?.body as string);
      expect(body.currency).toBe('USD');
    });

    it('should handle API errors', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Payment declined' }),
      });

      const service = createService();

      await expect(
        firstValueFrom(service.createPayment({ sourceId: 'token', amount: 1000 }))
      ).rejects.toThrow('Payment declined');
    });

    it('should handle network errors', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const service = createService();

      await expect(
        firstValueFrom(service.createPayment({ sourceId: 'token', amount: 1000 }))
      ).rejects.toThrow('Network error');
    });
  });
});
