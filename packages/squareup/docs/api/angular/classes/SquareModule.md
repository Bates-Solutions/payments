[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [angular](../README.md) / SquareModule

# Class: SquareModule

Defined in: [src/angular/square.module.ts:36](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/square.module.ts#L36)

Square Angular module

## Example

```typescript
import { SquareModule } from '@bates-solutions/squareup/angular';

@NgModule({
  imports: [
    SquareModule.forRoot({
      applicationId: 'sq0idp-xxx',
      locationId: 'LXXX',
      environment: 'sandbox',
    })
  ]
})
export class AppModule {}
```

## Constructors

### Constructor

> **new SquareModule**(`parentModule?`): `SquareModule`

Defined in: [src/angular/square.module.ts:37](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/square.module.ts#L37)

#### Parameters

##### parentModule?

`SquareModule`

#### Returns

`SquareModule`

## Methods

### forRoot()

> `static` **forRoot**(`config`): `ModuleWithProviders`\<`SquareModule`\>

Defined in: [src/angular/square.module.ts:51](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/angular/square.module.ts#L51)

Configure the Square module with application settings

#### Parameters

##### config

[`SquareConfig`](../interfaces/SquareConfig.md)

Square configuration options

#### Returns

`ModuleWithProviders`\<`SquareModule`\>

Module with providers
