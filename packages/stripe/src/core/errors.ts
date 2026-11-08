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
  | 'AUTHENTICATION_REQUIRED'
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
 *
 * `stripe-node` errors set `type` to their class name (e.g. `StripeCardError`)
 * and keep Stripe's own error type (e.g. `card_error`) in `rawType`. Plain
 * objects in Stripe's API shape carry the API type in `type`.
 */
interface StripeSdkError {
  type?: string;
  rawType?: string;
  code?: string;
  statusCode?: number;
  message?: string;
  param?: string;
  requestId?: string;
  decline_code?: string;
  raw?: { message?: string; decline_code?: string };
  payment_intent?: { id?: string };
}

/**
 * `stripe-node` error classes that pin down what went wrong, mapped to the
 * error type they stand for. The SDK picks these from the HTTP status (401,
 * 402, 403, 429, ...), which is more reliable than the API's `type`: Stripe
 * sends `invalid_request_error` for a bad API key (401) and for rate limits.
 */
const SPECIFIC_SDK_CLASSES: Record<string, string> = {
  StripeCardError: 'card_error',
  StripeAuthenticationError: 'authentication_error',
  StripePermissionError: 'permission_error',
  StripeRateLimitError: 'rate_limit_error',
  RateLimitError: 'rate_limit_error',
  StripeConnectionError: 'api_connection_error',
  StripeIdempotencyError: 'idempotency_error',
  // Connect OAuth errors (connect.stripe.com)
  StripeOAuthError: 'oauth_error',
  StripeInvalidGrantError: 'invalid_grant',
  StripeInvalidClientError: 'invalid_client',
  StripeOAuthInvalidRequestError: 'invalid_request',
  StripeInvalidScopeError: 'invalid_scope',
  StripeUnsupportedGrantTypeError: 'unsupported_grant_type',
  StripeUnsupportedResponseTypeError: 'unsupported_response_type',
};

/**
 * Generic `stripe-node` classes. For these the API `type` (in `rawType`) and
 * the HTTP status decide, e.g. a 409 arrives as a `StripeAPIError` whose
 * `rawType` is `invalid_request_error`.
 */
const GENERIC_SDK_CLASSES: Record<string, string> = {
  StripeAPIError: 'api_error',
  StripeInvalidRequestError: 'invalid_request_error',
};

const STRIPE_ERROR_TYPES = new Set([
  'card_error',
  'invalid_request_error',
  'api_error',
  'idempotency_error',
  'authentication_error',
  'permission_error',
  'rate_limit_error',
  'validation_error',
  'api_connection_error',
  'oauth_error',
  'invalid_grant',
  'invalid_client',
  'invalid_request',
  'invalid_scope',
  'unsupported_grant_type',
  'unsupported_response_type',
]);

/**
 * Work out the Stripe error type of a thrown value, or `undefined` if it is
 * not a Stripe error.
 */
function stripeErrorType(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  const { type, rawType, statusCode, code } = error as {
    type?: unknown;
    rawType?: unknown;
    statusCode?: unknown;
    code?: unknown;
  };

  // 1. A specific SDK class says exactly what happened.
  if (typeof type === 'string' && Object.hasOwn(SPECIFIC_SDK_CLASSES, type)) {
    return SPECIFIC_SDK_CLASSES[type];
  }

  // 2. Otherwise (generic class or plain object): the API type...
  let apiType: string | undefined;
  if (typeof rawType === 'string' && STRIPE_ERROR_TYPES.has(rawType)) {
    apiType = rawType;
  } else if (typeof type === 'string' && STRIPE_ERROR_TYPES.has(type)) {
    apiType = type;
  } else if (typeof type === 'string' && Object.hasOwn(GENERIC_SDK_CLASSES, type)) {
    apiType = GENERIC_SDK_CLASSES[type];
  }
  if (apiType !== 'invalid_request_error' && apiType !== 'api_error') {
    return apiType;
  }

  // 3. ...refined by the status, the way the SDK picks its classes.
  if (statusCode === 429 || (statusCode === 400 && code === 'rate_limit')) {
    return 'rate_limit_error';
  }
  if (statusCode === 401) return 'authentication_error';
  if (statusCode === 403) return 'permission_error';
  return apiType;
}

/**
 * Parse a Stripe SDK error (or any thrown value) into a typed exception.
 *
 * Understands both `stripe-node` error instances and plain objects in
 * Stripe's API error shape. See the error guide for the full code map.
 */
export function parseStripeError(error: unknown): StripeError {
  // Already a typed error from this library — pass it through unchanged.
  if (error instanceof StripeError) {
    return error;
  }

  const type = stripeErrorType(error);
  if (type) {
    const sdkError = error as StripeSdkError;
    // stripe-node defaults missing strings to '', so skip empty values too.
    const message = [sdkError.message, sdkError.raw?.message].find(Boolean) ?? 'Stripe API error';
    const declineCode = [sdkError.decline_code, sdkError.raw?.decline_code].find(Boolean);
    const apiError = (code: StripeErrorCode, fallbackStatus: number): StripeApiError =>
      new StripeApiError(message, code, sdkError.statusCode ?? fallbackStatus, {
        type,
        param: sdkError.param,
        requestId: sdkError.requestId,
      });

    switch (type) {
      case 'authentication_error':
      case 'invalid_client':
        return new StripeAuthError(message);

      case 'permission_error':
        return apiError('FORBIDDEN', 403);

      case 'card_error':
        return new StripePaymentError(message, mapCardErrorCode(sdkError.code), {
          paymentIntentId: sdkError.payment_intent?.id,
          declineCode,
        });

      case 'rate_limit_error':
        return apiError('RATE_LIMITED', 429);

      case 'idempotency_error':
        return apiError('IDEMPOTENCY_ERROR', 400);

      case 'invalid_request_error':
      case 'validation_error':
        return apiError(statusCodeToErrorCode(sdkError.statusCode), 400);

      case 'api_connection_error':
        // No HTTP response at all (network failure, timeout).
        return apiError('SERVICE_UNAVAILABLE', 503);

      case 'api_error':
        return apiError(
          sdkError.statusCode === 503 ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_SERVER_ERROR',
          500
        );

      default:
        // Connect OAuth: invalid_grant, invalid_request, invalid_scope, …
        return apiError('BAD_REQUEST', 400);
    }
  }

  if (error instanceof Error) {
    return new StripeError(error.message);
  }

  return new StripeError('Unknown error occurred');
}

/**
 * Map the HTTP status of an `invalid_request_error` to a normalized code.
 */
function statusCodeToErrorCode(statusCode: number | undefined): StripeErrorCode {
  switch (statusCode) {
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    default:
      return 'BAD_REQUEST';
  }
}

const CARD_ERROR_CODES: Record<string, StripeErrorCode> = {
  card_declined: 'CARD_DECLINED',
  expired_card: 'EXPIRED_CARD',
  incorrect_cvc: 'INCORRECT_CVC',
  invalid_cvc: 'INCORRECT_CVC',
  incorrect_number: 'INCORRECT_NUMBER',
  invalid_number: 'INCORRECT_NUMBER',
  insufficient_funds: 'INSUFFICIENT_FUNDS',
  processing_error: 'PROCESSING_ERROR',
  authentication_required: 'AUTHENTICATION_REQUIRED',
};

/**
 * Map a Stripe card-error `code` to a normalized code. A `card_declined`
 * stays `CARD_DECLINED` whatever its `decline_code` (e.g.
 * `insufficient_funds`), which is on `StripePaymentError.declineCode`.
 */
function mapCardErrorCode(code?: string): StripeErrorCode {
  // Own keys only, so a code like "constructor" can't hit Object.prototype.
  if (code !== undefined && Object.hasOwn(CARD_ERROR_CODES, code)) {
    return CARD_ERROR_CODES[code] ?? 'CARD_DECLINED';
  }
  return 'CARD_DECLINED';
}
