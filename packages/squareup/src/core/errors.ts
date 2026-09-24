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

  // Handle Square SDK errors
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const sdkError = error as {
      statusCode: number;
      body?: { errors?: SquareErrorEntry[] };
    };

    return fromErrorEntries(sdkError.body?.errors ?? [], sdkError.statusCode);
  }

  // Handle standard errors
  if (error instanceof Error) {
    return new SquareError(error.message);
  }

  return new SquareError('Unknown error occurred');
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
