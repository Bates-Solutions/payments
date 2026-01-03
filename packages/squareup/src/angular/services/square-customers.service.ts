import { Injectable } from '@angular/core';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import type { CreateCustomerRequest } from '../types.js';

/**
 * Service for Square customer operations
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CustomerComponent {
 *   constructor(private customers: SquareCustomersService) {}
 *
 *   createCustomer() {
 *     this.customers.create({
 *       givenName: 'John',
 *       familyName: 'Doe',
 *       emailAddress: 'john@example.com'
 *     }).subscribe(customer => {
 *       console.log('Customer created:', customer);
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SquareCustomersService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);

  /** Observable of loading state */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable of errors */
  readonly error$: Observable<Error | null> = this.errorSubject.asObservable();

  /**
   * Create a customer via backend API
   *
   * @param request - Customer creation request
   * @param apiEndpoint - Backend API endpoint (default: '/api/customers')
   * @returns Observable of the customer response
   */
  create<T = unknown>(
    request: CreateCustomerRequest,
    apiEndpoint = '/api/customers'
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
        const err = error instanceof Error ? error : new Error('Failed to create customer');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Retrieve a customer by ID
   *
   * @param customerId - The customer ID
   * @param apiEndpoint - Backend API endpoint (default: '/api/customers')
   * @returns Observable of the customer
   */
  retrieve<T = unknown>(customerId: string, apiEndpoint = '/api/customers'): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/${customerId}`, {
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
        const err = error instanceof Error ? error : new Error('Failed to retrieve customer');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Update a customer
   *
   * @param customerId - The customer ID
   * @param request - Customer update request
   * @param apiEndpoint - Backend API endpoint (default: '/api/customers')
   * @returns Observable of the updated customer
   */
  update<T = unknown>(
    customerId: string,
    request: Partial<CreateCustomerRequest>,
    apiEndpoint = '/api/customers'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
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
        const err = error instanceof Error ? error : new Error('Failed to update customer');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Delete a customer
   *
   * @param customerId - The customer ID
   * @param apiEndpoint - Backend API endpoint (default: '/api/customers')
   * @returns Observable that completes on success
   */
  delete(customerId: string, apiEndpoint = '/api/customers'): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/${customerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(async (response) => {
        if (!response.ok) {
          const error: unknown = await response.json().catch(() => ({}));
          throw new Error(
            (error as { message?: string }).message ?? `HTTP ${String(response.status)}`
          );
        }
      })
    ).pipe(
      catchError((error: unknown) => {
        const err = error instanceof Error ? error : new Error('Failed to delete customer');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Search for customers
   *
   * @param query - Search query
   * @param apiEndpoint - Backend API endpoint (default: '/api/customers')
   * @returns Observable of matching customers
   */
  search<T = unknown>(
    query: { emailAddress?: string; phoneNumber?: string; referenceId?: string },
    apiEndpoint = '/api/customers'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
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
        const err = error instanceof Error ? error : new Error('Failed to search customers');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }
}
