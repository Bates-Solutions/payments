# Square API Reference

## Payment Processing APIs
- **Payments API**: Core payment processing for card transactions
- **Terminal API**: Process payments on Square hardware terminals
- **Mobile Payments SDK**: In-app payment collection for mobile devices
- **Web Payments SDK**: Browser-based payment forms
- **Cards API**: Manage saved payment methods and cards on file
- **Refunds API**: Handle payment reversals and refund processing
- **Disputes API**: Process chargebacks and payment disputes

## Commerce & Order Management
- **Orders API**: Create and manage customer orders
- **Catalog API**: Design and maintain product catalogs
- **Inventory API**: Track stock levels and manage inventory
- **Transfer Orders API**: Manage inventory transfers between locations
- **Bookings API**: Handle appointment scheduling

## Customer Management
- **Customers API**: Maintain customer profiles and records
- **Loyalty API**: Build and manage loyalty reward programs
- **Gift Cards API**: Sell, reload, and track gift card transactions
- **Customer Groups & Segments APIs**: Organize customers for targeted engagement

## Staff & Operations
- **Team API**: Manage team members and staff
- **Labor API**: Track timecards, shifts, and scheduling

## Business Infrastructure
- **Merchants API**: Access merchant account information
- **Locations API**: Manage multiple business locations
- **Invoices API**: Create and distribute customer invoices
- **Subscriptions API**: Enable recurring billing models
- **Bank Accounts API**: Access banking information

---

## Authentication

Square uses two credential models:

1. **Personal Access Tokens**: Unrestricted API access to resources in your own Square account. Suitable for single-merchant apps.

2. **OAuth Access Tokens**: Authenticated and scoped API access. Required for multi-tenant applications serving multiple sellers.

### Environments
- **Production**: `https://connect.squareup.com/v2`
- **Sandbox**: `https://connect.squareupsandbox.com/v2`

---

## Webhooks

Square webhooks enable real-time event notifications. Key events include:
- `payment.completed`, `payment.updated`
- `order.created`, `order.updated`, `order.fulfillment.updated`
- `customer.created`, `customer.updated`
- `invoice.payment_made`
- `subscription.created`, `subscription.updated`

### Webhook Requirements
- HTTPS endpoint
- Respond with 2xx status quickly
- Handle idempotency (events may be sent multiple times)
- Implement signature verification
