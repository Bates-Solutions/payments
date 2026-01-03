import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SquarePaymentsService } from '../services/square-payments.service.js';
import type { CardOptions } from '../types.js';

/**
 * Directive for attaching Square card input to an element
 *
 * @example
 * ```html
 * <div
 *   squareCard
 *   [cardOptions]="{ style: { input: { fontSize: '16px' } } }"
 *   (cardReady)="onCardReady()"
 *   (cardError)="onCardError($event)"
 * ></div>
 *
 * <button (click)="pay()" [disabled]="!cardReady">Pay</button>
 * ```
 *
 * ```typescript
 * @Component({...})
 * export class CheckoutComponent {
 *   cardReady = false;
 *
 *   constructor(private payments: SquarePaymentsService) {}
 *
 *   onCardReady() {
 *     this.cardReady = true;
 *   }
 *
 *   pay() {
 *     this.payments.tokenize().subscribe(token => {
 *       console.log('Token:', token);
 *     });
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[squareCard]',
  standalone: true,
})
export class SquareCardDirective implements OnInit, OnDestroy {
  /** Card styling options */
  @Input() cardOptions?: CardOptions;

  /** Emits when card input is ready */
  @Output() cardReady = new EventEmitter<void>();

  /** Emits when an error occurs */
  @Output() cardError = new EventEmitter<Error>();

  private subscription?: Subscription;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private payments: SquarePaymentsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.payments
      .attachCard(this.elementRef.nativeElement, this.cardOptions)
      .subscribe({
        next: () => {
          this.cardReady.emit();
        },
        error: (err: Error) => {
          this.cardError.emit(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.payments.destroyCard();
  }
}
