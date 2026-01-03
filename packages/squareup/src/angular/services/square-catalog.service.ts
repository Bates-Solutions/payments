import { Injectable } from '@angular/core';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import type { CatalogSearchRequest } from '../types.js';

/**
 * Service for Square catalog operations
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class ProductsComponent implements OnInit {
 *   products$ = this.catalog.list();
 *
 *   constructor(private catalog: SquareCatalogService) {}
 *
 *   search(query: string) {
 *     return this.catalog.search({ textFilter: query });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SquareCatalogService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);

  /** Observable of loading state */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable of errors */
  readonly error$: Observable<Error | null> = this.errorSubject.asObservable();

  /**
   * List catalog items
   *
   * @param types - Optional types to filter by
   * @param apiEndpoint - Backend API endpoint (default: '/api/catalog')
   * @returns Observable of catalog items
   */
  list<T = unknown>(
    types?: string[],
    apiEndpoint = '/api/catalog'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const params = types ? `?types=${types.join(',')}` : '';

    return from(
      fetch(`${apiEndpoint}${params}`, {
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
        const err = error instanceof Error ? error : new Error('Failed to list catalog');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Search catalog items
   *
   * @param request - Search request
   * @param apiEndpoint - Backend API endpoint (default: '/api/catalog')
   * @returns Observable of matching catalog items
   */
  search<T = unknown>(
    request: CatalogSearchRequest,
    apiEndpoint = '/api/catalog'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/search`, {
        method: 'POST',
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
        const err = error instanceof Error ? error : new Error('Failed to search catalog');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Retrieve a catalog item by ID
   *
   * @param objectId - The catalog object ID
   * @param apiEndpoint - Backend API endpoint (default: '/api/catalog')
   * @returns Observable of the catalog item
   */
  retrieve<T = unknown>(objectId: string, apiEndpoint = '/api/catalog'): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/${objectId}`, {
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
        const err = error instanceof Error ? error : new Error('Failed to retrieve catalog item');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }

  /**
   * Batch retrieve catalog items by IDs
   *
   * @param objectIds - The catalog object IDs
   * @param apiEndpoint - Backend API endpoint (default: '/api/catalog')
   * @returns Observable of the catalog items
   */
  batchRetrieve<T = unknown>(
    objectIds: string[],
    apiEndpoint = '/api/catalog'
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return from(
      fetch(`${apiEndpoint}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectIds }),
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
        const err =
          error instanceof Error ? error : new Error('Failed to batch retrieve catalog items');
        this.errorSubject.next(err);
        return throwError(() => err);
      }),
      finalize(() => {
        this.loadingSubject.next(false);
      })
    );
  }
}
