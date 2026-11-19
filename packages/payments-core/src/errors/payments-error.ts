/** V8's `Error.captureStackTrace`, which the web platform types don't declare. */
type CaptureStackTrace = (target: object, constructorOpt?: unknown) => void;

/**
 * Base class for the errors each provider package throws (`SquareError`,
 * `StripeError`, `CloverError`). It carries a provider-specific `code`, plus the
 * HTTP status and raw details when the error came from an API response.
 *
 * Catch it to handle any provider's error in one place:
 *
 * @example
 * ```typescript
 * try {
 *   await client.payments.create(input);
 * } catch (error) {
 *   if (error instanceof PaymentsError) {
 *     console.error(error.name, error.code, error.statusCode);
 *   }
 *   throw error;
 * }
 * ```
 *
 * @typeParam Code - The provider's union of error codes.
 */
export class PaymentsError<Code extends string = string> extends Error {
  /** Normalized error code. Each provider defines its own union. */
  public readonly code: Code;
  /** HTTP status of the response that caused the error, if any. */
  public readonly statusCode?: number;
  /** The raw error body or other context, if any. */
  public readonly details?: unknown;

  constructor(message: string, code: Code, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'PaymentsError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // On V8 (Node, Deno, Bun, Workers), start the stack trace where the error
    // was thrown rather than in these constructors. Other engines skip this.
    const capture = (Error as { captureStackTrace?: CaptureStackTrace }).captureStackTrace;
    if (typeof capture === 'function') {
      capture(this, new.target);
    }
  }
}
