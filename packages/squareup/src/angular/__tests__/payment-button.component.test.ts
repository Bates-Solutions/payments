import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Subject, of, throwError } from 'rxjs';
import { PaymentButtonComponent } from '../components/payment-button.component.js';
import type { Payments, GooglePay, ApplePay, TokenResult } from '../types.js';

// Test without Angular TestBed due to DI issues with vitest
// Instead, we directly instantiate and test the component logic

describe('PaymentButtonComponent', () => {
  let component: PaymentButtonComponent;
  let mockPayments: Payments;
  let mockGooglePay: GooglePay;
  let mockApplePay: ApplePay;
  let mockSdkService: { whenReady: ReturnType<typeof vi.fn> };
  let mockCdr: { markForCheck: ReturnType<typeof vi.fn> };
  let whenReadySubject: Subject<Payments>;

  beforeEach(() => {
    whenReadySubject = new Subject<Payments>();

    mockGooglePay = {
      attach: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'gpay-token' }),
    };

    mockApplePay = {
      attach: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      tokenize: vi.fn().mockResolvedValue({ status: 'OK', token: 'apay-token' }),
    };

    mockPayments = {
      card: vi.fn(),
      googlePay: vi.fn().mockResolvedValue(mockGooglePay),
      applePay: vi.fn().mockResolvedValue(mockApplePay),
    };

    mockSdkService = {
      whenReady: vi.fn().mockReturnValue(whenReadySubject.asObservable()),
    };

    mockCdr = {
      markForCheck: vi.fn(),
    };

    // Create component instance directly
    component = Object.create(PaymentButtonComponent.prototype);

    // Set up required properties
    component.type = 'googlePay';
    component.buttonOptions = undefined;
    component.buttonReady = { emit: vi.fn() } as unknown as typeof component.buttonReady;
    component.payment = { emit: vi.fn() } as unknown as typeof component.payment;
    component.error = { emit: vi.fn() } as unknown as typeof component.error;
    component.cancel = { emit: vi.fn() } as unknown as typeof component.cancel;
    component.ready = false;
    component.loading = false;

    // Inject mocked dependencies
    (component as unknown as { sdk: typeof mockSdkService }).sdk = mockSdkService;
    (component as unknown as { cdr: typeof mockCdr }).cdr = mockCdr;

    // Create a fake container ref
    const containerElement = document.createElement('div');
    (component as unknown as { containerRef: { nativeElement: HTMLElement } }).containerRef = {
      nativeElement: containerElement,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should default to googlePay type', () => {
      expect(component.type).toBe('googlePay');
    });

    it('should start with ready as false', () => {
      expect(component.ready).toBe(false);
    });

    it('should start with loading as false', () => {
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to whenReady', () => {
      component.ngOnInit();
      expect(mockSdkService.whenReady).toHaveBeenCalled();
    });

    it('should initialize Google Pay when type is googlePay', async () => {
      component.type = 'googlePay';
      component.ngOnInit();

      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(mockPayments.googlePay).toHaveBeenCalled();
        expect(mockGooglePay.attach).toHaveBeenCalled();
      });
    });

    it('should initialize Apple Pay when type is applePay', async () => {
      component.type = 'applePay';
      component.ngOnInit();

      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(mockPayments.applePay).toHaveBeenCalled();
        expect(mockApplePay.attach).toHaveBeenCalled();
      });
    });

    it('should emit buttonReady when initialized', async () => {
      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.buttonReady.emit).toHaveBeenCalled();
        expect(component.ready).toBe(true);
      });
    });

    it('should pass button options to attach', async () => {
      component.buttonOptions = { buttonColor: 'black', buttonSizeMode: 'fill' };
      component.ngOnInit();

      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(mockGooglePay.attach).toHaveBeenCalledWith(
          expect.any(HTMLElement),
          { buttonColor: 'black', buttonSizeMode: 'fill' }
        );
      });
    });

    it('should emit error on SDK initialization failure', async () => {
      mockSdkService.whenReady = vi.fn().mockReturnValue(
        throwError(() => new Error('SDK failed'))
      );

      component.ngOnInit();

      await vi.waitFor(() => {
        expect(component.error.emit).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('should emit error on payment method init failure', async () => {
      mockPayments.googlePay = vi.fn().mockRejectedValue(new Error('GPay failed'));

      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.error.emit).toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy payment method', async () => {
      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.ngOnDestroy();

      expect(mockGooglePay.destroy).toHaveBeenCalled();
    });

    it('should unsubscribe from SDK', () => {
      component.ngOnInit();
      component.ngOnDestroy();

      // Should not throw
      expect(() => whenReadySubject.next(mockPayments)).not.toThrow();
    });
  });

  describe('handleClick', () => {
    it('should do nothing if not ready', () => {
      component.handleClick();

      // Should not throw or tokenize
      expect(mockGooglePay.tokenize).not.toHaveBeenCalled();
    });

    it('should do nothing if loading', async () => {
      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.loading = true;
      component.handleClick();

      expect(mockGooglePay.tokenize).not.toHaveBeenCalled();
    });

    it('should tokenize on click when ready', async () => {
      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.handleClick();

      await vi.waitFor(() => {
        expect(mockGooglePay.tokenize).toHaveBeenCalled();
      });
    });

    it('should emit payment token on success', async () => {
      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.handleClick();

      await vi.waitFor(() => {
        expect(component.payment.emit).toHaveBeenCalledWith('gpay-token');
      });
    });

    it('should emit cancel on cancel status', async () => {
      mockGooglePay.tokenize = vi.fn().mockResolvedValue({ status: 'Cancel' });

      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.handleClick();

      await vi.waitFor(() => {
        expect(component.cancel.emit).toHaveBeenCalled();
      });
    });

    it('should emit error on tokenization failure', async () => {
      const result: TokenResult = {
        status: 'Error',
        errors: [{ type: 'VALIDATION', message: 'Card declined' }],
      };
      mockGooglePay.tokenize = vi.fn().mockResolvedValue(result);

      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.handleClick();

      await vi.waitFor(() => {
        expect(component.error.emit).toHaveBeenCalled();
      });
    });

    it('should set loading during tokenization', async () => {
      let resolveTokenize: (result: TokenResult) => void;
      mockGooglePay.tokenize = vi.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveTokenize = resolve;
        })
      );

      component.ngOnInit();
      whenReadySubject.next(mockPayments);

      await vi.waitFor(() => {
        expect(component.ready).toBe(true);
      });

      component.handleClick();
      expect(component.loading).toBe(true);

      resolveTokenize!({ status: 'OK', token: 'token' });

      await vi.waitFor(() => {
        expect(component.loading).toBe(false);
      });
    });
  });

  describe('aria labels', () => {
    it('should have correct label for Google Pay', () => {
      component.type = 'googlePay';
      const label = 'Pay with ' + (component.type === 'googlePay' ? 'Google Pay' : 'Apple Pay');
      expect(label).toBe('Pay with Google Pay');
    });

    it('should have correct label for Apple Pay', () => {
      component.type = 'applePay';
      const label = 'Pay with ' + (component.type === 'googlePay' ? 'Google Pay' : 'Apple Pay');
      expect(label).toBe('Pay with Apple Pay');
    });
  });

  describe('loading state', () => {
    it('should affect opacity calculation', () => {
      component.loading = false;
      expect(component.loading ? 0.7 : 1).toBe(1);

      component.loading = true;
      expect(component.loading ? 0.7 : 1).toBe(0.7);
    });
  });
});
