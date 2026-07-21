[**@bates-solutions/stripe API Reference v0.0.0**](../../README.md)

***

[@bates-solutions/stripe API Reference](../../README.md) / [server](../README.md) / ExpressWebhookOptions

# Interface: ExpressWebhookOptions

<<<<<<< HEAD
Defined in: [server/middleware/express.ts:18](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/express.ts#L18)
=======
Defined in: [server/middleware/express.ts:18](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L18)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Options for the Express webhook middleware.

## Extends

- [`WebhookConfig`](WebhookConfig.md)

## Properties

### autoRespond?

> `optional` **autoRespond?**: `boolean`

<<<<<<< HEAD
Defined in: [server/middleware/express.ts:23](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/middleware/express.ts#L23)
=======
Defined in: [server/middleware/express.ts:23](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/middleware/express.ts#L23)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Whether to send the response automatically.

#### Default

```ts
true
```

***

### handlers

> **handlers**: [`WebhookHandlers`](../type-aliases/WebhookHandlers.md)

<<<<<<< HEAD
Defined in: [server/types.ts:60](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L60)
=======
Defined in: [server/types.ts:60](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L60)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Event handlers by type

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`handlers`](WebhookConfig.md#handlers)

***

### signingSecret

> **signingSecret**: `string`

<<<<<<< HEAD
Defined in: [server/types.ts:58](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L58)
=======
Defined in: [server/types.ts:58](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L58)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Stripe webhook signing secret (`whsec_…`)

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`signingSecret`](WebhookConfig.md#signingsecret)

***

### throwOnInvalidSignature?

> `optional` **throwOnInvalidSignature?**: `boolean`

<<<<<<< HEAD
Defined in: [server/types.ts:65](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L65)
=======
Defined in: [server/types.ts:65](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L65)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Whether to treat a signature verification failure as an error.

#### Default

```ts
true
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`throwOnInvalidSignature`](WebhookConfig.md#throwoninvalidsignature)

***

### tolerance?

> `optional` **tolerance?**: `number`

<<<<<<< HEAD
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/bb852372e9af16a3818fd582f3276389107ca62a/src/server/types.ts#L50)
=======
Defined in: [server/types.ts:50](https://github.com/mbates/stripe/blob/4dd39275a724934e08ccfff30903ed5eef5cc58d/src/server/types.ts#L50)
>>>>>>> feat/edge-webhook-and-subscription-helpers

Maximum allowed difference (seconds) between the signature timestamp and
now. Set to `0` to disable the timestamp check.

#### Default

```ts
300
```

#### Inherited from

[`WebhookConfig`](WebhookConfig.md).[`tolerance`](WebhookConfig.md#tolerance)
