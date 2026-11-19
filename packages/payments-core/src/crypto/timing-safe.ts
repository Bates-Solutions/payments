const encoder = new TextEncoder();

/**
 * Constant-time equality of two byte sequences, or two strings compared as
 * their UTF-8 bytes. Pure JS, so it works where `node:crypto` is missing.
 *
 * Returns `false` without comparing when the lengths differ or either side is
 * empty: an empty signature must never verify. For equal lengths, the time
 * taken depends only on the length, not on where the inputs differ.
 *
 * @example
 * ```typescript
 * if (!timingSafeEqual(signatureFromHeader, expectedSignature)) {
 *   return { valid: false, error: 'Invalid signature' };
 * }
 * ```
 */
export function timingSafeEqual(a: string | Uint8Array, b: string | Uint8Array): boolean {
  const left = typeof a === 'string' ? encoder.encode(a) : a;
  const right = typeof b === 'string' ? encoder.encode(b) : b;
  if (left.length !== right.length || left.length === 0) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) {
    // Both indexes are in range: the lengths are equal and i < length.
    mismatch |= (left[i] as number) ^ (right[i] as number);
  }
  return mismatch === 0;
}
