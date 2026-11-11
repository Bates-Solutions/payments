[**@bates-solutions/stripe API Reference v2.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [core](../README.md) / SetupIntentsService

# Class: SetupIntentsService

Defined in: [core/services/setup-intents.service.ts:81](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L81)

SetupIntents service wrapping Stripe
[SetupIntents](https://docs.stripe.com/api/setup_intents): save a payment
method for later without charging it now.

Typical flow: create a SetupIntent on the server, pass its `client_secret`
to Stripe.js to collect and confirm the card, then charge the saved payment
method off-session later with `payments.create`.

## Example

```typescript
const intent = await stripe.setupIntents.create({ customerId: 'cus_123' });
return { clientSecret: intent.client_secret };
```

## Constructors

### Constructor

> **new SetupIntentsService**(`client`): `SetupIntentsService`

Defined in: [core/services/setup-intents.service.ts:82](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L82)

#### Parameters

##### client

`Stripe`

#### Returns

`SetupIntentsService`

## Methods

### cancel()

> **cancel**(`setupIntentId`, `options?`): `Promise`\<`SetupIntent`\>

Defined in: [core/services/setup-intents.service.ts:162](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L162)

Cancel a SetupIntent that hasn't succeeded.

#### Parameters

##### setupIntentId

`string`

##### options?

###### idempotencyKey?

`string`

###### reason?

`CancellationReason`

#### Returns

`Promise`\<`SetupIntent`\>

#### Throws

When `setupIntentId` is missing

***

### confirm()

> **confirm**(`setupIntentId`, `options?`): `Promise`\<`SetupIntent`\>

Defined in: [core/services/setup-intents.service.ts:141](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L141)

Confirm a SetupIntent on the server (usually Stripe.js confirms it in the
browser instead).

#### Parameters

##### setupIntentId

`string`

##### options?

###### idempotencyKey?

`string`

###### paymentMethod?

`string`

###### returnUrl?

`string`

#### Returns

`Promise`\<`SetupIntent`\>

#### Throws

When `setupIntentId` is missing

***

### create()

> **create**(`options?`): `Promise`\<`SetupIntent`\>

Defined in: [core/services/setup-intents.service.ts:90](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L90)

Create a SetupIntent.

#### Parameters

##### options?

[`CreateSetupIntentOptions`](../interfaces/CreateSetupIntentOptions.md)

#### Returns

`Promise`\<`SetupIntent`\>

#### Throws

When `confirm` is set without `paymentMethod`,
  or `returnUrl` is set without `confirm`

***

### get()

> **get**(`setupIntentId`): `Promise`\<`SetupIntent`\>

Defined in: [core/services/setup-intents.service.ts:126](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L126)

Retrieve a SetupIntent by ID.

#### Parameters

##### setupIntentId

`string`

#### Returns

`Promise`\<`SetupIntent`\>

#### Throws

When `setupIntentId` is missing

***

### list()

> **list**(`options?`): `Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`SetupIntent`\>\>

Defined in: [core/services/setup-intents.service.ts:184](https://github.com/Bates-Solutions/stripe/blob/287dd161f87c25c2829a16a655e574c4defe6fe7/src/core/services/setup-intents.service.ts#L184)

List SetupIntents with cursor-based pagination.

#### Parameters

##### options?

[`ListSetupIntentsOptions`](../interfaces/ListSetupIntentsOptions.md)

#### Returns

`Promise`\<[`PaginatedResponse`](../interfaces/PaginatedResponse.md)\<`SetupIntent`\>\>
