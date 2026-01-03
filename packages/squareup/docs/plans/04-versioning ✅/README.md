# Versioning & Release Strategy

## Semantic Versioning

This project follows [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH (e.g., 1.2.3)
```

| Version Bump | When to Use | Example |
|--------------|-------------|---------|
| **MAJOR** | Breaking changes to public API | Removing a method, changing return types |
| **MINOR** | New features, backwards-compatible | Adding new hooks, services, or options |
| **PATCH** | Bug fixes, backwards-compatible | Fixing a payment calculation bug |

---

## Pre-release Versions

During initial development (before 1.0.0):
- `0.x.y` - API may change without major version bumps
- `0.1.0` - Initial alpha release
- `0.x.0-beta.1` - Beta releases for testing

---

## What Constitutes a Breaking Change

**Breaking (requires MAJOR bump):**
- Removing or renaming exported functions, classes, hooks, or types
- Changing function signatures (required parameters, return types)
- Changing default behavior in ways that affect existing code
- Dropping support for Node.js, React, or Angular versions
- Changes to `peerDependencies` version ranges

**Non-breaking (MINOR or PATCH):**
- Adding new optional parameters
- Adding new exports
- Deprecating (but not removing) APIs
- Internal refactoring with no public API changes
- Bug fixes

---

## Conventional Commits

All commits should follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | None |
| `style` | Code style (formatting) | None |
| `refactor` | Code refactoring | None |
| `perf` | Performance improvement | PATCH |
| `test` | Adding/fixing tests | None |
| `chore` | Build, CI, tooling | None |
| `BREAKING CHANGE` | In footer or `!` after type | MAJOR |

**Examples:**
```bash
feat(react): add useInventory hook
fix(payments): correct currency formatting for JPY
feat(core)!: rename createSquareClient to createClient
docs: update README with Angular examples
```

---

## Changelog

Maintain a `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

## [Unreleased]

## [1.1.0] - 2025-03-15
### Added
- `useInventory` hook for React
- Inventory service in core module

### Fixed
- Currency formatting for zero-decimal currencies (JPY, KRW)

## [1.0.0] - 2025-02-01
### Added
- Initial stable release
- Core client with Payments, Orders, Customers, Catalog services
- React integration with hooks and components
- Angular module with injectable services
- Server utilities for webhook handling
```

---

## Release Process

1. **Development** - Work on feature branches, merge to `main`
2. **Version Bump** - Update `package.json` version based on changes
3. **Changelog Update** - Move unreleased items to new version section
4. **Tag Release** - Create git tag `v1.2.3`
5. **Publish** - Automated npm publish via CI

---

## Deprecation Policy

1. **Announce** - Mark deprecated in docs and JSDoc with `@deprecated`
2. **Warn** - Log console warnings in development mode
3. **Maintain** - Keep deprecated APIs for at least 2 minor versions
4. **Remove** - Remove in next major version with migration guide

**Example deprecation:**
```typescript
/**
 * @deprecated Use `createClient()` instead. Will be removed in v2.0.0.
 */
export function createSquareClient(config: Config): SquareClient {
  console.warn(
    '[@bates/squareup] createSquareClient is deprecated. Use createClient() instead.'
  );
  return createClient(config);
}
```

---

## Version Compatibility Matrix

| @bates/squareup | square SDK | Node.js | React | Angular |
|-----------------|------------|---------|-------|---------|
| 1.x | ^41.0.0 | >=18 | ^18.0 \|\| ^19.0 | ^17.0 \|\| ^18.0 \|\| ^19.0 |
| 0.x (pre-release) | ^41.0.0 | >=18 | ^18.0 \|\| ^19.0 | ^17.0 \|\| ^18.0 \|\| ^19.0 |
