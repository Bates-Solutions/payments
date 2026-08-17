[**@bates-solutions/squareup API Reference v1.14.2**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [core](../README.md) / CreateWebhookSubscriptionOptions

# Interface: CreateWebhookSubscriptionOptions

Defined in: core/services/webhook-subscriptions.service.ts:31

Options for creating a webhook subscription.

## Properties

### apiVersion?

> `optional` **apiVersion?**: `string`

Defined in: core/services/webhook-subscriptions.service.ts:39

Square API version used to serialize events (defaults to the app's version)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: core/services/webhook-subscriptions.service.ts:41

Whether the subscription is enabled (default `true`)

***

### eventTypes

> **eventTypes**: `string`[]

Defined in: core/services/webhook-subscriptions.service.ts:35

Event types to subscribe to, e.g. `['payment.updated', 'order.updated']`

***

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Defined in: core/services/webhook-subscriptions.service.ts:42

***

### name

> **name**: `string`

Defined in: core/services/webhook-subscriptions.service.ts:33

A name for the subscription

***

### notificationUrl

> **notificationUrl**: `string`

Defined in: core/services/webhook-subscriptions.service.ts:37

The URL Square will POST events to
