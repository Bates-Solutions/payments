# Angular Test Plan

## Overview

Add comprehensive test coverage for the Angular integration (`src/angular/`).

## Current State

- Angular integration code exists in `src/angular/`
- No tests currently exist for Angular components
- CI workflow does not run Angular tests

## Prerequisites

- Angular Testing utilities (`@angular/core/testing`)
- Zone.js for Angular change detection
- Vitest configuration for Angular

## Test Scope

### 1. SquareService

Location: `src/angular/square.service.ts`

Tests needed:
- [ ] Service creation and injection
- [ ] Client initialization with access token
- [ ] Lazy initialization of sub-services
- [ ] Environment configuration (sandbox vs production)
- [ ] Error handling for missing configuration

### 2. Individual Services

Each service wrapper needs tests:
- [ ] PaymentsService - payment operations
- [ ] OrdersService - order management
- [ ] CustomersService - customer CRUD
- [ ] CatalogService - catalog operations
- [ ] InventoryService - inventory management
- [ ] InvoicesService - invoice operations
- [ ] LoyaltyService - loyalty program
- [ ] SubscriptionsService - subscription management

### 3. Angular-Specific Patterns

- [ ] Dependency injection works correctly
- [ ] Services are providedIn: 'root' (singleton)
- [ ] Observable patterns (if used)
- [ ] Zone.js integration
- [ ] Change detection triggers

## Implementation Steps

1. **Setup Vitest for Angular**
   - Configure `vitest.workspace.ts` with Angular project
   - Add necessary test utilities
   - Configure Zone.js for testing

2. **Create Test Utilities**
   - Mock Square client factory
   - TestBed configuration helpers
   - Common test fixtures

3. **Write Service Tests**
   - Start with SquareService (main entry point)
   - Test each sub-service wrapper
   - Verify DI patterns work correctly

4. **Update CI Workflow**
   - Re-enable `test:angular` script
   - Add Angular test job to CI

## Dependencies

```json
{
  "@angular/core": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "zone.js": "^0.14.0",
  "vitest": "^2.0.0"
}
```

## Success Criteria

- [ ] All Angular services have test coverage
- [ ] 90%+ code coverage for `src/angular/`
- [ ] CI runs Angular tests on PR
- [ ] Tests pass on supported Angular versions (17, 18, 19)

## Notes

- Angular tests require more setup than plain TypeScript tests
- Zone.js must be properly configured for async operations
- Consider testing with different Angular versions in CI matrix
