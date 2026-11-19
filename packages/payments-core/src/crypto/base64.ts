const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Value of each byte as a base64 digit, or -1 when it isn't one. */
const VALUES = new Int8Array(256).fill(-1);
for (let index = 0; index < ALPHABET.length; index++) {
  VALUES[ALPHABET.charCodeAt(index)] = index;
}
// The URL-safe alphabet's two characters decode like their standard ones.
VALUES['-'.charCodeAt(0)] = 62;
VALUES['_'.charCodeAt(0)] = 63;

const PADDING = '='.charCodeAt(0);

/**
 * Decode base64 the way Node's `Buffer.from(text, 'base64')` does, with no Node
 * built-ins: standard or URL-safe alphabet, padding optional, characters outside
 * the alphabet (whitespace included) skipped, decoding stops at the first `=`,
 * and leftover bits that don't make a whole byte are dropped.
 *
 * Like Node, it reads each UTF-16 code unit by its low byte, so a character
 * above U+00FF counts as whatever Latin-1 character shares that byte (it may be
 * a digit or `=`). Real HTTP header values are Latin-1, where this never comes up.
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
  for (let i = 0; i < text.length; i++) {
    const byte = text.charCodeAt(i) & 0xff;
    if (byte === PADDING) break;
    const value = VALUES[byte] as number;
    if (value < 0) continue;
    buffer = ((buffer << 6) | value) & 0xfff;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buffer >> bits) & 0xff);
    }
  }
  return Uint8Array.from(out);
}
