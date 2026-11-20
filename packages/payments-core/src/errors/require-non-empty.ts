/**
 * Throw when a required string option is missing or empty, using the provider's
 * own validation error. Narrows `value` to `string` afterwards.
 *
 * @param value - The option's value.
 * @param field - The option's name, used in the message (`${field} is required`).
 * @param createError - Builds the error to throw from the message and field name.
 *
 * @example
 * ```typescript
 * requireNonEmpty(options.clientId, 'clientId', (message, field) =>
 *   new CloverValidationError(message, field)
 * );
 * ```
 */
export function requireNonEmpty(
  value: string | undefined,
  field: string,
  createError: (message: string, field: string) => Error
): asserts value is string {
  if (!value) {
    throw createError(`${field} is required`, field);
  }
}
