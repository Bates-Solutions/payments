import { Injectable, Inject, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SQUARE_CONFIG } from '../square.module.js';
import type { SquareConfig, Payments } from '../types.js';

const SQUARE_SDK_URL = {
  sandbox: 'https://sandbox.web.squarecdn.com/v1/square.js',
  production: 'https://web.squarecdn.com/v1/square.js',
};

interface SquareGlobal {
  payments: (applicationId: string, locationId: string) => Promise<Payments>;
}

/**
 * Service for loading and managing the Square Web Payments SDK
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CheckoutComponent {
 *   constructor(private squareSdk: SquareSdkService) {}
 *
 *   ngOnInit() {
 *     this.squareSdk.payments$.subscribe(payments => {
 *       console.log('SDK ready:', payments);
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SquareSdkService {
  private paymentsSubject = new BehaviorSubject<Payments | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);
  private initialized = false;

  /** Observable of the Payments instance once SDK is loaded */
  readonly payments$: Observable<Payments | null> = this.paymentsSubject.asObservable();

  /** Observable of SDK loading state */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable of any SDK loading errors */
  readonly error$: Observable<Error | null> = this.errorSubject.asObservable();

  /** Whether the SDK is ready */
  get isReady(): boolean {
    return this.paymentsSubject.value !== null;
  }

  constructor(
    @Inject(SQUARE_CONFIG) private config: SquareConfig,
    private ngZone: NgZone
  ) {
    this.initializeSdk();
  }

  /**
   * Get a promise that resolves when the SDK is ready
   */
  whenReady(): Observable<Payments> {
    return this.payments$.pipe(
      filter((p): p is Payments => p !== null),
      take(1)
    );
  }

  private initializeSdk(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    this.initialized = true;
    this.loadingSubject.next(true);

    this.loadScript()
      .then(() => this.initializePayments())
      .catch((error: unknown) => {
        this.ngZone.run(() => {
          const err = error instanceof Error ? error : new Error('Failed to load Square SDK');
          this.errorSubject.next(err);
          this.loadingSubject.next(false);
        });
      });
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const win = window as unknown as { Square?: SquareGlobal };
      if (win.Square) {
        resolve();
        return;
      }

      const environment = this.config.environment ?? 'sandbox';
      const existingScript = document.querySelector(
        `script[src="${SQUARE_SDK_URL[environment]}"]`
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          resolve();
        });
        existingScript.addEventListener('error', () => {
          reject(new Error('Failed to load Square SDK'));
        });
        return;
      }

      const script = document.createElement('script');
      script.src = SQUARE_SDK_URL[environment];
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Square SDK'));
      };
      document.head.appendChild(script);
    });
  }

  private async initializePayments(): Promise<void> {
    const win = window as unknown as { Square?: SquareGlobal };
    const Square = win.Square;

    if (!Square) {
      throw new Error('Square SDK not available');
    }

    const payments = await Square.payments(
      this.config.applicationId,
      this.config.locationId
    );

    this.ngZone.run(() => {
      this.paymentsSubject.next(payments);
      this.loadingSubject.next(false);
    });
  }
}
