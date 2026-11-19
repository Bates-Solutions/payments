/**
 * Bytes as lowercase hex, two characters per byte.
 *
 * @example
 * ```typescript
 * toHex(new Uint8Array([0, 15, 255])); // '000fff'
 * ```
 */
export function toHex(bytes: Uint8Array | ArrayBuffer): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let hex = '';
  for (const byte of view) {
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Bytes as standard base64 (RFC 4648, `+` and `/`, with `=` padding), the
 * encoding Square uses for its webhook signatures.
 *
 * @example
 * ```typescript
 * toBase64(new TextEncoder().encode('hi')); // 'aGk='
 * ```
 */
export function toBase64(bytes: Uint8Array | ArrayBuffer): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
