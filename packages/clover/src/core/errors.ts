/**
 * Normalized Clover error codes
 */
export type CloverErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'INVALID_VALUE'
  | 'MISSING_REQUIRED_PARAMETER'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'CARD_DECLINED'
  | 'PROCESSING_ERROR'
  | 'UNKNOWN';

/**
 * Base Clover error class
 */
export class CloverError extends Error {
  public readonly code: CloverErrorCode;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: CloverErrorCode = 'UNKNOWN',
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'CloverError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API-level errors returned by Clover
 */
export class CloverApiError extends CloverError {
  /** Raw Clover error code, when present */
  public readonly cloverCode?: string;
  /** Clover request id for support/debugging */
  public readonly requestId?: string;

  constructor(
    message: string,
    code: CloverErrorCode,
    statusCode: number,
    options?: { cloverCode?: string; requestId?: string; details?: unknown }
  ) {
    super(message, code, statusCode, options?.details);
    this.name = 'CloverApiError';
    this.cloverCode = options?.cloverCode;
    this.requestId = options?.requestId;
  }
}

/**
 * Authentication / authorization errors (401 / 403)
 */
export class CloverAuthError extends CloverError {
  constructor(message: string, statusCode = 401, code: CloverErrorCode = 'UNAUTHORIZED') {
    super(message, code, statusCode);
    this.name = 'CloverAuthError';
  }
}

/**
 * Payment processing errors (card declines, etc.)
 */
export class CloverPaymentError extends CloverError {
  public readonly chargeId?: string;
  public readonly declineCode?: string;

  constructor(
    message: string,
    code: CloverErrorCode = 'CARD_DECLINED',
    options?: { chargeId?: string; declineCode?: string }
  ) {
    super(message, code, 402);
    this.name = 'CloverPaymentError';
    this.chargeId = options?.chargeId;
    this.declineCode = options?.declineCode;
  }
}

/**
 * Validation errors for input this wrapper checks before calling Clover
 */
export class CloverValidationError extends CloverError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'INVALID_VALUE', 400);
    this.name = 'CloverValidationError';
    this.field = field;
  }
}

/**
 * Shape of a Clover error response body. The Ecommerce API returns a nested
 * `error` object (Stripe-shaped); the Platform API returns a flat `message`.
 */
interface CloverErrorBody {
  message?: string;
  error?: { code?: string; message?: string; type?: string; decline_code?: string; charge?: string };
}

function mapStatus(status: number): CloverErrorCode {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 402:
      return 'CARD_DECLINED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    default:
      return status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'UNKNOWN';
  }
}

/**
 * Build a typed error from a non-2xx Clover HTTP response.
 *
 * @internal Used by the HTTP client; consumers catch the resulting typed error.
 */
export function cloverErrorFromResponse(
  status: number,
  body: unknown,
  requestId?: string | null
): CloverError {
  const parsed = (body ?? {}) as CloverErrorBody;
  const inner = parsed.error;
  const message = inner?.message ?? parsed.message ?? `Clover API error (HTTP ${status.toString()})`;
  const code = mapStatus(status);
  const reqId = requestId ?? undefined;

  if (status === 401 || status === 403) {
    return new CloverAuthError(message, status, code);
  }

  if (status === 402) {
    return new CloverPaymentError(message, 'CARD_DECLINED', {
      chargeId: inner?.charge,
      declineCode: inner?.decline_code,
    });
  }

  return new CloverApiError(message, code, status, {
    cloverCode: inner?.code,
    requestId: reqId,
    details: body,
  });
}

/**
 * Parse any thrown value into a typed Clover error.
 *
 * Passes through errors this library already produced (including those thrown
 * by the HTTP client) and wraps everything else — e.g. a `fetch` network
 * failure — as a base {@link CloverError}.
 */
export function parseCloverError(error: unknown): CloverError {
  if (error instanceof CloverError) {
    return error;
  }
  if (error instanceof Error) {
    return new CloverError(error.message);
  }
  return new CloverError('Unknown error occurred');
}
