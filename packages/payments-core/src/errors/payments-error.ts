/** V8's `Error.captureStackTrace`, which the web platform types don't declare. */
type CaptureStackTrace = (target: object, constructorOpt?: unknown) => void;

/**
 * Marks `PaymentsError.prototype`. `Symbol.for` returns the same symbol in every
 * copy of this package (and every realm), so the mark survives a second install.
 * The key carries no version: every 0.x and later copy recognizes every other.
 */
const BRAND = Symbol.for('@bates-solutions/payments-core/PaymentsError');

/**
 * Base class for the errors each provider package throws (`SquareError`,
 * `StripeError`, `CloverError`). It carries a provider-specific `code`, plus the
 * HTTP status and raw details when the error came from an API response.
 *
 * Catch it to handle any provider's error in one place. `instanceof
 * PaymentsError` matches an error from any copy of this package, so it still
 * works when providers built on different core versions install separate
 * copies. Checks against a subclass (`instanceof SquareError`) are ordinary
 * prototype checks.
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

  /**
   * Makes `value instanceof PaymentsError` true for an error from any copy of
   * this package, not only this one. It looks for a brand that every copy puts
   * on `PaymentsError.prototype`. On a subclass, such as `SquareError`, it is
   * the usual prototype-chain check.
   *
   * It returns a plain `boolean` rather than a type predicate, so TypeScript
   * keeps narrowing `instanceof SquareError` to `SquareError`.
   */
  static {
    // On the prototype, not each instance, and not enumerable: errors' own
    // keys, JSON output and logs are unchanged.
    Object.defineProperty(this.prototype, BRAND, { value: true });
  }

  static [Symbol.hasInstance](value: unknown): boolean {
    if (this !== PaymentsError) {
      return Function.prototype[Symbol.hasInstance].call(this, value);
    }
    return (
      (typeof value === 'object' || typeof value === 'function') &&
      value !== null &&
      (value as { [BRAND]?: unknown })[BRAND] === true
    );
  }

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
