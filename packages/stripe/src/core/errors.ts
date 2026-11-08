/**
 * Normalized Stripe error codes
 */
export type StripeErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'INVALID_VALUE'
  | 'MISSING_REQUIRED_PARAMETER'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'IDEMPOTENCY_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'CARD_DECLINED'
  | 'EXPIRED_CARD'
  | 'INCORRECT_CVC'
  | 'INCORRECT_NUMBER'
  | 'INSUFFICIENT_FUNDS'
  | 'PROCESSING_ERROR'
  | 'UNKNOWN';

/**
 * Base Stripe error class
 */
export class StripeError extends Error {
  public readonly code: StripeErrorCode;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: StripeErrorCode = 'UNKNOWN',
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'StripeError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API-level errors from Stripe
 */
export class StripeApiError extends StripeError {
  /** Raw Stripe error `type` (e.g. `invalid_request_error`) */
  public readonly type?: string;
  /** Request parameter the error relates to, if any */
  public readonly param?: string;
  /** Stripe request ID for support/debugging */
  public readonly requestId?: string;

  constructor(
    message: string,
    code: StripeErrorCode,
    statusCode: number,
    options?: { type?: string; param?: string; requestId?: string; details?: unknown }
  ) {
    super(message, code, statusCode, options?.details);
    this.name = 'StripeApiError';
    this.type = options?.type;
    this.param = options?.param;
    this.requestId = options?.requestId;
  }
}

/**
 * Authentication errors
 */
export class StripeAuthError extends StripeError {
  constructor(message: string, code: StripeErrorCode = 'UNAUTHORIZED') {
    super(message, code, 401);
    this.name = 'StripeAuthError';
  }
}

/**
 * Payment processing errors (card declines, etc.)
 */
export class StripePaymentError extends StripeError {
  public readonly paymentIntentId?: string;
  /** Stripe decline code (e.g. `insufficient_funds`), when present */
  public readonly declineCode?: string;

  constructor(
    message: string,
    code: StripeErrorCode,
    options?: { paymentIntentId?: string; declineCode?: string }
  ) {
    super(message, code, 402);
    this.name = 'StripePaymentError';
    this.paymentIntentId = options?.paymentIntentId;
    this.declineCode = options?.declineCode;
  }
}

/**
 * Validation errors for input this wrapper checks before calling Stripe
 */
export class StripeValidationError extends StripeError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'INVALID_VALUE', 400);
    this.name = 'StripeValidationError';
    this.field = field;
  }
}

/**
 * Shape of a Stripe SDK error (duck-typed to avoid importing the SDK value).
 */
interface StripeSdkError {
  type?: string;
  code?: string;
  statusCode?: number;
  message?: string;
  param?: string;
  requestId?: string;
  decline_code?: string;
  raw?: { message?: string; decline_code?: string };
  payment_intent?: { id?: string };
}

const STRIPE_ERROR_TYPES = new Set([
  'card_error',
  'invalid_request_error',
  'api_error',
  'idempotency_error',
  'authentication_error',
  'rate_limit_error',
  'validation_error',
  'api_connection_error',
]);

function isStripeSdkError(error: unknown): error is StripeSdkError {
  return (
    !!error &&
    typeof error === 'object' &&
    'type' in error &&
    typeof (error as { type?: unknown }).type === 'string' &&
    STRIPE_ERROR_TYPES.has((error as { type: string }).type)
  );
}

/**
 * Parse a Stripe SDK error (or any thrown value) into a typed exception.
 */
export function parseStripeError(error: unknown): StripeError {
  // Already a typed error from this library — pass it through unchanged.
  if (error instanceof StripeError) {
    return error;
  }

  if (isStripeSdkError(error)) {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? error.raw?.message ?? 'Stripe API error';
    const declineCode = error.decline_code ?? error.raw?.decline_code;

    switch (error.type) {
      case 'authentication_error':
        return new StripeAuthError(message);

      case 'card_error':
        return new StripePaymentError(message, mapCardErrorCode(error.code), {
          paymentIntentId: error.payment_intent?.id,
          declineCode,
        });

      case 'rate_limit_error':
        return new StripeApiError(message, 'RATE_LIMITED', statusCode, {
          type: error.type,
          param: error.param,
          requestId: error.requestId,
        });

      case 'idempotency_error':
        return new StripeApiError(message, 'IDEMPOTENCY_ERROR', statusCode, {
          type: error.type,
          param: error.param,
          requestId: error.requestId,
        });

      case 'invalid_request_error':
      case 'validation_error':
        return new StripeApiError(
          message,
          statusCode === 404 ? 'NOT_FOUND' : 'BAD_REQUEST',
          statusCode,
          { type: error.type, param: error.param, requestId: error.requestId }
        );

      default:
        // api_error, api_connection_error, and anything unexpected
        return new StripeApiError(message, 'INTERNAL_SERVER_ERROR', statusCode, {
          type: error.type,
          param: error.param,
          requestId: error.requestId,
        });
    }
  }

  if (error instanceof Error) {
    return new StripeError(error.message);
  }

  return new StripeError('Unknown error occurred');
}

/**
 * Map a Stripe card-error `code` to a normalized code.
 */
function mapCardErrorCode(code?: string): StripeErrorCode {
  if (!code) return 'CARD_DECLINED';

  const codeMap: Record<string, StripeErrorCode> = {
    card_declined: 'CARD_DECLINED',
    expired_card: 'EXPIRED_CARD',
    incorrect_cvc: 'INCORRECT_CVC',
    invalid_cvc: 'INCORRECT_CVC',
    incorrect_number: 'INCORRECT_NUMBER',
    invalid_number: 'INCORRECT_NUMBER',
    insufficient_funds: 'INSUFFICIENT_FUNDS',
    processing_error: 'PROCESSING_ERROR',
  };

  return codeMap[code] ?? 'CARD_DECLINED';
}
