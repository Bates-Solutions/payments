import { Injectable, Inject } from '@angular/core';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, tap, finalize } from 'rxjs/operators';
import { SQUARE_CONFIG } from '../square.module.js';
import { SquareSdkService } from './square-sdk.service.js';
import type {
  SquareConfig,
  Card,
  CardOptions,
  TokenResult,
  CreatePaymentRequest,
} from '../types.js';

/**
 * Service for Square payment operations
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CheckoutComponent implements OnInit, OnDestroy {
 *   constructor(private payments: SquarePaymentsService) {}
 *
 *   ngOnInit() {
 *     this.payments.attachCard(this.cardContainer.nativeElement).subscribe();
 *   }
 *
 *   ngOnDestroy() {
 *     this.payments.destroyCard();
 *   }
 *
 *   pay() {
 *     this.payments.tokenize().pipe(
 *       switchMap(token => this.payments.createPayment({
 *         sourceId: token,
 *         amount: 1000
 *       }))
 *     ).subscribe();
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SquarePaymentsService {
  private card: Card | null = null;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);
  private readySubject = new BehaviorSubject<boolean>(false);

  /** Observable of loading state */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable of errors */
  readonly error$: Observable<Error | null> = this.errorSubject.asObservable();

  /** Observable of card ready state */
  readonly ready$: Observable<boolean> = this.readySubject.asObservable();

  constructor(
    @Inject(SQUARE_CONFIG) private config: SquareConfig,
    private sdk: SquareSdkService
  ) {}

  /**
   * Attach a card input to an element
   *
   * @param element - The container element for the card input
   * @param options - Optional card styling options
   * @returns Observable that completes when card is attached
   */
  attachCard(element: HTMLElement, options?: CardOptions): Observable<void> {
    return this.sdk.whenReady().pipe(
      tap(() => {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
      }),
      switchMap((payments) => from(payments.card(options))),
      switchMap((card) => {
        this.card = card;
        return from(card.attach(element));
      }),
      tap(() => {
        this.readySubject.next(true);
      }),
      catchError((error: unknown) => {
        const err = error instanceof Error ? error : new Error('Failed to attach card');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Destroy the current card instance
   */
  destroyCard(): void {
    if (this.card) {
      void this.card.destroy();
      this.card = null;
      this.readySubject.next(false);
    }
  }

  /**
   * Tokenize the card input
   *
   * @returns Observable of the payment token
   */
  tokenize(): Observable<string> {
    if (!this.card) {
      return throwError(() => new Error('Card not initialized'));
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(this.card.tokenize()).pipe(
      switchMap((result: TokenResult) => {
        if (result.status === 'OK' && result.token) {
          return from([result.token]);
        }

        if (result.status === 'Cancel') {
          return throwError(() => new Error('Tokenization was cancelled'));
        }

        const errorMessage =
          result.errors?.map((e) => e.message).join(', ') ?? 'Tokenization failed';
        return throwError(() => new Error(errorMessage));
      }),
      catchError((error: unknown) => {
        const err = error instanceof Error ? error : new Error('Tokenization failed');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Create a payment via backend API
   *
   * @param request - Payment creation request
   * @param apiEndpoint - Backend API endpoint (default: '/api/payments')
   * @returns Observable of the payment response
   */
  createPayment<T = unknown>(
    request: CreatePaymentRequest,
    apiEndpoint = '/api/payments'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const body = {
      ...request,
      currency: request.currency ?? this.config.currency ?? 'USD',
      idempotencyKey: request.idempotencyKey ?? crypto.randomUUID(),
    };

    return from(
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (response) => {
        if (!response.ok) {
          const error: unknown = await response.json().catch(() => ({}));
          throw new Error(
            (error as { message?: string }).message ?? `HTTP ${String(response.status)}`
          );
        }
        return response.json() as Promise<T>;
      })
    ).pipe(
      catchError((error: unknown) => {
        const err = error instanceof Error ? error : new Error('Payment failed');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }
}
