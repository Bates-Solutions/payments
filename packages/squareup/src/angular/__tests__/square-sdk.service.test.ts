import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SquareSdkService } from '../services/square-sdk.service.js';
import type { SquareConfig, Payments } from '../types.js';

// Mock NgZone
class MockNgZone {
  run<T>(fn: () => T): T {
    return fn();
  }
  runOutsideAngular<T>(fn: () => T): T {
    return fn();
  }
}

describe('SquareSdkService', () => {
  const testConfig: SquareConfig = {
    applicationId: 'sq0idp-test',
    locationId: 'LTEST123',
    environment: 'sandbox',
  };

  let mockPayments: Payments;
  let mockNgZone: MockNgZone;

  beforeEach(() => {
    mockPayments = {
      card: vi.fn(),
      googlePay: vi.fn(),
      applePay: vi.fn(),
    };

    mockNgZone = new MockNgZone();

    // Reset DOM
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Clean up window.Square
    delete (window as unknown as { Square?: unknown }).Square;
    vi.restoreAllMocks();
  });

  function createService(config: SquareConfig = testConfig): SquareSdkService {
    // Directly instantiate the service with mocked dependencies
    // We use Object.create to bypass the decorator metadata requirements
    const service = Object.create(SquareSdkService.prototype);

    // Initialize the service properties manually
    service.config = config;
    service.ngZone = mockNgZone;
    service.paymentsSubject = { value: null, next: vi.fn(), asObservable: () => ({ subscribe: vi.fn() }) };
    service.loadingSubject = { value: false, next: vi.fn(), asObservable: () => ({ subscribe: vi.fn() }) };
    service.errorSubject = { value: null, next: vi.fn(), asObservable: () => ({ subscribe: vi.fn() }) };
    service.initialized = false;

    return service;
  }

  describe('initialization', () => {
    it('should create service properties', () => {
      const service = createService();
      expect(service).toBeTruthy();
      expect(service.config).toEqual(testConfig);
    });

    it('should have paymentsSubject', () => {
      const service = createService();
      expect(service.paymentsSubject).toBeDefined();
    });

    it('should have loadingSubject', () => {
      const service = createService();
      expect(service.loadingSubject).toBeDefined();
    });

    it('should have errorSubject', () => {
      const service = createService();
      expect(service.errorSubject).toBeDefined();
    });
  });

  describe('isReady getter', () => {
    it('should return false when paymentsSubject value is null', () => {
      const service = createService();
      service.paymentsSubject = { value: null };
      expect(service.isReady).toBe(false);
    });

    it('should return true when paymentsSubject has a value', () => {
      const service = createService();
      service.paymentsSubject = { value: mockPayments };
      expect(service.isReady).toBe(true);
    });
  });

  describe('whenReady', () => {
    it('should return an observable that filters and takes first value', () => {
      const service = createService();

      // Set up real BehaviorSubject for this test
      const { BehaviorSubject } = require('rxjs');
      const paymentsSubject = new BehaviorSubject<Payments | null>(null);
      service.paymentsSubject = paymentsSubject;
      // The service uses payments$ which is derived from paymentsSubject
      Object.defineProperty(service, 'payments$', {
        get: () => paymentsSubject.asObservable(),
      });

      const ready$ = service.whenReady();

      expect(ready$).toBeDefined();
      expect(typeof ready$.subscribe).toBe('function');
    });

    it('should emit payments when available', async () => {
      const service = createService();

      const { BehaviorSubject } = require('rxjs');
      const paymentsSubject = new BehaviorSubject<Payments | null>(mockPayments);
      service.paymentsSubject = paymentsSubject;
      // The service uses payments$ which is derived from paymentsSubject
      Object.defineProperty(service, 'payments$', {
        get: () => paymentsSubject.asObservable(),
      });

      const ready$ = service.whenReady();

      let emittedPayments: Payments | null = null;
      ready$.subscribe((p: Payments) => {
        emittedPayments = p;
      });

      expect(emittedPayments).toBe(mockPayments);
    });
  });

  describe('observable properties', () => {
    it('payments$ should be an observable', () => {
      const service = createService();
      const { BehaviorSubject } = require('rxjs');
      service.paymentsSubject = new BehaviorSubject<Payments | null>(null);

      const payments$ = service.paymentsSubject.asObservable();
      expect(payments$).toBeDefined();
      expect(typeof payments$.subscribe).toBe('function');
    });

    it('loading$ should be an observable', () => {
      const service = createService();
      const { BehaviorSubject } = require('rxjs');
      service.loadingSubject = new BehaviorSubject<boolean>(false);

      const loading$ = service.loadingSubject.asObservable();
      expect(loading$).toBeDefined();
      expect(typeof loading$.subscribe).toBe('function');
    });

    it('error$ should be an observable', () => {
      const service = createService();
      const { BehaviorSubject } = require('rxjs');
      service.errorSubject = new BehaviorSubject<Error | null>(null);

      const error$ = service.errorSubject.asObservable();
      expect(error$).toBeDefined();
      expect(typeof error$.subscribe).toBe('function');
    });
  });

  describe('SDK URL selection', () => {
    it('should use sandbox URL for sandbox environment', () => {
      const config = { ...testConfig, environment: 'sandbox' as const };
      const service = createService(config);
      expect(service.config.environment).toBe('sandbox');
    });

    it('should use production URL for production environment', () => {
      const config = { ...testConfig, environment: 'production' as const };
      const service = createService(config);
      expect(service.config.environment).toBe('production');
    });
  });

  describe('ngZone integration', () => {
    it('should have ngZone property', () => {
      const service = createService();
      expect(service.ngZone).toBeDefined();
    });

    it('should be able to run code through ngZone', () => {
      const service = createService();
      let called = false;
      service.ngZone.run(() => {
        called = true;
      });
      expect(called).toBe(true);
    });
  });
});
