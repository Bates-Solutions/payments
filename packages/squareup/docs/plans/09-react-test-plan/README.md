# React Test Plan

## Overview

Add comprehensive test coverage for the React integration (`src/react/`).

## Current State

- React integration code exists in `src/react/`
- No tests currently exist for React hooks/components
- CI workflow does not run React tests

## Prerequisites

- React Testing Library (`@testing-library/react`)
- React test renderer or jsdom environment
- Vitest configuration for React

## Test Scope

### 1. SquareProvider

Location: `src/react/SquareProvider.tsx`

Tests needed:
- [ ] Provider renders children
- [ ] Context provides Square client
- [ ] Configuration options (sandbox, environment)
- [ ] Error boundary for initialization failures
- [ ] Re-initialization on config change

### 2. Hooks

Each hook needs comprehensive tests:

#### useSquarePayment
- [ ] Returns payment functions
- [ ] Handles card tokenization
- [ ] Error states
- [ ] Loading states

#### usePayments
- [ ] Create payment
- [ ] Get payment
- [ ] List payments
- [ ] Cancel/complete payment
- [ ] Error handling

#### useOrders
- [ ] Create order
- [ ] Get order
- [ ] Update order
- [ ] Pay order
- [ ] Error handling

#### useCustomers
- [ ] Create customer
- [ ] Get customer
- [ ] Update customer
- [ ] Delete customer
- [ ] Search customers
- [ ] Error handling

#### useCatalog
- [ ] List catalog
- [ ] Get catalog object
- [ ] Search catalog
- [ ] Batch operations
- [ ] Error handling

### 3. Components

#### CardInput
- [ ] Renders card input fields
- [ ] Handles input changes
- [ ] Validates card data
- [ ] Exposes ref methods
- [ ] Styling props

#### PaymentButton
- [ ] Renders button
- [ ] Handles click
- [ ] Loading state
- [ ] Disabled state
- [ ] Custom children

### 4. React-Specific Patterns

- [ ] Hooks follow rules of hooks
- [ ] Proper cleanup on unmount
- [ ] Memoization where appropriate
- [ ] Suspense compatibility (if applicable)
- [ ] Concurrent mode safety

## Implementation Steps

1. **Setup Vitest for React**
   - Configure `vitest.workspace.ts` with React project
   - Add jsdom environment
   - Configure React Testing Library

2. **Create Test Utilities**
   - Mock Square client wrapper
   - Custom render function with providers
   - Common test fixtures

3. **Write Provider Tests**
   - Test SquareProvider context
   - Test configuration options

4. **Write Hook Tests**
   - Use renderHook from Testing Library
   - Test all hook return values
   - Test error scenarios

5. **Write Component Tests**
   - Test CardInput rendering and interaction
   - Test PaymentButton states

6. **Update CI Workflow**
   - Re-enable `test:react` script
   - Add React test job to CI

## Dependencies

```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/user-event": "^14.0.0",
  "jsdom": "^24.0.0",
  "react": "^18.0.0 || ^19.0.0",
  "vitest": "^2.0.0"
}
```

## Success Criteria

- [ ] All React hooks have test coverage
- [ ] All React components have test coverage
- [ ] 90%+ code coverage for `src/react/`
- [ ] CI runs React tests on PR
- [ ] Tests pass on supported React versions (18, 19)

## Example Test Structure

```typescript
// src/react/__tests__/usePayments.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { usePayments } from '../hooks/usePayments';
import { SquareProvider } from '../SquareProvider';

const wrapper = ({ children }) => (
  <SquareProvider accessToken="test-token">
    {children}
  </SquareProvider>
);

describe('usePayments', () => {
  it('should create a payment', async () => {
    const { result } = renderHook(() => usePayments(), { wrapper });

    await waitFor(() => {
      expect(result.current.createPayment).toBeDefined();
    });
  });
});
```

## Notes

- React 19 has new features that may affect testing patterns
- Consider testing with both React 18 and 19 in CI
- Web Payments SDK mocking may require special handling
- jsdom doesn't support all browser APIs (may need polyfills)
