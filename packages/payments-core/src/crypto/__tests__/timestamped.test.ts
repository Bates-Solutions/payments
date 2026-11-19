import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { parseTimestampedSignatureHeader, verifyTimestampedHmac } from '../timestamped';

const SECRET = 'whsec_test_secret';
const PAYLOAD = JSON.stringify({ id: 'evt_1', type: 'payment.created' });
const NOW = 1_730_000_000;

/** The hex signature a provider sends for `${t}.${payload}`. Tests only use node:crypto. */
const sign = (t: number, payload = PAYLOAD, secret = SECRET) =>
  createHmac('sha256', secret).update(`${t.toString()}.${payload}`).digest('hex');

describe('parseTimestampedSignatureHeader', () => {
  it('reads the timestamp and every v1 signature in order', () => {
    expect(parseTimestampedSignatureHeader('t=123,v1=aa,v0=zz,v1=bb')).toEqual({
      timestamp: 123,
      signatures: ['aa', 'bb'],
    });
  });

  it('trims keys and values', () => {
    expect(parseTimestampedSignatureHeader(' t = 5 , v1 = aa ')).toEqual({
      timestamp: 5,
      signatures: ['aa'],
    });
  });

  it('gives a null timestamp when t is missing or not a number', () => {
    expect(parseTimestampedSignatureHeader('v1=aa').timestamp).toBeNull();
    expect(parseTimestampedSignatureHeader('t=abc,v1=aa').timestamp).toBeNull();
  });

  it('skips parts with an empty key or value, and keeps the last t', () => {
    expect(parseTimestampedSignatureHeader('t=1,=x,v1=,junk,t=2,v1=aa')).toEqual({
      timestamp: 2,
      signatures: ['aa'],
    });
  });

  it('splits each part on its first = only, as the providers did', () => {
    expect(parseTimestampedSignatureHeader('t=1,v1=aa=bb').signatures).toEqual(['aa']);
  });

  it('reads another scheme when asked', () => {
    expect(parseTimestampedSignatureHeader('t=1,v1=aa,v2=bb', 'v2').signatures).toEqual(['bb']);
  });
});

describe('verifyTimestampedHmac', () => {
  const header = (t: number, ...signatures: string[]) =>
    [`t=${t.toString()}`, ...signatures.map((s) => `v1=${s}`)].join(',');

  it('accepts a matching hex signature and returns its timestamp', async () => {
    expect(
      await verifyTimestampedHmac(PAYLOAD, header(NOW, sign(NOW)), SECRET, { now: NOW })
    ).toEqual({
      valid: true,
      timestamp: NOW,
    });
  });

  it('accepts the header when any listed signature matches', async () => {
    const result = await verifyTimestampedHmac(
      PAYLOAD,
      header(NOW, 'deadbeef', sign(NOW)),
      SECRET,
      { now: NOW }
    );
    expect(result.valid).toBe(true);
  });

  it('rejects a signature made with another secret or over another payload', async () => {
    for (const signature of [sign(NOW, PAYLOAD, 'other'), sign(NOW, `${PAYLOAD} `)]) {
      expect(
        await verifyTimestampedHmac(PAYLOAD, header(NOW, signature), SECRET, { now: NOW })
      ).toEqual({ valid: false, reason: 'signature-mismatch' });
    }
  });

  it('rejects a signature of the wrong length (truncated or extended)', async () => {
    const good = sign(NOW);
    for (const signature of [good.slice(0, -2), `${good}00`]) {
      expect(
        await verifyTimestampedHmac(PAYLOAD, header(NOW, signature), SECRET, { now: NOW })
      ).toEqual({ valid: false, reason: 'signature-mismatch' });
    }
  });

  it('compares hex case-sensitively, as the providers did', async () => {
    const result = await verifyTimestampedHmac(
      PAYLOAD,
      header(NOW, sign(NOW).toUpperCase()),
      SECRET,
      { now: NOW }
    );
    expect(result).toEqual({ valid: false, reason: 'signature-mismatch' });
  });

  it('signs over the parsed timestamp, so a zero-padded t still verifies', async () => {
    const result = await verifyTimestampedHmac(
      PAYLOAD,
      `t=0${NOW.toString()},v1=${sign(NOW)}`,
      SECRET,
      { now: NOW }
    );
    expect(result.valid).toBe(true);
  });

  it.each([
    ['an empty header', ''],
    ['no timestamp', `v1=${sign(NOW)}`],
    ['a non-numeric timestamp', `t=soon,v1=${sign(NOW)}`],
    ['no v1 signature', `t=${NOW.toString()}`],
    ['an empty v1 value', `t=${NOW.toString()},v1=`],
  ])('reports %s as a malformed header', async (_, value) => {
    expect(await verifyTimestampedHmac(PAYLOAD, value, SECRET, { now: NOW })).toEqual({
      valid: false,
      reason: 'malformed-header',
    });
  });

  it('verifies an empty payload', async () => {
    const result = await verifyTimestampedHmac('', header(NOW, sign(NOW, '')), SECRET, {
      now: NOW,
    });
    expect(result.valid).toBe(true);
  });

  describe('tolerance window', () => {
    const at = (t: number, options: { tolerance?: number } = {}) =>
      verifyTimestampedHmac(PAYLOAD, header(t, sign(t)), SECRET, { now: NOW, ...options });

    it('defaults to 300 seconds either side, inclusive', async () => {
      expect((await at(NOW - 300)).valid).toBe(true);
      expect((await at(NOW + 300)).valid).toBe(true);
      expect(await at(NOW - 301)).toEqual({ valid: false, reason: 'timestamp-outside-tolerance' });
      expect(await at(NOW + 301)).toEqual({ valid: false, reason: 'timestamp-outside-tolerance' });
    });

    it('uses a custom tolerance', async () => {
      expect((await at(NOW - 10, { tolerance: 10 })).valid).toBe(true);
      expect((await at(NOW - 11, { tolerance: 10 })).valid).toBe(false);
    });

    it('is off for a zero or negative tolerance', async () => {
      expect((await at(NOW - 10_000_000, { tolerance: 0 })).valid).toBe(true);
      expect((await at(NOW - 10_000_000, { tolerance: -1 })).valid).toBe(true);
    });

    it('coerces the tolerance and clock, and fails closed on NaN', async () => {
      const outside = { valid: false, reason: 'timestamp-outside-tolerance' };
      const signed = header(NOW - 10_000, sign(NOW - 10_000));
      const loose = verifyTimestampedHmac as (
        ...args: [string, string, string, Record<string, unknown>]
      ) => ReturnType<typeof verifyTimestampedHmac>;
      for (const options of [
        { now: NOW, tolerance: Number.NaN },
        { now: NOW, tolerance: 'x' },
        { now: Number.NaN },
        { now: 'x' },
        { now: Number.POSITIVE_INFINITY },
      ]) {
        expect(await loose(PAYLOAD, signed, SECRET, options), JSON.stringify(options)).toEqual(
          outside
        );
      }
      // Numeric strings coerce, as the providers' old comparisons did.
      const fresh = header(NOW - 10, sign(NOW - 10));
      expect((await loose(PAYLOAD, fresh, SECRET, { now: NOW, tolerance: '600' })).valid).toBe(
        true
      );
      expect(
        (await loose(PAYLOAD, fresh, SECRET, { now: String(NOW), tolerance: '5' })).valid
      ).toBe(false);
      expect((await loose(PAYLOAD, signed, SECRET, { now: NOW, tolerance: '0' })).valid).toBe(true);
      // A fresh timestamp too: the check must not be skipped either way.
      expect(
        await verifyTimestampedHmac(PAYLOAD, header(NOW, sign(NOW)), SECRET, { now: Number.NaN })
      ).toEqual(outside);
    });

    it('treats an infinite tolerance as accepting any timestamp', async () => {
      expect((await at(NOW - 10_000_000, { tolerance: Number.POSITIVE_INFINITY })).valid).toBe(
        true
      );
    });

    it('checks the signature before the timestamp', async () => {
      const result = await verifyTimestampedHmac(
        PAYLOAD,
        header(NOW - 10_000, 'deadbeef'),
        SECRET,
        { now: NOW }
      );
      expect(result).toEqual({ valid: false, reason: 'signature-mismatch' });
    });

    it('reads the system clock when now is not given', async () => {
      const t = Math.floor(Date.now() / 1000);
      expect((await verifyTimestampedHmac(PAYLOAD, header(t, sign(t)), SECRET)).valid).toBe(true);
      const old = t - 3600;
      expect(await verifyTimestampedHmac(PAYLOAD, header(old, sign(old)), SECRET)).toEqual({
        valid: false,
        reason: 'timestamp-outside-tolerance',
      });
    });
  });

  it('rejects an empty secret, as hmacSha256 does', async () => {
    await expect(verifyTimestampedHmac(PAYLOAD, header(NOW, 'aa'), '')).rejects.toThrow();
  });
});
