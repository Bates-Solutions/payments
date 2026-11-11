# payments

TypeScript payment provider libraries from Bates Solutions, in one repo:

| Package | Provider | JSR | API docs |
|---|---|---|---|
| `@bates-solutions/squareup` | Square | [jsr.io/@bates-solutions/squareup](https://jsr.io/@bates-solutions/squareup) | [docs](https://bates-solutions.github.io/payments/squareup/) |
| `@bates-solutions/stripe` | Stripe | [jsr.io/@bates-solutions/stripe](https://jsr.io/@bates-solutions/stripe) | [docs](https://bates-solutions.github.io/payments/stripe/) |
| `@bates-solutions/clover` | Clover | [jsr.io/@bates-solutions/clover](https://jsr.io/@bates-solutions/clover) | [docs](https://bates-solutions.github.io/payments/clover/) |

**Status: under construction.** This repo is being set up. Until the move is finished, each package is still developed and published from its own repo:

- https://github.com/Bates-Solutions/squareup
- https://github.com/Bates-Solutions/stripe
- https://github.com/Bates-Solutions/clover

Please report issues there for now.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request, whatever its base branch, and on every push to `main`. It checks only the packages a change affects: a change under `packages/<name>/` checks that package, a change to root config, `.github/` or `scripts/` checks every package, and a change to root docs (`README.md`, `LICENSE`) checks none. For each affected package it runs lint, typecheck, build, tests with coverage and a JSR publish dry run, on GitHub-hosted runners. The `ci-ok` check sums up the run.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please) (`release-please-config.json`, `.release-please-manifest.json`) and `.github/workflows/release.yml`. Each package has its own version, changelog and tags (`<package>-v<version>`, for example `clover-v1.1.1`).

1. Commits use [Conventional Commits](https://www.conventionalcommits.org/). A `fix:` under `packages/<name>/` makes a patch release of that package, a `feat:` a minor one, and a `!` or `BREAKING CHANGE:` footer a major one. `chore:`, `docs:`, `ci:`, `test:` and `refactor:` make none.
2. On each push to `main`, release-please updates one open release PR. It bumps each changed package's `package.json`, `jsr.json` and `CHANGELOG.md`.
3. Merging the release PR tags each package and creates its GitHub release. The workflow then publishes those versions to JSR over GitHub OIDC, with provenance. It skips any version JSR already has.

Never bump versions, create tags or run `jsr publish` by hand.

The release workflow stays off until the move from the old repos is finished: those repos still release these packages until then.

## Docs

The API reference for every package is at https://bates-solutions.github.io/payments/, one path per package (for example [/stripe/](https://bates-solutions.github.io/payments/stripe/)). Each package also has hand-written guides in `packages/<name>/docs/`.

- `npm run docs` regenerates each package's markdown API reference in `packages/<name>/docs/api/`, which is committed and readable on GitHub.
- `npm run docs:site` builds the HTML site into `site/` (`scripts/build-site.mjs`): typedoc HTML for each package plus an index page. It does not touch the committed markdown.

`.github/workflows/docs.yml` builds the site on pull requests that touch a package's source or docs config, and deploys it to GitHub Pages on each such push to `main`.

## License

MIT
