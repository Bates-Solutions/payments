import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SquareSdkService } from '../services/square-sdk.service.js';
import type { GooglePay, ApplePay, DigitalWalletOptions, TokenResult } from '../types.js';

/**
 * Payment button component for Google Pay / Apple Pay
 *
 * @example
 * ```html
 * <square-payment-button
 *   type="googlePay"
 *   (payment)="onPayment($event)"
 *   (error)="onError($event)"
 * ></square-payment-button>
 *
 * <square-payment-button
 *   type="applePay"
 *   [buttonOptions]="{ buttonColor: 'black' }"
 *   (payment)="onPayment($event)"
 * ></square-payment-button>
 * ```
 */
@Component({
  selector: 'square-payment-button',
  standalone: true,
  template: `
    <div
      #buttonContainer
      [style.minHeight.px]="48"
      [style.cursor]="ready && !loading ? 'pointer' : 'default'"
      [style.opacity]="loading ? 0.7 : 1"
      (click)="handleClick()"
      role="button"
      [attr.tabindex]="ready ? 0 : -1"
      [attr.aria-disabled]="!ready || loading"
      [attr.aria-label]="'Pay with ' + (type === 'googlePay' ? 'Google Pay' : 'Apple Pay')"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentButtonComponent implements OnInit, OnDestroy {
  /** Payment method type */
  @Input() type: 'googlePay' | 'applePay' = 'googlePay';

  /** Button styling options */
  @Input() buttonOptions?: DigitalWalletOptions;

  /** Emits when button is ready */
  @Output() buttonReady = new EventEmitter<void>();

  /** Emits payment token on success */
  @Output() payment = new EventEmitter<string>();

  /** Emits when an error occurs */
  @Output() error = new EventEmitter<Error>();

  /** Emits when payment is cancelled */
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('buttonContainer', { static: true })
  private containerRef!: ElementRef<HTMLElement>;

  private paymentMethod: GooglePay | ApplePay | null = null;
  private subscription?: Subscription;

  ready = false;
  loading = false;

  constructor(
    private sdk: SquareSdkService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.sdk.whenReady().subscribe({
      next: (payments) => {
        void this.initializePaymentMethod(payments);
      },
      error: (err: Error) => {
        this.error.emit(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.paymentMethod) {
      void this.paymentMethod.destroy();
      this.paymentMethod = null;
    }
  }

  handleClick(): void {
    if (!this.paymentMethod || this.loading) {
      return;
    }

    void this.tokenize();
  }

  private async initializePaymentMethod(
    payments: import('../types.js').Payments
  ): Promise<void> {
    try {
      if (this.type === 'googlePay') {
        this.paymentMethod = await payments.googlePay({});
      } else {
        this.paymentMethod = await payments.applePay({});
      }

      await this.paymentMethod.attach(
        this.containerRef.nativeElement,
        this.buttonOptions
      );

      this.ready = true;
      this.buttonReady.emit();
      this.cdr.markForCheck();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to initialize ${this.type}`);
      this.error.emit(error);
      this.cdr.markForCheck();
    }
  }

  private async tokenize(): Promise<void> {
    if (!this.paymentMethod) {
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    try {
      const result: TokenResult = await this.paymentMethod.tokenize();

      if (result.status === 'OK' && result.token) {
        this.payment.emit(result.token);
      } else if (result.status === 'Cancel') {
        this.cancel.emit();
      } else {
        const errorMessage =
          result.errors?.map((e) => e.message).join(', ') ?? 'Payment failed';
        throw new Error(errorMessage);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      this.error.emit(error);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
