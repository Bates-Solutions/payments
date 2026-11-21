/**
 * Compile-only guard: money-moving calls must not compile without an
 * `idempotencyKey`. A random default would make a retry after a timeout charge
 * twice, so the key is required in the option types. Each `@ts-expect-error`
 * fails `tsc` if the key ever becomes optional again.
 *
 * Type-checked via `tsconfig.type-tests.json` (wired into `npm run
 * typecheck`); never built or run.
 */
import type { SquareClient } from '../client.js';
import type {
  CreateCardOptions,
  CreatePaymentOptions,
  RefundPaymentOptions,
} from '../types/index.js';
import type { CreateSubscriptionOptions } from '../services/subscriptions.service.js';

declare const square: SquareClient;

// @ts-expect-error idempotencyKey is required
void square.payments.create({ sourceId: 'cnon:ok', amount: 100 });
void square.payments.create({ sourceId: 'cnon:ok', amount: 100, idempotencyKey: 'k' });

// @ts-expect-error idempotencyKey is required
void square.subscriptions.create({ customerId: 'C', planVariationId: 'P' });
void square.subscriptions.create({ customerId: 'C', planVariationId: 'P', idempotencyKey: 'k' });

// @ts-expect-error idempotencyKey is required
void square.cards.create({ sourceId: 'cnon:ok', customerId: 'C' });
void square.cards.create({ sourceId: 'cnon:ok', customerId: 'C', idempotencyKey: 'k' });

// @ts-expect-error idempotencyKey is required
void square.refunds.refundPayment({ paymentId: 'P', amountMoney: { amount: 100 } });
void square.refunds.refundPayment({
  paymentId: 'P',
  amountMoney: { amount: 100 },
  idempotencyKey: 'k',
});

// The option types themselves carry the requirement.
type RequiresKey<T> = T extends { idempotencyKey: string } ? true : false;
export type _Guard = [
  RequiresKey<CreatePaymentOptions>,
  RequiresKey<CreateSubscriptionOptions>,
  RequiresKey<CreateCardOptions>,
  RequiresKey<RefundPaymentOptions>,
] extends [true, true, true, true]
  ? true
  : never;
const guard: _Guard = true;
void guard;
