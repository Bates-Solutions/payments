import { Injectable } from '@angular/core';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import type { CreateOrderRequest } from '../types.js';

/**
 * Service for Square order operations
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CheckoutComponent {
 *   constructor(private orders: SquareOrdersService) {}
 *
 *   createOrder() {
 *     this.orders.create({
 *       lineItems: [
 *         { name: 'Coffee', quantity: '1', basePriceMoney: { amount: 500 } }
 *       ]
 *     }).subscribe(order => {
 *       console.log('Order created:', order);
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SquareOrdersService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);

  /** Observable of loading state */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable of errors */
  readonly error$: Observable<Error | null> = this.errorSubject.asObservable();


  /**
   * Create an order via backend API
   *
   * @param request - Order creation request
   * @param apiEndpoint - Backend API endpoint (default: '/api/orders')
   * @returns Observable of the order response
   */
  create<T = unknown>(
    request: CreateOrderRequest,
    apiEndpoint = '/api/orders'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const body = {
      ...request,
      idempotencyKey: crypto.randomUUID(),
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
        const err = error instanceof Error ? error : new Error('Failed to create order');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Retrieve an order by ID
   *
   * @param orderId - The order ID
   * @param apiEndpoint - Backend API endpoint (default: '/api/orders')
   * @returns Observable of the order
   */
  retrieve<T = unknown>(orderId: string, apiEndpoint = '/api/orders'): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
        const err = error instanceof Error ? error : new Error('Failed to retrieve order');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Update an order
   *
   * @param orderId - The order ID
   * @param request - Order update request
   * @param apiEndpoint - Backend API endpoint (default: '/api/orders')
   * @returns Observable of the updated order
   */
  update<T = unknown>(
    orderId: string,
    request: Partial<CreateOrderRequest>,
    apiEndpoint = '/api/orders'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const body = {
      ...request,
      idempotencyKey: crypto.randomUUID(),
    };

    return from(
      fetch(`${apiEndpoint}/${orderId}`, {
        method: 'PUT',
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
        const err = error instanceof Error ? error : new Error('Failed to update order');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Pay for an order
   *
   * @param orderId - The order ID
   * @param paymentIds - Payment IDs to apply
   * @param apiEndpoint - Backend API endpoint (default: '/api/orders')
   * @returns Observable of the paid order
   */
  pay<T = unknown>(
    orderId: string,
    paymentIds: string[],
    apiEndpoint = '/api/orders'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const body = {
      paymentIds,
      idempotencyKey: crypto.randomUUID(),
    };

    return from(
      fetch(`${apiEndpoint}/${orderId}/pay`, {
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
        const err = error instanceof Error ? error : new Error('Failed to pay for order');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }
}
