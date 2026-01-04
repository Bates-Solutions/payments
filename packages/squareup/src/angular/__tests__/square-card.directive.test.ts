import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Subject, of, throwError } from 'rxjs';
import { SquareCardDirective } from '../directives/square-card.directive.js';
import type { CardOptions } from '../types.js';

// Test without Angular TestBed due to DI issues with vitest
// Instead, we directly instantiate and test the directive logic

describe('SquareCardDirective', () => {
  let directive: SquareCardDirective;
  let mockPaymentsService: {
    attachCard: ReturnType<typeof vi.fn>;
    destroyCard: ReturnType<typeof vi.fn>;
  };
  let attachCardSubject: Subject<void>;
  let mockElement: HTMLElement;

  beforeEach(() => {
    attachCardSubject = new Subject<void>();
    mockElement = document.createElement('div');

    mockPaymentsService = {
      attachCard: vi.fn().mockReturnValue(attachCardSubject.asObservable()),
      destroyCard: vi.fn(),
    };

    // Create directive instance directly
    directive = Object.create(SquareCardDirective.prototype);

    // Set up required properties
    directive.cardOptions = undefined;
    directive.cardReady = { emit: vi.fn() } as unknown as typeof directive.cardReady;
    directive.cardError = { emit: vi.fn() } as unknown as typeof directive.cardError;

    // Inject mocked dependencies
    (directive as unknown as { elementRef: { nativeElement: HTMLElement } }).elementRef = {
      nativeElement: mockElement,
    };
    (directive as unknown as { payments: typeof mockPaymentsService }).payments =
      mockPaymentsService;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should have cardReady output', () => {
      expect(directive.cardReady).toBeDefined();
    });

    it('should have cardError output', () => {
      expect(directive.cardError).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should call attachCard with element', () => {
      directive.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement, undefined);
    });

    it('should pass card options to attachCard', () => {
      directive.cardOptions = { style: { input: { fontSize: '16px' } } };
      directive.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement, {
        style: { input: { fontSize: '16px' } },
      });
    });

    it('should emit cardReady when attach completes', async () => {
      directive.ngOnInit();

      attachCardSubject.next();
      attachCardSubject.complete();

      await vi.waitFor(() => {
        expect(directive.cardReady.emit).toHaveBeenCalled();
      });
    });

    it('should emit cardError on attach failure', async () => {
      mockPaymentsService.attachCard = vi
        .fn()
        .mockReturnValue(throwError(() => new Error('Attach failed')));

      directive.ngOnInit();

      await vi.waitFor(() => {
        expect(directive.cardError.emit).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroyCard', async () => {
      directive.ngOnInit();
      attachCardSubject.next();

      await vi.waitFor(() => {
        expect(directive.cardReady.emit).toHaveBeenCalled();
      });

      directive.ngOnDestroy();

      expect(mockPaymentsService.destroyCard).toHaveBeenCalled();
    });

    it('should unsubscribe from attachCard', () => {
      directive.ngOnInit();

      directive.ngOnDestroy();

      // Emitting after destroy should not cause errors
      expect(() => attachCardSubject.next()).not.toThrow();
    });
  });

  describe('with different card options', () => {
    it('should handle undefined options', () => {
      directive.cardOptions = undefined;
      directive.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement, undefined);
    });

    it('should handle empty options object', () => {
      directive.cardOptions = {};
      directive.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement, {});
    });

    it('should handle complex style options', () => {
      directive.cardOptions = {
        style: {
          input: {
            fontSize: '14px',
            color: '#333',
          },
          '.input-container': {
            borderColor: '#ccc',
          },
          '.input-container.is-focus': {
            borderColor: '#0070f3',
          },
        },
      };
      directive.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(
        mockElement,
        directive.cardOptions
      );
    });
  });

  describe('error scenarios', () => {
    it('should handle immediate errors', async () => {
      const error = new Error('Immediate failure');
      mockPaymentsService.attachCard = vi.fn().mockReturnValue(throwError(() => error));

      directive.ngOnInit();

      await vi.waitFor(() => {
        expect(directive.cardError.emit).toHaveBeenCalledWith(error);
      });
    });

    it('should handle delayed errors', async () => {
      directive.ngOnInit();

      const error = new Error('Delayed failure');
      attachCardSubject.error(error);

      await vi.waitFor(() => {
        expect(directive.cardError.emit).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('multiple directive instances', () => {
    it('should each have their own element reference', () => {
      const directive2 = Object.create(SquareCardDirective.prototype);
      const mockElement2 = document.createElement('div');
      mockElement2.id = 'element2';

      directive2.cardOptions = undefined;
      directive2.cardReady = { emit: vi.fn() } as unknown as typeof directive.cardReady;
      directive2.cardError = { emit: vi.fn() } as unknown as typeof directive.cardError;
      (directive2 as unknown as { elementRef: { nativeElement: HTMLElement } }).elementRef = {
        nativeElement: mockElement2,
      };
      (directive2 as unknown as { payments: typeof mockPaymentsService }).payments =
        mockPaymentsService;

      directive.ngOnInit();
      directive2.ngOnInit();

      expect(mockPaymentsService.attachCard).toHaveBeenCalledTimes(2);
      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement, undefined);
      expect(mockPaymentsService.attachCard).toHaveBeenCalledWith(mockElement2, undefined);
    });
  });
});
