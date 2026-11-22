import {
  PaymentsError,
  requireNonEmpty as requireNonEmptyOption,
} from '@bates-solutions/payments-core/errors';

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
 * Base Square error class. It extends core's `PaymentsError`, so
 * `error instanceof PaymentsError` catches any provider's error, even when the
 * providers install different copies of `@bates-solutions/payments-core`.
 */
export class SquareError extends PaymentsError<SquareErrorCode> {
  constructor(
    message: string,
    code: SquareErrorCode = 'UNKNOWN',
    statusCode?: number,
    details?: unknown
  ) {
    super(message, code, statusCode, details);
    this.name = 'SquareError';
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
 * Payment processing errors, such as a card decline. `code` is the normalized
 * code (`UNKNOWN` for Square codes outside {@link SquareErrorCode}); `errors`
 * keeps Square's raw entries, which {@link declineReason} reads.
 */
export class SquarePaymentError extends SquareError {
  /**
   * The id of the payment Square created for the declined attempt. A declined
   * `payments.create()` still creates a payment, with status `FAILED`, and
   * Square later sends `payment.created` / `payment.updated` webhooks for it:
   * keep this id to match those events to the attempt. Unset when Square's
   * error response doesn't include the payment.
   */
  public readonly paymentId?: string;
  /** The declined payment's status, usually `FAILED`, when Square included the payment. */
  public readonly paymentStatus?: string;
  /** When Square created the declined payment (RFC 3339), when it included the payment. */
  public readonly paymentCreatedAt?: string;
  /** Square's error entries, with the raw `code` (for example `INSUFFICIENT_FUNDS`). */
  public readonly errors: Array<{
    category: string;
    code: string;
    detail?: string;
    field?: string;
  }>;

  constructor(
    message: string,
    code: SquareErrorCode,
    paymentId?: string,
    errors: Array<{ category: string; code: string; detail?: string; field?: string }> = [],
    payment?: { status?: string; createdAt?: string }
  ) {
    super(message, code, 400, errors.length > 0 ? errors : undefined);
    this.errors = errors;
    this.name = 'SquarePaymentError';
    this.paymentId = paymentId;
    this.paymentStatus = payment?.status;
    this.paymentCreatedAt = payment?.createdAt;
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
 * Throw a {@link SquareValidationError} naming `field` when a required string
 * option is missing or empty.
 *
 * @internal
 */
export function requireNonEmpty(
  value: string | undefined,
  field: string
): asserts value is string {
  requireNonEmptyOption(value, field, (message, name) => new SquareValidationError(message, name));
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
        body?: { errors?: SquareErrorEntry[]; payment?: unknown };
      };

      // HTTP error response
      if (typeof sdkError.statusCode === 'number') {
        return fromErrorEntries(
          sdkError.body?.errors ?? [],
          sdkError.statusCode,
          declinedPayment(sdkError.body?.payment)
        );
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

/** Square's code for a transient failure on its side, not a decline. */
const TEMPORARY_ERROR = 'TEMPORARY_ERROR';

/**
 * Whether retrying the failed call could succeed: a network failure or
 * timeout, a request timeout (408), rate limiting (429), a Square server
 * error (5xx), or a response carrying Square's `TEMPORARY_ERROR` code, whatever
 * its status. Validation, auth and other 4xx errors return `false`.
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
  if (
    (error instanceof SquarePaymentError || error instanceof SquareApiError) &&
    error.errors.some((entry) => entry.code === TEMPORARY_ERROR)
  ) {
    return true;
  }

  const { statusCode } = error;
  return (
    statusCode === 408 || statusCode === 429 || (statusCode !== undefined && statusCode >= 500)
  );
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
  errors?: ReadonlyArray<{
    category: string;
    code: string;
    detail?: string | null;
    field?: string | null;
  }> | null;
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

type DeclinedPayment = { id?: string; status?: string; createdAt?: string };

/**
 * The payment in a declined CreatePayment's error body. The SDK leaves an
 * error body as Square sent it, in snake_case.
 */
function declinedPayment(payment: unknown): DeclinedPayment | undefined {
  if (!payment || typeof payment !== 'object') return undefined;
  const p = payment as Record<string, unknown>;
  const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
  return {
    id: str(p.id),
    status: str(p.status),
    createdAt: str(p.created_at) ?? str(p.createdAt),
  };
}

function fromErrorEntries(
  errors: SquareErrorEntry[],
  statusCode: number,
  payment?: DeclinedPayment
): SquareError {
  const firstError = errors[0];
  const message = firstError?.detail ?? 'Square API error';
  const code = mapErrorCode(firstError?.code);

  if (statusCode === 401) {
    return new SquareAuthError(message, code);
  }

  if (firstError?.category === 'PAYMENT_METHOD_ERROR') {
    return new SquarePaymentError(message, code, payment?.id, errors, payment);
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

/**
 * What a card decline means for charging the same card again.
 */
export interface DeclineReason {
  /** Square's error code, for example `GENERIC_DECLINE` or `INSUFFICIENT_FUNDS`. */
  code: string;
  /**
   * Whether charging the same card again later, without the buyer doing
   * anything, can succeed. When `false`, ask the buyer for another card (or to
   * fix this one) instead of retrying: repeated attempts on a hard decline
   * can get the merchant flagged by the card networks.
   *
   * A retry of a declined charge is a new payment attempt, so give it a new
   * idempotency key: Square answers a reused key with the original decline.
   */
  retryable: boolean;
}

/**
 * Retry policy per Square decline code, following Square's guidance for
 * charging cards on file. Codes not listed are treated as not retryable.
 *
 * Retryable:
 * - `INSUFFICIENT_FUNDS`: retry after a few days (for example after payday);
 *   not right away.
 * - `TRANSACTION_LIMIT`: the card's spending limit; retry later (or for less).
 *
 * Everything else needs the buyer: a new card (expired, invalid or
 * unsupported card), corrected details (CVV, postal code, address), or a call
 * to the issuer (`CARD_DECLINED_CALL_ISSUER`, `GENERIC_DECLINE`).
 */
const DECLINE_RETRYABLE: Readonly<Record<string, boolean>> = {
  INSUFFICIENT_FUNDS: true,
  TRANSACTION_LIMIT: true,

  GENERIC_DECLINE: false,
  CARD_DECLINED: false,
  CARD_DECLINED_CALL_ISSUER: false,
  CARD_DECLINED_VERIFICATION_REQUIRED: false,
  CVV_FAILURE: false,
  VERIFY_CVV_FAILURE: false,
  ADDRESS_VERIFICATION_FAILURE: false,
  VERIFY_AVS_FAILURE: false,
  INVALID_POSTAL_CODE: false,
  CARD_EXPIRED: false,
  EXPIRATION_FAILURE: false,
  INVALID_EXPIRATION: false,
  BAD_EXPIRATION: false,
  INVALID_ACCOUNT: false,
  INVALID_CARD: false,
  INVALID_CARD_DATA: false,
  PAN_FAILURE: false,
  CARD_NOT_SUPPORTED: false,
  ACCOUNT_UNUSABLE: false,
  CURRENCY_MISMATCH: false,
  INSUFFICIENT_PERMISSIONS: false,
  CARDHOLDER_INSUFFICIENT_PERMISSIONS: false,
  PAYMENT_LIMIT_EXCEEDED: false,
  CARD_TOKEN_EXPIRED: false,
  CARD_TOKEN_USED: false,
};

/**
 * Classify a failed charge: Square's decline code and whether charging the
 * same card again later can succeed.
 *
 * Returns `undefined` when `error` is not a card decline (not a
 * {@link SquarePaymentError}, and no `PAYMENT_METHOD_ERROR` entry on a
 * {@link SquareApiError}), and for Square's `TEMPORARY_ERROR`, which is a
 * transient failure rather than a decline. Unknown codes are not retryable.
 *
 * | Code | `retryable` |
 * | --- | --- |
 * | `INSUFFICIENT_FUNDS` | `true`, after a few days |
 * | `TRANSACTION_LIMIT` | `true`, later |
 * | `GENERIC_DECLINE`, `CVV_FAILURE`, `CARD_EXPIRED`, `INVALID_ACCOUNT`, ... | `false` |
 * | any other code | `false` |
 *
 * This is about the card. Network failures, 5xx responses and Square's
 * `TEMPORARY_ERROR` are a separate question: see {@link isRetryableSquareError},
 * and retry those with the **same** idempotency key.
 *
 * @example
 * ```typescript
 * try {
 *   await square.payments.create({ sourceId: cardId, customerId, amount, idempotencyKey });
 * } catch (error) {
 *   const decline = declineReason(error);
 *   if (decline?.retryable) {
 *     await scheduleRetry(subscriptionId, { inDays: 3, reason: decline.code });
 *   } else if (decline) {
 *     await askForNewCard(customerId, decline.code);
 *   } else {
 *     throw error;
 *   }
 * }
 * ```
 */
export function declineReason(error: unknown): DeclineReason | undefined {
  let code: string | undefined;

  if (error instanceof SquarePaymentError || error instanceof SquareApiError) {
    code = error.errors.find((entry) => entry.category === 'PAYMENT_METHOD_ERROR')?.code;
  }
  // A SquarePaymentError built without entries still carries a typed code.
  if (code === undefined && error instanceof SquarePaymentError && error.code !== 'UNKNOWN') {
    code = error.code;
  }
  if (code === undefined || code === TEMPORARY_ERROR) {
    return undefined;
  }

  return { code, retryable: DECLINE_RETRYABLE[code] ?? false };
}
