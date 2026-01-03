# Square TypeScript Library Plan

## Overview

A TypeScript wrapper library for the Square API, designed for easy integration with React and Angular projects.

**Package Name:** `@bates/squareup`

---

## The Problem We're Solving

Square already has a Node.js SDK (`square` npm package), but it:
- Is low-level and verbose
- Requires repetitive boilerplate for common operations
- Has no framework-specific integrations (React/Angular)
- No built-in webhook handling utilities
- No convenient helpers for common workflows

---

## Core Value Propositions

| Feature | Square SDK | Our Library |
|---------|-----------|-------------|
| Payment + Order in one call | Manual | `createPaymentWithOrder()` |
| React hooks | None | `useSquarePayment()`, `useCustomer()` |
| Angular services | None | Injectable services with RxJS |
| Webhook verification | Manual | Built-in middleware |
| Type-safe builders | Raw objects | Fluent API builders |
| Error handling | Basic | Typed errors with retry logic |

---

## Design Decisions

Based on project requirements:

1. **Package Structure:** Single package with subpath exports (`@bates/squareup/react`, `@bates/squareup/angular`)
2. **Target Use Case:** Single-merchant apps (personal access tokens) - simpler auth, your own Square account
3. **React State Management:** Built-in React Context only - zero dependencies, works everywhere

---

## Related Plans

- [02-architecture](../02-architecture/) - Package configuration, directory structure, implementation phases
- [03-api-reference](../03-api-reference/) - Square API reference, authentication, webhooks
- [04-versioning](../04-versioning/) - Semantic versioning, changelog, releases
- [05-documentation](../05-documentation/) - Documentation strategy, JSDoc standards
- [06-github-cicd](../06-github-cicd/) - GitHub Flow, CI/CD workflows
