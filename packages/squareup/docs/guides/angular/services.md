# Angular Services

This guide covers all available Angular services in `@bates-solutions/squareup`.

## Prerequisites

- [Angular Setup](./setup.md) complete with `SquareModule` configured

## Available Services

| Service | Purpose |
|---------|---------|
| `SquareSdkService` | SDK loading and initialization |
| `SquarePaymentsService` | Card input and tokenization |
| `SquareOrdersService` | Order management via API |
| `SquareCustomersService` | Customer management via API |
| `SquareCatalogService` | Catalog queries via API |

All services are `providedIn: 'root'` and available application-wide after configuring `SquareModule.forRoot()`.

## SquarePaymentsService

The primary service for card tokenization and payment processing.

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SquarePaymentsService } from '@bates-solutions/squareup/angular';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  template: `
    <div #cardContainer></div>
    <button (click)="pay()" [disabled]="!(ready$ | async) || (loading$ | async)">
      {{ (loading$ | async) ? 'Processing...' : 'Pay $25.00' }}
    </button>
    <div *ngIf="error$ | async as error" class="error">{{ error.message }}</div>
  `,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('cardContainer', { static: true }) cardContainer!: ElementRef;

  ready$ = this.payments.ready$;
  loading$ = this.payments.loading$;
  error$ = this.payments.error$;

  private subscription?: Subscription;

  constructor(private payments: SquarePaymentsService) {}

  ngOnInit() {
    this.payments.attachCard(this.cardContainer.nativeElement).subscribe({
      next: () => console.log('Card attached'),
      error: (err) => console.error('Failed to attach card:', err),
    });
  }

  ngOnDestroy() {
    this.payments.destroyCard();
    this.subscription?.unsubscribe();
  }

  pay() {
    this.subscription = this.payments.tokenize().pipe(
      switchMap((token) =>
        this.payments.createPayment({
          sourceId: token,
          amount: 2500, // $25.00 in cents
        })
      )
    ).subscribe({
      next: (payment) => console.log('Payment successful:', payment),
      error: (err) => console.error('Payment failed:', err),
    });
  }
}
```

### Card Styling

```typescript
ngOnInit() {
  this.payments.attachCard(this.cardContainer.nativeElement, {
    style: {
      input: {
        fontSize: '16px',
        color: '#333',
      },
      '.input-container': {
        borderColor: '#ccc',
        borderRadius: '4px',
      },
      '.input-container.is-focus': {
        borderColor: '#007bff',
      },
      '.input-container.is-error': {
        borderColor: '#dc3545',
      },
    },
  }).subscribe();
}
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `attachCard(element, options?)` | `Observable<void>` | Attach card input to element |
| `destroyCard()` | `void` | Destroy card instance |
| `tokenize()` | `Observable<string>` | Tokenize card input |
| `createPayment(request, endpoint?)` | `Observable<T>` | Create payment via API |

### Observables

| Observable | Type | Description |
|------------|------|-------------|
| `ready$` | `Observable<boolean>` | Card ready for tokenization |
| `loading$` | `Observable<boolean>` | Operation in progress |
| `error$` | `Observable<Error \| null>` | Current error |

## SquareOrdersService

Manage orders through your backend API.

```typescript
import { Component } from '@angular/core';
import { SquareOrdersService } from '@bates-solutions/squareup/angular';

interface Order {
  id: string;
  status: string;
  totalMoney: { amount: number; currency: string };
}

@Component({
  selector: 'app-order-form',
  template: `
    <button (click)="createOrder()" [disabled]="loading$ | async">
      Create Order
    </button>
    <div *ngIf="order">
      Order: {{ order.id }} - {{ order.totalMoney.amount / 100 | currency }}
    </div>
  `,
})
export class OrderFormComponent {
  loading$ = this.orders.loading$;
  order?: Order;

  constructor(private orders: SquareOrdersService) {}

  createOrder() {
    this.orders.create<Order>({
      lineItems: [
        {
          name: 'Latte',
          quantity: '2',
          basePriceMoney: { amount: 450, currency: 'USD' },
        },
        {
          name: 'Croissant',
          quantity: '1',
          basePriceMoney: { amount: 350, currency: 'USD' },
        },
      ],
      customerId: 'CUST_123',
      note: 'Extra foam on latte',
    }).subscribe({
      next: (order) => {
        this.order = order;
        console.log('Order created:', order.id);
      },
      error: (err) => console.error('Failed:', err),
    });
  }

  getOrder(orderId: string) {
    this.orders.retrieve<Order>(orderId).subscribe({
      next: (order) => console.log('Order:', order),
      error: (err) => console.error('Failed:', err),
    });
  }

  updateOrder(orderId: string) {
    this.orders.update<Order>(orderId, {
      note: 'Updated note',
    }).subscribe({
      next: (order) => console.log('Updated:', order),
      error: (err) => console.error('Failed:', err),
    });
  }

  payOrder(orderId: string, paymentIds: string[]) {
    this.orders.pay<Order>(orderId, paymentIds).subscribe({
      next: (order) => console.log('Paid:', order),
      error: (err) => console.error('Failed:', err),
    });
  }
}
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `create(request, endpoint?)` | `Observable<T>` | Create order |
| `retrieve(orderId, endpoint?)` | `Observable<T>` | Get order by ID |
| `update(orderId, request, endpoint?)` | `Observable<T>` | Update order |
| `pay(orderId, paymentIds, endpoint?)` | `Observable<T>` | Apply payments to order |

## SquareCustomersService

Manage customers through your backend API.

```typescript
import { Component } from '@angular/core';
import { SquareCustomersService } from '@bates-solutions/squareup/angular';

interface Customer {
  id: string;
  givenName: string;
  familyName: string;
  emailAddress: string;
}

@Component({
  selector: 'app-customer-form',
  template: `
    <form (ngSubmit)="createCustomer()">
      <input [(ngModel)]="email" name="email" placeholder="Email" />
      <input [(ngModel)]="firstName" name="firstName" placeholder="First Name" />
      <input [(ngModel)]="lastName" name="lastName" placeholder="Last Name" />
      <button type="submit" [disabled]="loading$ | async">Create</button>
    </form>
    <div *ngIf="error$ | async as error">{{ error.message }}</div>
  `,
})
export class CustomerFormComponent {
  loading$ = this.customers.loading$;
  error$ = this.customers.error$;

  email = '';
  firstName = '';
  lastName = '';

  constructor(private customers: SquareCustomersService) {}

  createCustomer() {
    this.customers.create<Customer>({
      givenName: this.firstName,
      familyName: this.lastName,
      emailAddress: this.email,
      phoneNumber: '+15551234567',
      address: {
        addressLine1: '123 Main St',
        locality: 'San Francisco',
        administrativeDistrictLevel1: 'CA',
        postalCode: '94102',
        country: 'US',
      },
    }).subscribe({
      next: (customer) => console.log('Created:', customer.id),
      error: (err) => console.error('Failed:', err),
    });
  }

  searchByEmail(email: string) {
    this.customers.search<{ customers: Customer[] }>({
      emailAddress: email,
    }).subscribe({
      next: (result) => console.log('Found:', result.customers),
      error: (err) => console.error('Failed:', err),
    });
  }

  updateCustomer(customerId: string) {
    this.customers.update<Customer>(customerId, {
      note: 'VIP customer',
    }).subscribe({
      next: (customer) => console.log('Updated:', customer),
      error: (err) => console.error('Failed:', err),
    });
  }

  deleteCustomer(customerId: string) {
    this.customers.delete(customerId).subscribe({
      next: () => console.log('Deleted'),
      error: (err) => console.error('Failed:', err),
    });
  }
}
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `create(request, endpoint?)` | `Observable<T>` | Create customer |
| `retrieve(customerId, endpoint?)` | `Observable<T>` | Get by ID |
| `update(customerId, request, endpoint?)` | `Observable<T>` | Update customer |
| `delete(customerId, endpoint?)` | `Observable<void>` | Delete customer |
| `search(query, endpoint?)` | `Observable<T>` | Search customers |

## SquareCatalogService

Query your product catalog through your backend API.

```typescript
import { Component, OnInit } from '@angular/core';
import { SquareCatalogService } from '@bates-solutions/squareup/angular';
import { Observable } from 'rxjs';

interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  variations?: Array<{
    id: string;
    name: string;
    priceMoney: { amount: number; currency: string };
  }>;
}

interface CatalogResponse {
  items: CatalogItem[];
}

@Component({
  selector: 'app-product-list',
  template: `
    <input
      type="text"
      (input)="onSearch($event)"
      placeholder="Search products..."
    />
    <div *ngIf="loading$ | async">Loading...</div>
    <ul *ngIf="items$ | async as items">
      <li *ngFor="let item of items.items">
        {{ item.name }}
        <span *ngIf="item.variations?.[0] as v">
          - {{ v.priceMoney.amount / 100 | currency }}
        </span>
      </li>
    </ul>
  `,
})
export class ProductListComponent implements OnInit {
  loading$ = this.catalog.loading$;
  items$!: Observable<CatalogResponse>;

  constructor(private catalog: SquareCatalogService) {}

  ngOnInit() {
    this.items$ = this.catalog.list<CatalogResponse>(['ITEM']);
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.items$ = this.catalog.search<CatalogResponse>({
      textFilter: query,
      limit: 20,
    });
  }

  getItem(itemId: string) {
    this.catalog.retrieve<CatalogItem>(itemId).subscribe({
      next: (item) => console.log('Item:', item),
      error: (err) => console.error('Failed:', err),
    });
  }

  getMultipleItems(itemIds: string[]) {
    this.catalog.batchRetrieve<CatalogResponse>(itemIds).subscribe({
      next: (result) => console.log('Items:', result.items),
      error: (err) => console.error('Failed:', err),
    });
  }
}
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `list(types?, endpoint?)` | `Observable<T>` | List catalog items |
| `search(request, endpoint?)` | `Observable<T>` | Search catalog |
| `retrieve(objectId, endpoint?)` | `Observable<T>` | Get by ID |
| `batchRetrieve(objectIds, endpoint?)` | `Observable<T>` | Get multiple items |

## Complete Checkout Example

Combining services for a full checkout flow:

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {
  SquarePaymentsService,
  SquareOrdersService,
  SquareCustomersService,
} from '@bates-solutions/squareup/angular';
import { Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

interface CartItem {
  name: string;
  amount: number;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  template: `
    <div class="checkout">
      <!-- Cart Summary -->
      <div class="cart">
        <h3>Your Order</h3>
        <div *ngFor="let item of cart">
          {{ item.name }} x{{ item.quantity }} - {{ item.amount * item.quantity / 100 | currency }}
        </div>
        <strong>Total: {{ total / 100 | currency }}</strong>
      </div>

      <!-- Customer Email -->
      <div class="customer">
        <label>Email</label>
        <input [(ngModel)]="email" type="email" />
      </div>

      <!-- Card Input -->
      <div class="payment">
        <label>Card</label>
        <div #cardContainer></div>
      </div>

      <!-- Pay Button -->
      <button
        (click)="checkout()"
        [disabled]="!(cardReady$ | async) || processing"
      >
        {{ processing ? 'Processing...' : 'Pay ' + (total / 100 | currency) }}
      </button>

      <!-- Error Display -->
      <div *ngIf="error" class="error">{{ error }}</div>

      <!-- Success Display -->
      <div *ngIf="result" class="success">
        <h3>Thank you!</h3>
        <p>Order: {{ result.orderId }}</p>
        <p>Payment: {{ result.paymentId }}</p>
      </div>
    </div>
  `,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('cardContainer', { static: true }) cardContainer!: ElementRef;

  cart: CartItem[] = [
    { name: 'Latte', amount: 450, quantity: 2 },
    { name: 'Croissant', amount: 350, quantity: 1 },
  ];

  email = '';
  processing = false;
  error = '';
  result?: { orderId: string; paymentId: string };

  cardReady$ = this.payments.ready$;

  private subscription?: Subscription;

  constructor(
    private payments: SquarePaymentsService,
    private orders: SquareOrdersService,
    private customers: SquareCustomersService
  ) {}

  get total(): number {
    return this.cart.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  }

  ngOnInit() {
    this.payments.attachCard(this.cardContainer.nativeElement).subscribe();
  }

  ngOnDestroy() {
    this.payments.destroyCard();
    this.subscription?.unsubscribe();
  }

  checkout() {
    this.processing = true;
    this.error = '';

    // 1. Find or create customer
    this.subscription = this.customers.search<{ customers: { id: string }[] }>({
      emailAddress: this.email,
    }).pipe(
      switchMap((result) => {
        if (result.customers.length > 0) {
          return of(result.customers[0].id);
        }
        return this.customers.create<{ id: string }>({
          emailAddress: this.email,
        }).pipe(switchMap((customer) => of(customer.id)));
      }),
      // 2. Tokenize card
      switchMap((customerId) =>
        this.payments.tokenize().pipe(
          switchMap((token) => of({ customerId, token }))
        )
      ),
      // 3. Create order
      switchMap(({ customerId, token }) =>
        this.orders.create<{ id: string }>({
          lineItems: this.cart.map((item) => ({
            name: item.name,
            quantity: String(item.quantity),
            basePriceMoney: { amount: item.amount, currency: 'USD' },
          })),
          customerId,
        }).pipe(
          switchMap((order) => of({ customerId, token, orderId: order.id }))
        )
      ),
      // 4. Create payment
      switchMap(({ customerId, token, orderId }) =>
        this.payments.createPayment<{ id: string }>({
          sourceId: token,
          amount: this.total,
          customerId,
          orderId,
        }).pipe(
          switchMap((payment) => of({ orderId, paymentId: payment.id }))
        )
      ),
      catchError((err) => {
        this.error = err.message;
        throw err;
      })
    ).subscribe({
      next: (result) => {
        this.result = result;
        this.processing = false;
      },
      error: () => {
        this.processing = false;
      },
    });
  }
}
```

## Error Handling Patterns

### Using catchError

```typescript
import { catchError, EMPTY } from 'rxjs';

this.payments.tokenize().pipe(
  catchError((error) => {
    console.error('Tokenization failed:', error);
    this.errorMessage = error.message;
    return EMPTY; // Don't propagate error
  })
).subscribe((token) => {
  console.log('Token:', token);
});
```

### Using error$ Observable

```typescript
@Component({
  template: `
    <div *ngIf="error$ | async as error" class="error">
      {{ error.message }}
    </div>
  `,
})
export class CheckoutComponent {
  error$ = this.payments.error$;

  constructor(private payments: SquarePaymentsService) {}
}
```

## Backend API Requirements

The Angular services expect your backend to implement these endpoints:

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Payments | POST | `/api/payments` | Create payment |
| Orders | POST | `/api/orders` | Create order |
| Orders | GET | `/api/orders/:id` | Get order |
| Orders | PUT | `/api/orders/:id` | Update order |
| Orders | POST | `/api/orders/:id/pay` | Pay for order |
| Customers | POST | `/api/customers` | Create customer |
| Customers | GET | `/api/customers/:id` | Get customer |
| Customers | PUT | `/api/customers/:id` | Update customer |
| Customers | DELETE | `/api/customers/:id` | Delete customer |
| Customers | POST | `/api/customers/search` | Search customers |
| Catalog | GET | `/api/catalog` | List items |
| Catalog | POST | `/api/catalog/search` | Search items |
| Catalog | GET | `/api/catalog/:id` | Get item |
| Catalog | POST | `/api/catalog/batch` | Batch retrieve |

## Next Steps

- [Payments Guide](../core/payments.md) - Backend payment processing
- [Orders Guide](../core/orders.md) - Order management
- [Webhooks Guide](../server/webhooks.md) - Handle payment events
