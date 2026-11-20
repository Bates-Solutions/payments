import { describe, it, expect, vi } from 'vitest';
import type { SquareClient as SdkClient } from 'square';
import { SquareClient } from '../client.js';
import { SquareValidationError } from '../errors.js';

/**
 * Money-moving calls take no default idempotency key: a random default would
 * make a retry after a timeout charge twice. A missing key is a type error
 * (see `__type-tests__/idempotency.type-test.ts`) and, for untyped callers, a
 * SquareValidationError before any request is sent.
 */
function createClient(): { square: SquareClient; sdk: SdkClient } {
  const square = new SquareClient({ accessToken: 'token', locationId: 'LOC' });
  const sdk = square.sdk;
  for (const resource of ['payments', 'subscriptions', 'cards', 'refunds'] as const) {
    vi.spyOn(sdk[resource], resource === 'refunds' ? 'refundPayment' : 'create').mockResolvedValue(
      {} as never
    );
  }
  return { square, sdk };
}

type Call = (square: SquareClient, idempotencyKey: string | undefined) => Promise<unknown>;

// Each call spreads the key in through an untyped object, as a JavaScript
// caller would.
const cases: Array<[string, Call, (sdk: SdkClient) => unknown]> = [
  [
    'payments.create',
    (s, idempotencyKey) =>
      s.payments.create({ sourceId: 'cnon:ok', amount: 100, ...({ idempotencyKey } as never) }),
    (sdk) => sdk.payments.create,
  ],
  [
    'subscriptions.create',
    (s, idempotencyKey) =>
      s.subscriptions.create({
        customerId: 'C',
        planVariationId: 'P',
        ...({ idempotencyKey } as never),
      }),
    (sdk) => sdk.subscriptions.create,
  ],
  [
    'cards.create',
    (s, idempotencyKey) =>
      s.cards.create({ sourceId: 'cnon:ok', customerId: 'C', ...({ idempotencyKey } as never) }),
    (sdk) => sdk.cards.create,
  ],
  [
    'refunds.refundPayment',
    (s, idempotencyKey) =>
      s.refunds.refundPayment({
        paymentId: 'P',
        amountMoney: { amount: 100 },
        ...({ idempotencyKey } as never),
      }),
    (sdk) => sdk.refunds.refundPayment,
  ],
];

describe('money-moving calls require an idempotencyKey', () => {
  it.each(cases)('%s throws without one and sends nothing', async (_name, call, sdkMethod) => {
    for (const key of [undefined, '']) {
      const { square, sdk } = createClient();

      const error: unknown = await call(square, key).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(SquareValidationError);
      expect((error as SquareValidationError).field).toBe('idempotencyKey');
      expect((error as SquareValidationError).message).toBe('idempotencyKey is required');
      expect(sdkMethod(sdk)).not.toHaveBeenCalled();
    }
  });

  it.each(cases)('%s sends the caller key unchanged', async (_name, call, sdkMethod) => {
    const { square, sdk } = createClient();

    // The mocks return no entity, so the call fails after the request is sent.
    await call(square, 'caller-key').catch(() => undefined);

    expect(sdkMethod(sdk)).toHaveBeenCalledWith(
      expect.objectContaining({ idempotencyKey: 'caller-key' })
    );
  });
});
