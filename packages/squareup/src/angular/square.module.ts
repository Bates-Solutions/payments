import {
  NgModule,
  ModuleWithProviders,
  InjectionToken,
  Optional,
  SkipSelf,
} from '@angular/core';
import type { SquareConfig } from './types.js';

/**
 * Injection token for Square configuration
 */
export const SQUARE_CONFIG = new InjectionToken<SquareConfig>('SQUARE_CONFIG');

/**
 * Square Angular module
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
 */
@NgModule({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SquareModule {
  constructor(@Optional() @SkipSelf() parentModule?: SquareModule) {
    if (parentModule) {
      throw new Error(
        'SquareModule is already loaded. Import it in the AppModule only using forRoot().'
      );
    }
  }

  /**
   * Configure the Square module with application settings
   *
   * @param config - Square configuration options
   * @returns Module with providers
   */
  static forRoot(config: SquareConfig): ModuleWithProviders<SquareModule> {
    return {
      ngModule: SquareModule,
      providers: [
        {
          provide: SQUARE_CONFIG,
          useValue: {
            environment: 'sandbox',
            currency: 'USD',
            ...config,
          },
        },
      ],
    };
  }
}
