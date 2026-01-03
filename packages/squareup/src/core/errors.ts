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

/**
 * Parse Square SDK errors into typed exceptions
 */
export function parseSquareError(error: unknown): SquareError {
  // Handle Square SDK errors
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const sdkError = error as {
      statusCode: number;
      body?: {
        errors?: Array<{ category: string; code: string; detail?: string; field?: string }>;
      };
    };

    const errors = sdkError.body?.errors ?? [];
    const firstError = errors[0];
    const message = firstError?.detail ?? 'Square API error';
    const code = mapErrorCode(firstError?.code);

    // Auth errors
    if (sdkError.statusCode === 401) {
      return new SquareAuthError(message, code);
    }

    // Payment errors
    if (firstError?.category === 'PAYMENT_METHOD_ERROR') {
      return new SquarePaymentError(message, code);
    }

    // General API errors
    return new SquareApiError(message, code, sdkError.statusCode, errors);
  }

  // Handle standard errors
  if (error instanceof Error) {
    return new SquareError(error.message);
  }

  return new SquareError('Unknown error occurred');
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
