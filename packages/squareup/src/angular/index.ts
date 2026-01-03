/**
 * @bates/squareup Angular integration
 *
 * @example
 * ```typescript
 * import { SquareModule } from '@bates/squareup/angular';
 *
 * @NgModule({
 *   imports: [
 *     SquareModule.forRoot({
 *       applicationId: 'sq0idp-xxx',
 *       locationId: 'LXXX',
 *       environment: 'sandbox',
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * ```typescript
 * // Standalone component usage
 * import { SquareCardDirective, PaymentButtonComponent } from '@bates/squareup/angular';
 *
 * @Component({
 *   standalone: true,
 *   imports: [SquareCardDirective, PaymentButtonComponent],
 *   template: `
 *     <div squareCard (cardReady)="ready = true"></div>
 *     <square-payment-button type="googlePay" (payment)="onPayment($event)">
 *     </square-payment-button>
 *   `
 * })
 * export class CheckoutComponent {}
 * ```
 */

// Module
export { SquareModule, SQUARE_CONFIG } from './square.module.js';

// Services
export {
  SquareSdkService,
  SquarePaymentsService,
  SquareOrdersService,
  SquareCustomersService,
  SquareCatalogService,
} from './services/index.js';

// Directives
export { SquareCardDirective } from './directives/index.js';

// Components
export { PaymentButtonComponent } from './components/index.js';

// Types
export type {
  SquareConfig,
  Payments,
  Card,
  GooglePay,
  ApplePay,
  CardOptions,
  CardStyle,
  GooglePayOptions,
  ApplePayOptions,
  DigitalWalletOptions,
  TokenResult,
  TokenError,
  CreatePaymentRequest,
  CreateOrderRequest,
  OrderLineItem,
  OrderDiscount,
  OrderTax,
  OrderServiceCharge,
  OrderFulfillment,
  PickupDetails,
  ShipmentDetails,
  Recipient,
  Money,
  CreateCustomerRequest,
  Address,
  CatalogSearchRequest,
} from './types.js';
