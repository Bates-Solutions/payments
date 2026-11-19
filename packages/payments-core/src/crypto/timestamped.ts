import { toHex } from './encoding.js';
import { hmacSha256 } from './hmac.js';
import { timingSafeEqual } from './timing-safe.js';

/** The parts of a `t=<timestamp>,<scheme>=<signature>,…` signature header. */
export interface TimestampedSignatureHeader {
  /** The `t` value in Unix seconds, or `null` when it is missing or not a number. */
  timestamp: number | null;
  /** Every signature listed under the scheme, in header order. */
  signatures: string[];
}

/** Options for {@link verifyTimestampedHmac}. */
export interface VerifyTimestampedHmacOptions {
  /**
   * Maximum age (or skew into the future) of the timestamp, in seconds.
   * Defaults to 300. Zero or a negative number turns the check off; `NaN` (or
   * a non-number) rejects every timestamp rather than skipping the check.
   */
  tolerance?: number;
  /**
   * The current time in Unix seconds. Defaults to the system clock. A value
   * that isn't a finite number rejects every timestamp.
   */
  now?: number;
  /** The header key the signatures are listed under. Defaults to `v1`. */
  scheme?: string;
}

/** Why {@link verifyTimestampedHmac} rejected a signature. */
export type TimestampedHmacFailure =
  /** No usable `t` value, or no signature under the scheme. */
  | 'malformed-header'
  /** No listed signature matches the HMAC of `${timestamp}.${payload}`. */
  | 'signature-mismatch'
  /** The signature matches, but the timestamp is outside the tolerance. */
  | 'timestamp-outside-tolerance';

/** The result of {@link verifyTimestampedHmac}. */
export type TimestampedHmacResult =
  { valid: true; timestamp: number } | { valid: false; reason: TimestampedHmacFailure };

/**
 * Parse a `t=<timestamp>,v1=<signature>,v1=…` header, the format Stripe and
 * Clover use.
 *
 * These are the rules Stripe's and Clover's packages used before core, kept
 * exactly:
 *
 * - Parts are split on `,`, and each part with `split('=', 2)`: the key is the
 *   text before the first `=`, the value the text up to the next `=`, and
 *   anything after a second `=` is dropped (`v1=abc=junk` reads as `abc`).
 * - A part whose key or value is empty is skipped. That check comes before
 *   trimming, so `v1= ` adds an empty signature (which never matches) and
 *   `t= ` resets the timestamp to `null`.
 * - Keys and values are then trimmed. A later `t` replaces an earlier one.
 * - The timestamp is read with `parseInt`, so `t=0123` is 123 and `t=12abc` is 12.
 */
export function parseTimestampedSignatureHeader(
  header: string,
  scheme = 'v1'
): TimestampedSignatureHeader {
  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(',')) {
    const [key, value] = part.split('=', 2);
    if (!key || !value) continue;
    if (key.trim() === 't') {
      const parsed = Number.parseInt(value.trim(), 10);
      timestamp = Number.isNaN(parsed) ? null : parsed;
    } else if (key.trim() === scheme) {
      signatures.push(value.trim());
    }
  }

  return { timestamp, signatures };
}

/**
 * Verify a timestamped HMAC-SHA256 signature header, the scheme Stripe and
 * Clover use: the provider signs `${timestamp}.${payload}` and sends
 * `t=<timestamp>,v1=<hex signature>`.
 *
 * Checks, in order: the header parses, one of the listed signatures matches
 * (each compared in constant time), and the timestamp is within the tolerance.
 * The caller checks for a missing payload, header or secret first and maps the
 * failure reason to its own messages; an empty `secret` makes the promise
 * reject (see {@link hmacSha256}).
 *
 * @example
 * ```typescript
 * const result = await verifyTimestampedHmac(rawBody, header, signingSecret);
 * if (!result.valid && result.reason === 'timestamp-outside-tolerance') {
 *   // reject a replayed webhook
 * }
 * ```
 */
export async function verifyTimestampedHmac(
  payload: string,
  header: string,
  secret: string,
  options?: VerifyTimestampedHmacOptions
): Promise<TimestampedHmacResult> {
  const { timestamp, signatures } = parseTimestampedSignatureHeader(header, options?.scheme);
  if (timestamp === null || signatures.length === 0) {
    return { valid: false, reason: 'malformed-header' };
  }

  const expected = toHex(await hmacSha256(secret, `${timestamp.toString()}.${payload}`));
  if (!signatures.some((signature) => timingSafeEqual(signature, expected))) {
    return { valid: false, reason: 'signature-mismatch' };
  }

  const tolerance = options?.tolerance ?? 300;
  // Fail closed: a tolerance or clock that isn't a number must not turn the
  // replay check off. `!(x <= tolerance)` is also true when x is NaN.
  if (typeof tolerance !== 'number' || Number.isNaN(tolerance)) {
    return { valid: false, reason: 'timestamp-outside-tolerance' };
  }
  if (tolerance > 0) {
    const now = options?.now ?? Math.floor(Date.now() / 1000);
    if (!Number.isFinite(now) || !(Math.abs(now - timestamp) <= tolerance)) {
      return { valid: false, reason: 'timestamp-outside-tolerance' };
    }
  }

  return { valid: true, timestamp };
}
