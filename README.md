# payments

TypeScript payment provider libraries from Bates Solutions, in one repo:

| Package | Provider | JSR | API docs |
|---|---|---|---|
| `@bates-solutions/squareup` | Square | [jsr.io/@bates-solutions/squareup](https://jsr.io/@bates-solutions/squareup) | [docs](https://bates-solutions.github.io/payments/squareup/) |
| `@bates-solutions/stripe` | Stripe | [jsr.io/@bates-solutions/stripe](https://jsr.io/@bates-solutions/stripe) | [docs](https://bates-solutions.github.io/payments/stripe/) |
| `@bates-solutions/clover` | Clover | [jsr.io/@bates-solutions/clover](https://jsr.io/@bates-solutions/clover) | [docs](https://bates-solutions.github.io/payments/clover/) |
| `@bates-solutions/payments-core` | Shared primitives (0.x) | [jsr.io/@bates-solutions/payments-core](https://jsr.io/@bates-solutions/payments-core) | [docs](https://bates-solutions.github.io/payments/payments-core/) |

All four packages are developed and released from this repo. The old `Bates-Solutions/squareup`, `stripe` and `clover` repos are archived; their history and tags (renamed `<package>-v<version>`) are here.

Report problems in this repo's [issues](https://github.com/Bates-Solutions/payments/issues), naming the package.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request, whatever its base branch, and on every push to `main`. It checks only the packages a change affects: a change under `packages/<name>/` checks that package, a change to root config, `.github/` or `scripts/` checks every package, and a change to root docs (`README.md`, `LICENSE`) checks none. For each affected package it runs lint, typecheck, build, tests with coverage and a JSR publish dry run, on GitHub-hosted runners. The `ci-ok` check sums up the run.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please) (`release-please-config.json`, `.release-please-manifest.json`) and `.github/workflows/release.yml`. Each package has its own version, changelog and tags (`<package>-v<version>`, for example `clover-v1.1.1`).

1. Commits use [Conventional Commits](https://www.conventionalcommits.org/). A `fix:` under `packages/<name>/` makes a patch release of that package, a `feat:` a minor one, and a `!` or `BREAKING CHANGE:` footer a major one. `chore:`, `docs:`, `ci:`, `test:` and `refactor:` make none.
2. On each push to `main`, release-please updates one open release PR. It bumps each changed package's `package.json`, `jsr.json` and `CHANGELOG.md`.
3. Merging the release PR tags each package and creates its GitHub release. The workflow then publishes those versions to JSR over GitHub OIDC, with provenance. It skips any version JSR already has.

PRs merge with a merge commit (squash and rebase are off, so stacked PRs work). The merge commit's subject is GitHub's `Merge pull request #N from …`, which release-please ignores, but its body is the PR title, which release-please parses like any commit message. Each commit on the branch becomes a changelog line, and so does every further `type(scope): ` paragraph in a commit's message, so:

- Don't give the PR title a Conventional Commit type: write `Squareup: support ad hoc order taxes`, not `feat(squareup): support ad hoc order taxes`. A typed title adds a second line for the same change. (GitHub won't leave the merge commit body blank while keeping the `Merge pull request` subject, so the title convention is the fix.) Bot PRs titled `chore(deps): …` are harmless, since `chore` gets no changelog line.
- Give every commit on the branch the type and scope its changelog line should have. A review fix to a feature that hasn't shipped yet is `test:`, `refactor:` or `chore:`, or is folded into the feature commit with a `fixup` (not `squash`, which keeps the fix's message as a second paragraph that release-please still lists). Folding rewrites the branch, so rebase any PR stacked on it.
- Don't put a `BEGIN_COMMIT_OVERRIDE` block in the PR body. release-please applies it to every commit in the PR, the merge commit included, so a PR with two branch commits lists each override line three times.

Never bump versions, create tags or run `jsr publish` by hand.

Releases before the move were made from the old repos, which are archived. Their tags were imported here as `<package>-v<version>`.

## Docs

The API reference for every package is at https://bates-solutions.github.io/payments/, one path per package (for example [/stripe/](https://bates-solutions.github.io/payments/stripe/)). Each package also has hand-written guides in `packages/<name>/docs/`.

- `npm run docs` regenerates each package's markdown API reference in `packages/<name>/docs/api/`, which is committed and readable on GitHub.
- `npm run docs:site` builds the HTML site into `site/` (`scripts/build-site.mjs`): typedoc HTML for each package plus an index page. It does not touch the committed markdown.

`.github/workflows/docs.yml` builds the site on pull requests that touch a package's source or docs config, and deploys it to GitHub Pages on each such push to `main`.

## License

MIT
