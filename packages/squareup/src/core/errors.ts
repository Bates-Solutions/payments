/**
 * Square error codes
 */
export type SquareErrorCode =
  | 'UNAUTHORIZED'
  | 'ACCESS_TOKEN_EXPIRED'
  | 'ACCESS_TOKEN_REVOKED'
  | 'FORBIDDEN'
  | 'INSUFFICIENT_SCOPES'
  | 'BAD_REQUEST'
  | 'INVALID_VALUE'
  | 'MISSING_REQUIRED_PARAMETER'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'CARD_DECLINED'
  | 'VERIFY_CVV_FAILURE'
  | 'VERIFY_AVS_FAILURE'
  | 'INVALID_EXPIRATION'
  | 'CARD_EXPIRED'
  | 'INVALID_CARD'
  | 'GENERIC_DECLINE'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

/**
 * Base Square error class
 */
export class SquareError extends Error {
  public readonly code: SquareErrorCode;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: SquareErrorCode = 'UNKNOWN',
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'SquareError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API-level errors from Square
 */
export class SquareApiError extends SquareError {
  public readonly errors: Array<{
    category: string;
    code: string;
    detail?: string;
    field?: string;
  }>;

  constructor(
    message: string,
    code: SquareErrorCode,
    statusCode: number,
    errors: Array<{ category: string; code: string; detail?: string; field?: string }>
  ) {
    super(message, code, statusCode, errors);
    this.name = 'SquareApiError';
    this.errors = errors;
  }
}

/**
 * Authentication errors
 */
export class SquareAuthError extends SquareError {
  constructor(message: string, code: SquareErrorCode = 'UNAUTHORIZED') {
    super(message, code, 401);
    this.name = 'SquareAuthError';
  }
}

/**
 * Payment processing errors
 */
export class SquarePaymentError extends SquareError {
  public readonly paymentId?: string;

  constructor(message: string, code: SquareErrorCode, paymentId?: string) {
    super(message, code, 400);
    this.name = 'SquarePaymentError';
    this.paymentId = paymentId;
  }
}

/**
 * Validation errors
 */
export class SquareValidationError extends SquareError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'INVALID_VALUE', 400);
    this.name = 'SquareValidationError';
    this.field = field;
  }
}

/**
 * The request never got an HTTP response: a connection failure (DNS, reset,
 * `fetch failed`) or a client-side timeout. Square may or may not have
 * processed the request. `statusCode` is always undefined.
 *
 * `cause` holds the SDK error. It never contains the request, so secrets
 * such as an OAuth `client_secret` are not exposed.
 */
export class SquareNetworkError extends SquareError {
  declare public readonly code: 'NETWORK_ERROR' | 'TIMEOUT';

  constructor(message: string, code: 'NETWORK_ERROR' | 'TIMEOUT', options?: { cause?: unknown }) {
    super(message, code);
    this.name = 'SquareNetworkError';
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

type SquareErrorEntry = { category: string; code: string; detail?: string; field?: string };

/**
 * Parse Square SDK errors into typed exceptions
 */
export function parseSquareError(error: unknown): SquareError {
  // Already typed (e.g. thrown by assertNoResponseErrors inside a try block).
  // Must come before the SDK check: SquareError also carries `statusCode`.
  if (error instanceof SquareError) {
    return error;
  }

  if (error && typeof error === 'object') {
    // SDK timeout when fetch rejects with an AbortError (runtime-dependent):
    // plain Error subclass with no status code. Matched by name so this
    // module doesn't import the SDK.
    if (error instanceof Error && error.name === 'SquareTimeoutError') {
      return new SquareNetworkError(error.message, 'TIMEOUT', { cause: error });
    }

    if ('statusCode' in error) {
      const sdkError = error as {
        statusCode?: unknown;
        body?: { errors?: SquareErrorEntry[] };
      };

      // HTTP error response
      if (typeof sdkError.statusCode === 'number') {
        return fromErrorEntries(sdkError.body?.errors ?? [], sdkError.statusCode);
      }

      // The SDK's SquareError without a status code means no response arrived.
      if (error instanceof Error) {
        // The SDK aborts with the string reason 'timeout'. Node's fetch rejects
        // with that string rather than an AbortError, so the SDK reports it as
        // an unknown error with `cause: 'timeout'`, not a SquareTimeoutError.
        if (error.cause === 'timeout') {
          return new SquareNetworkError('Request to Square timed out', 'TIMEOUT', { cause: error });
        }
        return new SquareNetworkError(error.message, 'NETWORK_ERROR', { cause: error });
      }
    }
  }

  // Handle standard errors
  if (error instanceof Error) {
    return new SquareError(error.message);
  }

  return new SquareError('Unknown error occurred');
}

/**
 * Whether retrying the failed call could succeed: a network failure or
 * timeout, a request timeout (408), rate limiting (429), or a Square server
 * error (5xx). Validation,
 * auth and other 4xx errors return `false`.
 *
 * For a mutating call, retry with the **same** `idempotencyKey`. Otherwise a
 * request that reached Square before the failure can be applied twice.
 *
 * @example
 * ```typescript
 * const idempotencyKey = createIdempotencyKey();
 * try {
 *   await square.payments.create({ sourceId, amount, idempotencyKey });
 * } catch (error) {
 *   if (isRetryableSquareError(error)) {
 *     await square.payments.create({ sourceId, amount, idempotencyKey }); // same key
 *   } else {
 *     throw error;
 *   }
 * }
 * ```
 */
export function isRetryableSquareError(error: unknown): boolean {
  if (error instanceof SquareNetworkError) return true;
  if (!(error instanceof SquareError) || error instanceof SquareValidationError) return false;

  const { statusCode } = error;
  return statusCode === 408 || statusCode === 429 || (statusCode !== undefined && statusCode >= 500);
}

/**
 * Throw if a successful (2xx) Square response carries an `errors` array.
 *
 * Some endpoints return *either* `errors` *or* the payload in the body, so a
 * missing payload alone cannot distinguish "nothing there" from "request
 * failed" (e.g. a token missing a required scope).
 *
 * @internal
 */
export function assertNoResponseErrors(response: {
  errors?: ReadonlyArray<{ category: string; code: string; detail?: string | null; field?: string | null }> | null;
}): void {
  if (!response.errors?.length) return;

  const entries: SquareErrorEntry[] = response.errors.map((e) => ({
    category: e.category,
    code: e.code,
    ...(e.detail != null && { detail: e.detail }),
    ...(e.field != null && { field: e.field }),
  }));

  throw fromErrorEntries(entries, 200);
}

function fromErrorEntries(errors: SquareErrorEntry[], statusCode: number): SquareError {
  const firstError = errors[0];
  const message = firstError?.detail ?? 'Square API error';
  const code = mapErrorCode(firstError?.code);

  if (statusCode === 401) {
    return new SquareAuthError(message, code);
  }

  if (firstError?.category === 'PAYMENT_METHOD_ERROR') {
    return new SquarePaymentError(message, code);
  }

  return new SquareApiError(message, code, statusCode, errors);
}

/**
 * Map Square error codes to typed codes
 */
function mapErrorCode(code?: string): SquareErrorCode {
  if (!code) return 'UNKNOWN';

  const codeMap: Record<string, SquareErrorCode> = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',
    ACCESS_TOKEN_REVOKED: 'ACCESS_TOKEN_REVOKED',
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_SCOPES: 'INSUFFICIENT_SCOPES',
    BAD_REQUEST: 'BAD_REQUEST',
    INVALID_VALUE: 'INVALID_VALUE',
    MISSING_REQUIRED_PARAMETER: 'MISSING_REQUIRED_PARAMETER',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMITED: 'RATE_LIMITED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    CARD_DECLINED: 'CARD_DECLINED',
    VERIFY_CVV_FAILURE: 'VERIFY_CVV_FAILURE',
    VERIFY_AVS_FAILURE: 'VERIFY_AVS_FAILURE',
    INVALID_EXPIRATION: 'INVALID_EXPIRATION',
    CARD_EXPIRED: 'CARD_EXPIRED',
    INVALID_CARD: 'INVALID_CARD',
    GENERIC_DECLINE: 'GENERIC_DECLINE',
  };

  return codeMap[code] ?? 'UNKNOWN';
}
