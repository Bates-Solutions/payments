const encoder = new TextEncoder();

/**
 * Constant-time equality of two strings or two byte sequences. Pure JS, so it
 * works where `node:crypto` is missing.
 *
 * Two strings are compared code unit by code unit, so the result is exactly
 * `a === b`. When either side is a `Uint8Array`, a string on the other side is
 * compared as its UTF-8 bytes (an unpaired surrogate encodes as U+FFFD there).
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
  if (typeof a === 'string' && typeof b === 'string') {
    if (a.length !== b.length || a.length === 0) {
      return false;
    }
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return mismatch === 0;
  }

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
