# React Hooks

This guide covers all available React hooks in `@bates-solutions/squareup`.

## Prerequisites

- [React Setup](./setup.md) complete with `SquareProvider` configured

## Available Hooks

| Hook | Purpose |
|------|---------|
| `useSquare` | Access Square SDK context |
| `useSquarePayment` | Card input and tokenization |
| `usePayments` | Payment creation via API |
| `useOrders` | Order management via API |
| `useCustomers` | Customer management via API |
| `useCatalog` | Catalog queries via API |

## useSquare

Access the Square SDK context and loading state.

```tsx
import { useSquare } from '@bates-solutions/squareup/react';

function CheckoutStatus() {
  const { sdkLoaded, payments, error, config } = useSquare();

  if (error) return <div>Error: {error.message}</div>;
  if (!sdkLoaded) return <div>Loading...</div>;

  return <div>Ready! Location: {config.locationId}</div>;
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `sdkLoaded` | `boolean` | SDK loaded and ready |
| `payments` | `Payments \| null` | Square Payments SDK instance |
| `error` | `Error \| null` | Loading error, if any |
| `config` | `SquareProviderConfig` | Current configuration |

## useSquarePayment

The primary hook for card tokenization. Creates a secure card input field and handles tokenization.

```tsx
import { useSquarePayment } from '@bates-solutions/squareup/react';

function CardForm() {
  const { cardRef, tokenize, ready, loading, error } = useSquarePayment({
    onReady: () => console.log('Card input ready'),
    onTokenize: (token) => console.log('Token:', token),
    onError: (err) => console.error('Error:', err),
  });

  const handleSubmit = async () => {
    try {
      const token = await tokenize();
      // Send token to your server
      await fetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify({ sourceId: token, amount: 1000 }),
      });
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <div ref={cardRef} style={{ minHeight: '50px' }} />
      <button onClick={handleSubmit} disabled={!ready || loading}>
        {loading ? 'Processing...' : 'Pay $10.00'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}
```

### Options

```tsx
useSquarePayment({
  cardOptions: {
    style: {
      input: {
        fontSize: '16px',
        color: '#333',
      },
      '.input-container': {
        borderColor: '#ccc',
        borderRadius: '4px',
      },
    },
  },
  onReady: () => { /* Card input mounted */ },
  onTokenize: (token) => { /* Token generated */ },
  onError: (error) => { /* Error occurred */ },
});
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `cardRef` | `RefCallback<HTMLDivElement>` | Attach to container element |
| `tokenize` | `() => Promise<string>` | Get payment token |
| `card` | `Card \| null` | Card instance |
| `ready` | `boolean` | Card input ready for tokenization |
| `loading` | `boolean` | Tokenization in progress |
| `error` | `Error \| null` | Current error |

## usePayments

Create payments through your backend API.

```tsx
import { useSquarePayment, usePayments } from '@bates-solutions/squareup/react';

function Checkout() {
  const { cardRef, tokenize, ready } = useSquarePayment();
  const { create: createPayment, loading, error, data } = usePayments({
    apiEndpoint: '/api/payments', // Default
    onSuccess: (payment) => {
      console.log('Payment successful:', payment.id);
      // Redirect to confirmation page
    },
    onError: (err) => {
      console.error('Payment failed:', err);
    },
  });

  const handlePay = async () => {
    const token = await tokenize();
    await createPayment({
      sourceId: token,
      amount: 2500, // $25.00 in cents
      currency: 'USD',
      customerId: 'CUST_123', // Optional
      note: 'Order #1234', // Optional
    });
  };

  return (
    <div>
      <div ref={cardRef} />
      <button onClick={handlePay} disabled={!ready || loading}>
        Pay $25.00
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Payment ID: {data.id}</p>}
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `create` | `(input) => Promise<PaymentResponse>` | Create payment |
| `reset` | `() => void` | Reset state |
| `data` | `PaymentResponse \| null` | Last successful payment |
| `loading` | `boolean` | Request in progress |
| `error` | `Error \| null` | Last error |

## useOrders

Manage orders through your backend API.

```tsx
import { useOrders } from '@bates-solutions/squareup/react';

function OrderForm() {
  const { create: createOrder, get, loading, error, data } = useOrders({
    apiEndpoint: '/api/orders',
    onSuccess: (order) => console.log('Order:', order.id),
  });

  const handleCreateOrder = async () => {
    const order = await createOrder({
      lineItems: [
        { name: 'Latte', amount: 450, quantity: 2 },
        { name: 'Croissant', amount: 350 },
        { catalogObjectId: 'ITEM_VARIATION_ID', quantity: 1 },
      ],
      customerId: 'CUST_123',
      referenceId: 'my-order-ref',
      paymentToken: 'cnon:card-nonce', // Optional: pay immediately
    });

    console.log('Total:', order.totalMoney?.amount);
  };

  const handleGetOrder = async (orderId: string) => {
    const order = await get(orderId);
    console.log('Order status:', order.status);
  };

  return (
    <div>
      <button onClick={handleCreateOrder} disabled={loading}>
        Create Order
      </button>
      {data && (
        <div>
          <p>Order: {data.id}</p>
          <p>Total: ${(data.totalMoney?.amount ?? 0) / 100}</p>
        </div>
      )}
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `create` | `(input) => Promise<OrderResponse>` | Create order |
| `get` | `(orderId) => Promise<OrderResponse>` | Get order by ID |
| `reset` | `() => void` | Reset state |
| `data` | `OrderResponse \| null` | Last order data |
| `loading` | `boolean` | Request in progress |
| `error` | `Error \| null` | Last error |

## useCustomers

Manage customers through your backend API.

```tsx
import { useCustomers } from '@bates-solutions/squareup/react';

function CustomerManager() {
  const { create, get, update, search, loading, data } = useCustomers({
    apiEndpoint: '/api/customers',
  });

  // Create a customer
  const handleCreate = async () => {
    const customer = await create({
      givenName: 'John',
      familyName: 'Doe',
      emailAddress: 'john@example.com',
      phoneNumber: '+15551234567',
      address: {
        addressLine1: '123 Main St',
        locality: 'San Francisco',
        administrativeDistrictLevel1: 'CA',
        postalCode: '94102',
        country: 'US',
      },
    });
    console.log('Created:', customer.id);
  };

  // Search customers
  const handleSearch = async () => {
    const customers = await search({ email: 'john@example.com' });
    console.log('Found:', customers.length);
  };

  // Update customer
  const handleUpdate = async (customerId: string) => {
    await update(customerId, {
      note: 'VIP customer',
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Customer</button>
      <button onClick={handleSearch}>Search</button>
      {data && <p>Customer: {data.givenName} {data.familyName}</p>}
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `create` | `(input) => Promise<CustomerResponse>` | Create customer |
| `get` | `(customerId) => Promise<CustomerResponse>` | Get by ID |
| `update` | `(customerId, input) => Promise<CustomerResponse>` | Update customer |
| `search` | `(query) => Promise<CustomerResponse[]>` | Search customers |
| `reset` | `() => void` | Reset state |
| `data` | `CustomerResponse \| null` | Last customer data |
| `loading` | `boolean` | Request in progress |
| `error` | `Error \| null` | Last error |

## useCatalog

Query your product catalog through your backend API.

```tsx
import { useCatalog } from '@bates-solutions/squareup/react';

function ProductList() {
  const { data: items, loading, error, search, get, list, refetch } = useCatalog({
    apiEndpoint: '/api/catalog',
    initialOptions: { objectTypes: ['ITEM'], limit: 20 },
    fetchOnMount: true,
    onError: (err) => console.error(err),
  });

  // Search by text
  const handleSearch = async (query: string) => {
    await search({ query, objectTypes: ['ITEM'] });
  };

  // Filter by category
  const handleCategoryFilter = async (categoryId: string) => {
    await search({ categoryIds: [categoryId], objectTypes: ['ITEM'] });
  };

  // Get single item
  const handleGetItem = async (itemId: string) => {
    const item = await get(itemId);
    console.log('Item:', item.name, item.variations);
  };

  // List categories
  const handleListCategories = async () => {
    const categories = await list('CATEGORY');
    console.log('Categories:', categories);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />
      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {item.name}
            {item.variations?.[0]?.price && (
              <span> - ${item.variations[0].price.amount / 100}</span>
            )}
          </li>
        ))}
      </ul>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Options

```tsx
useCatalog({
  apiEndpoint: '/api/catalog',
  initialOptions: {
    objectTypes: ['ITEM', 'CATEGORY'],
    query: 'coffee',
    categoryIds: ['CAT_123'],
    limit: 50,
  },
  fetchOnMount: true,
  onError: (error) => { /* Handle error */ },
});
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `data` | `CatalogItemResponse[] \| null` | Catalog items |
| `loading` | `boolean` | Request in progress |
| `error` | `Error \| null` | Last error |
| `search` | `(options?) => Promise<CatalogItemResponse[]>` | Search catalog |
| `get` | `(objectId) => Promise<CatalogItemResponse>` | Get by ID |
| `list` | `(type, limit?) => Promise<CatalogItemResponse[]>` | List by type |
| `refetch` | `() => Promise<void>` | Refetch with initial options |

## Complete Checkout Example

Combining hooks for a full checkout flow:

```tsx
import {
  useSquarePayment,
  usePayments,
  useOrders,
  useCustomers,
} from '@bates-solutions/squareup/react';

interface CartItem {
  name: string;
  amount: number;
  quantity: number;
}

function Checkout({ cart }: { cart: CartItem[] }) {
  const { cardRef, tokenize, ready } = useSquarePayment();
  const { create: createPayment } = usePayments();
  const { create: createOrder } = useOrders();
  const { create: createCustomer, search: searchCustomers } = useCustomers();

  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ orderId: string; paymentId: string } | null>(null);

  const total = cart.reduce((sum, item) => sum + item.amount * item.quantity, 0);

  const handleCheckout = async () => {
    setProcessing(true);

    try {
      // 1. Find or create customer
      let customerId: string;
      const existing = await searchCustomers({ email });
      if (existing.length > 0) {
        customerId = existing[0].id;
      } else {
        const customer = await createCustomer({ emailAddress: email });
        customerId = customer.id;
      }

      // 2. Tokenize card
      const token = await tokenize();

      // 3. Create order
      const order = await createOrder({
        lineItems: cart.map((item) => ({
          name: item.name,
          amount: item.amount,
          quantity: item.quantity,
        })),
        customerId,
      });

      // 4. Create payment
      const payment = await createPayment({
        sourceId: token,
        amount: total,
        orderId: order.id,
        customerId,
      });

      setResult({ orderId: order.id, paymentId: payment.id });
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div>
        <h2>Thank you!</h2>
        <p>Order: {result.orderId}</p>
        <p>Payment: {result.paymentId}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Checkout</h2>

      <div>
        <h3>Items</h3>
        {cart.map((item, i) => (
          <div key={i}>
            {item.name} x{item.quantity} - ${(item.amount * item.quantity) / 100}
          </div>
        ))}
        <strong>Total: ${total / 100}</strong>
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Card</label>
        <div ref={cardRef} />
      </div>

      <button onClick={handleCheckout} disabled={!ready || processing || !email}>
        {processing ? 'Processing...' : `Pay $${total / 100}`}
      </button>
    </div>
  );
}
```

## Backend API Requirements

The React hooks expect your backend to implement these API endpoints:

| Hook | Method | Endpoint | Description |
|------|--------|----------|-------------|
| `usePayments` | POST | `/api/payments` | Create payment |
| `useOrders` | POST | `/api/orders` | Create order |
| `useOrders` | GET | `/api/orders/:id` | Get order |
| `useCustomers` | POST | `/api/customers` | Create customer |
| `useCustomers` | GET | `/api/customers/:id` | Get customer |
| `useCustomers` | PUT | `/api/customers/:id` | Update customer |
| `useCustomers` | GET | `/api/customers/search` | Search customers |
| `useCatalog` | GET | `/api/catalog` | Search catalog |
| `useCatalog` | GET | `/api/catalog/:id` | Get item |

## Next Steps

- [Components Guide](./components.md) - Pre-built payment components
- [Payments Guide](../core/payments.md) - Backend payment processing
- [Webhooks Guide](../server/webhooks.md) - Handle payment events
