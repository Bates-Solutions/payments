import { describe, it, expect, vi } from 'vitest';
import type Stripe from 'stripe';
import { PaymentMethodsService } from '../services/payment-methods.service.js';
import { SetupIntentsService } from '../services/setup-intents.service.js';
import { StripeApiError, StripeValidationError } from '../errors.js';
import { createStripeClient } from '../client.js';

const apiError = { type: 'invalid_request_error', statusCode: 404 };

function stripeWith(resources: Record<string, unknown>): Stripe {
  return resources as unknown as Stripe;
}

describe('PaymentMethodsService', () => {
  it('retrieves a payment method', async () => {
    const retrieve = vi.fn().mockResolvedValue({ id: 'pm_1' });
    const service = new PaymentMethodsService(stripeWith({ paymentMethods: { retrieve } }));
    expect((await service.get('pm_1')).id).toBe('pm_1');
    expect(retrieve).toHaveBeenCalledWith('pm_1');
  });

  it("lists a customer's cards with a cursor", async () => {
    const list = vi
      .fn()
      .mockResolvedValue({ data: [{ id: 'pm_1' }, { id: 'pm_2' }], has_more: true });
    const service = new PaymentMethodsService(stripeWith({ paymentMethods: { list } }));

    const result = await service.list({
      customerId: 'cus_1',
      type: 'card',
      limit: 2,
      startingAfter: 'pm_0',
    });

    expect(result).toEqual({
      data: [{ id: 'pm_1' }, { id: 'pm_2' }],
      hasMore: true,
      nextCursor: 'pm_2',
    });
    expect(list).toHaveBeenCalledWith({
      customer: 'cus_1',
      type: 'card',
      limit: 2,
      starting_after: 'pm_0',
    });
  });

  it('returns no cursor on the last page', async () => {
    const list = vi.fn().mockResolvedValue({ data: [{ id: 'pm_1' }], has_more: false });
    const result = await new PaymentMethodsService(stripeWith({ paymentMethods: { list } })).list();
    expect(result.nextCursor).toBeUndefined();
  });

  it('attaches to a customer with an idempotency key', async () => {
    const attach = vi.fn().mockResolvedValue({ id: 'pm_1', customer: 'cus_1' });
    const service = new PaymentMethodsService(stripeWith({ paymentMethods: { attach } }));

    await service.attach('pm_1', { customerId: 'cus_1' });
    await service.attach('pm_1', { customerId: 'cus_1', idempotencyKey: 'k1' });

    expect(attach).toHaveBeenNthCalledWith(
      1,
      'pm_1',
      { customer: 'cus_1' },
      {
        idempotencyKey: expect.any(String),
      }
    );
    expect(attach).toHaveBeenNthCalledWith(
      2,
      'pm_1',
      { customer: 'cus_1' },
      { idempotencyKey: 'k1' }
    );
  });

  it('detaches a payment method', async () => {
    const detach = vi.fn().mockResolvedValue({ id: 'pm_1', customer: null });
    const service = new PaymentMethodsService(stripeWith({ paymentMethods: { detach } }));
    await service.detach('pm_1', { idempotencyKey: 'd1' });
    expect(detach).toHaveBeenCalledWith('pm_1', {}, { idempotencyKey: 'd1' });
  });

  it('sets the customer default for invoices and subscriptions', async () => {
    const update = vi.fn().mockResolvedValue({ id: 'cus_1' });
    const service = new PaymentMethodsService(stripeWith({ customers: { update } }));
    await service.setDefault('cus_1', 'pm_1');
    expect(update).toHaveBeenCalledWith(
      'cus_1',
      { invoice_settings: { default_payment_method: 'pm_1' } },
      { idempotencyKey: expect.any(String) }
    );
  });

  it('validates ids before calling Stripe', async () => {
    const resources = {
      paymentMethods: { retrieve: vi.fn(), attach: vi.fn(), detach: vi.fn() },
      customers: { update: vi.fn() },
    };
    const service = new PaymentMethodsService(stripeWith(resources));

    await expect(service.get('')).rejects.toMatchObject({ field: 'paymentMethodId' });
    await expect(service.attach('', { customerId: 'cus_1' })).rejects.toMatchObject({
      field: 'paymentMethodId',
    });
    await expect(service.attach('pm_1', { customerId: '' })).rejects.toMatchObject({
      field: 'customerId',
    });
    await expect(service.detach('')).rejects.toThrow(StripeValidationError);
    await expect(service.setDefault('', 'pm_1')).rejects.toMatchObject({ field: 'customerId' });
    await expect(service.setDefault('cus_1', '')).rejects.toMatchObject({
      field: 'paymentMethodId',
    });
    for (const fn of [
      resources.paymentMethods.retrieve,
      resources.paymentMethods.attach,
      resources.paymentMethods.detach,
      resources.customers.update,
    ]) {
      expect(fn).not.toHaveBeenCalled();
    }
  });

  it('normalizes API errors', async () => {
    const reject = () => vi.fn().mockRejectedValue(apiError);
    const service = new PaymentMethodsService(
      stripeWith({
        paymentMethods: { retrieve: reject(), list: reject(), attach: reject(), detach: reject() },
        customers: { update: reject() },
      })
    );
    await expect(service.get('pm_1')).rejects.toThrow(StripeApiError);
    await expect(service.list()).rejects.toThrow(StripeApiError);
    await expect(service.attach('pm_1', { customerId: 'cus_1' })).rejects.toThrow(StripeApiError);
    await expect(service.detach('pm_1')).rejects.toThrow(StripeApiError);
    await expect(service.setDefault('cus_1', 'pm_1')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('SetupIntentsService', () => {
  it('creates an off-session SetupIntent with automatic payment methods by default', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'seti_1', client_secret: 'seti_1_secret' });
    const service = new SetupIntentsService(stripeWith({ setupIntents: { create } }));

    const intent = await service.create({ customerId: 'cus_1', metadata: { plan: 'pro' } });

    expect(intent.client_secret).toBe('seti_1_secret');
    expect(create).toHaveBeenCalledWith(
      {
        customer: 'cus_1',
        usage: 'off_session',
        payment_method_types: undefined,
        automatic_payment_methods: { enabled: true },
        payment_method: undefined,
        confirm: undefined,
        return_url: undefined,
        description: undefined,
        metadata: { plan: 'pro' },
      },
      { idempotencyKey: expect.any(String) }
    );
  });

  it('uses explicit payment method types instead of automatic ones', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'seti_1' });
    const service = new SetupIntentsService(stripeWith({ setupIntents: { create } }));

    await service.create({
      paymentMethodTypes: ['card'],
      usage: 'on_session',
      paymentMethod: 'pm_1',
      confirm: true,
      returnUrl: 'https://app.example.com/done',
      description: 'Save card',
      idempotencyKey: 'k1',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        usage: 'on_session',
        payment_method_types: ['card'],
        automatic_payment_methods: undefined,
        payment_method: 'pm_1',
        confirm: true,
        return_url: 'https://app.example.com/done',
        description: 'Save card',
      }),
      { idempotencyKey: 'k1' }
    );
  });

  it('works with no options', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'seti_1' });
    await new SetupIntentsService(stripeWith({ setupIntents: { create } })).create();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        usage: 'off_session',
        automatic_payment_methods: { enabled: true },
      }),
      { idempotencyKey: expect.any(String) }
    );
  });

  it('requires a payment method to confirm on create', async () => {
    const create = vi.fn();
    const service = new SetupIntentsService(stripeWith({ setupIntents: { create } }));
    await expect(service.create({ confirm: true })).rejects.toMatchObject({
      field: 'paymentMethod',
    });
    expect(create).not.toHaveBeenCalled();
  });

  it('retrieves, confirms and cancels', async () => {
    const retrieve = vi.fn().mockResolvedValue({ id: 'seti_1' });
    const confirm = vi.fn().mockResolvedValue({ id: 'seti_1', status: 'succeeded' });
    const cancel = vi.fn().mockResolvedValue({ id: 'seti_1', status: 'canceled' });
    const service = new SetupIntentsService(
      stripeWith({ setupIntents: { retrieve, confirm, cancel } })
    );

    await service.get('seti_1');
    await service.confirm('seti_1', {
      paymentMethod: 'pm_1',
      returnUrl: 'https://a/b',
      idempotencyKey: 'c1',
    });
    await service.cancel('seti_1', { reason: 'abandoned', idempotencyKey: 'x1' });

    expect(retrieve).toHaveBeenCalledWith('seti_1');
    expect(confirm).toHaveBeenCalledWith(
      'seti_1',
      { payment_method: 'pm_1', return_url: 'https://a/b' },
      { idempotencyKey: 'c1' }
    );
    expect(cancel).toHaveBeenCalledWith(
      'seti_1',
      { cancellation_reason: 'abandoned' },
      { idempotencyKey: 'x1' }
    );
  });

  it('lists with a cursor', async () => {
    const list = vi.fn().mockResolvedValue({ data: [{ id: 'seti_1' }], has_more: true });
    const service = new SetupIntentsService(stripeWith({ setupIntents: { list } }));
    const result = await service.list({ customerId: 'cus_1', paymentMethodId: 'pm_1', limit: 1 });
    expect(result.nextCursor).toBe('seti_1');
    expect(list).toHaveBeenCalledWith({
      customer: 'cus_1',
      payment_method: 'pm_1',
      limit: 1,
      starting_after: undefined,
    });
  });

  it('validates ids before calling Stripe', async () => {
    const setupIntents = { retrieve: vi.fn(), confirm: vi.fn(), cancel: vi.fn() };
    const service = new SetupIntentsService(stripeWith({ setupIntents }));
    await expect(service.get('')).rejects.toMatchObject({ field: 'setupIntentId' });
    await expect(service.confirm('')).rejects.toMatchObject({ field: 'setupIntentId' });
    await expect(service.cancel('')).rejects.toMatchObject({ field: 'setupIntentId' });
    expect(setupIntents.retrieve).not.toHaveBeenCalled();
    expect(setupIntents.confirm).not.toHaveBeenCalled();
    expect(setupIntents.cancel).not.toHaveBeenCalled();
  });

  it('normalizes API errors', async () => {
    const reject = () => vi.fn().mockRejectedValue(apiError);
    const service = new SetupIntentsService(
      stripeWith({
        setupIntents: {
          create: reject(),
          retrieve: reject(),
          confirm: reject(),
          cancel: reject(),
          list: reject(),
        },
      })
    );
    await expect(service.create()).rejects.toThrow(StripeApiError);
    await expect(service.get('seti_1')).rejects.toThrow(StripeApiError);
    await expect(service.confirm('seti_1')).rejects.toThrow(StripeApiError);
    await expect(service.cancel('seti_1')).rejects.toThrow(StripeApiError);
    await expect(service.list()).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('client wiring', () => {
  it('exposes paymentMethods and setupIntents', () => {
    const client = createStripeClient({ apiKey: 'sk_test_1' });
    expect(client.paymentMethods).toBeInstanceOf(PaymentMethodsService);
    expect(client.setupIntents).toBeInstanceOf(SetupIntentsService);
  });
});
