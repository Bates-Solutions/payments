# GitHub & CI/CD

## GitHub Flow

This project follows [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) - a lightweight, branch-based workflow:

```
main (always deployable)
  │
  ├── feature/add-inventory-hook
  │     └── PR → Review → Merge → Delete branch
  │
  ├── fix/payment-currency-bug
  │     └── PR → Review → Merge → Delete branch
  │
  └── docs/update-react-guide
        └── PR → Review → Merge → Delete branch
```

**Core Principles:**
1. `main` is always deployable
2. Create descriptive branches for all changes
3. Open PRs early for discussion
4. Request reviews before merging
5. Merge to `main` and deploy immediately
6. Delete branches after merging

---

## Branch Naming Convention

```
<type>/<short-description>
```

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New functionality | `feature/add-loyalty-service` |
| `fix/` | Bug fixes | `fix/webhook-signature-validation` |
| `docs/` | Documentation | `docs/angular-setup-guide` |
| `refactor/` | Code improvements | `refactor/payment-error-handling` |
| `test/` | Test additions | `test/catalog-service-coverage` |
| `chore/` | Maintenance | `chore/update-dependencies` |

---

## Pull Request Process

**PR Requirements:**
- Descriptive title following conventional commits format
- At least 1 approval required
- All CI checks must pass
- Branch must be up to date with `main`

See [templates/PULL_REQUEST_TEMPLATE.md](templates/PULL_REQUEST_TEMPLATE.md) for the PR template.

---

## GitHub Actions Workflows

All workflow files are in the [workflows/](workflows/) directory:

| Workflow | File | Trigger |
|----------|------|---------|
| CI (Build, Test, Lint) | [ci.yml](workflows/ci.yml) | Push to main, PRs |
| Release | [release.yml](workflows/release.yml) | Git tags `v*` |
| Documentation | [docs.yml](workflows/docs.yml) | Push to main (docs changes) |
| Dependency Review | [dependency-review.yml](workflows/dependency-review.yml) | PRs with package changes |

---

## Branch Protection Rules

Configure these rules for the `main` branch:

**Required settings:**
- [x] Require a pull request before merging
  - [x] Require 1 approval
  - [x] Dismiss stale PR approvals when new commits are pushed
  - [x] Require review from code owners
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Required checks: `build`, `test-react`, `test-angular`
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings

**Recommended settings:**
- [x] Require signed commits
- [x] Require linear history (squash or rebase merging only)
- [ ] Lock branch (only for releases)

---

## CODEOWNERS

See [templates/CODEOWNERS](templates/CODEOWNERS) for the CODEOWNERS file.

---

## Issue Templates

Issue templates are in the [templates/ISSUE_TEMPLATE/](templates/ISSUE_TEMPLATE/) directory:

- [bug_report.yml](templates/ISSUE_TEMPLATE/bug_report.yml)
- [feature_request.yml](templates/ISSUE_TEMPLATE/feature_request.yml)

---

## Repository Settings

**General:**
- Default branch: `main`
- Features: Issues, Discussions enabled
- Merge button: Allow squash merging (default), rebase merging
- Disable merge commits for cleaner history
- Automatically delete head branches

**Secrets Required:**
| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | npm publish authentication |
| `CODECOV_TOKEN` | Code coverage uploads |

**Environments:**
- `production` - For npm releases, requires manual approval

---

## Labels

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | `#d73a4a` | Something isn't working |
| `enhancement` | `#a2eeef` | New feature or request |
| `documentation` | `#0075ca` | Documentation improvements |
| `good first issue` | `#7057ff` | Good for newcomers |
| `help wanted` | `#008672` | Extra attention needed |
| `breaking change` | `#b60205` | Introduces breaking changes |
| `core` | `#1d76db` | Core module |
| `react` | `#61dafb` | React integration |
| `angular` | `#dd0031` | Angular integration |
| `server` | `#68a063` | Server utilities |
| `dependencies` | `#0366d6` | Dependency updates |
| `triage` | `#ffffff` | Needs triage |

---

## Dependabot Configuration

See [templates/dependabot.yml](templates/dependabot.yml) for the Dependabot configuration.

---

## Security Policy

See [templates/SECURITY.md](templates/SECURITY.md) for the security policy.
