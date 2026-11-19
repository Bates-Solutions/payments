const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const VALUES = new Map<string, number>();
for (let index = 0; index < ALPHABET.length; index++) {
  VALUES.set(ALPHABET.charAt(index), index);
}
// The URL-safe alphabet's two characters decode like their standard ones.
VALUES.set('-', 62);
VALUES.set('_', 63);

/**
 * Decode base64 the way Node's `Buffer.from(text, 'base64')` does, with no Node
 * built-ins: standard or URL-safe alphabet, padding optional, characters outside
 * the alphabet (whitespace included) skipped, decoding stops at the first `=`,
 * and leftover bits that don't make a whole byte are dropped.
 *
 * That leniency is deliberate: it lets a WebCrypto signature check accept
 * exactly the inputs a `node:crypto` one that decodes with `Buffer` accepts.
 * Never fails; text with no base64 characters decodes to no bytes.
 *
 * @example
 * ```typescript
 * fromBase64('aGk=');  // Uint8Array [104, 105]
 * fromBase64('aGk');   // the same: padding is optional
 * ```
 */
export function fromBase64(text: string): Uint8Array {
  const out: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const char of text) {
    if (char === '=') break;
    const value = VALUES.get(char);
    if (value === undefined) continue;
    buffer = ((buffer << 6) | value) & 0xfff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xff);
    }
  }
  return Uint8Array.from(out);
}
