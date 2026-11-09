# payments

TypeScript payment provider libraries from Bates Solutions, in one repo:

| Package | Provider | JSR |
|---|---|---|
| `@bates-solutions/squareup` | Square | [jsr.io/@bates-solutions/squareup](https://jsr.io/@bates-solutions/squareup) |
| `@bates-solutions/stripe` | Stripe | [jsr.io/@bates-solutions/stripe](https://jsr.io/@bates-solutions/stripe) |
| `@bates-solutions/clover` | Clover | [jsr.io/@bates-solutions/clover](https://jsr.io/@bates-solutions/clover) |

**Status: under construction.** This repo is being set up. Until the move is finished, each package is still developed and published from its own repo:

- https://github.com/Bates-Solutions/squareup
- https://github.com/Bates-Solutions/stripe
- https://github.com/Bates-Solutions/clover

Please report issues there for now.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request, whatever its base branch, and on every push to `main`. It checks only the packages a change affects: a change under `packages/<name>/` checks that package, a change to root config, `.github/` or `scripts/` checks every package, and a change to root docs (`README.md`, `LICENSE`) checks none. For each affected package it runs lint, typecheck, build, tests with coverage and a JSR publish dry run, on GitHub-hosted runners. The `ci-ok` check sums up the run.

## License

MIT
