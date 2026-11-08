#!/usr/bin/env bash
# Import (or re-import) the history of the provider repos into packages/<name>/.
#
# Usage, from the root of a payments checkout on the import branch:
#   scripts/import-history.sh [package ...]      # default: squareup stripe clover
#
# Environment:
#   SOURCE_ORG   GitHub org to clone from (default Bates-Solutions)
#   SOURCE_REF   branch to import from each repo (default main)
#   WORK_DIR     scratch dir for the filtered clones (default: a new mktemp dir,
#                deleted on exit; a dir you pass is kept)
#
# What it does, per package:
#   1. Clones https://github.com/$SOURCE_ORG/<name> fresh (never touches a local checkout).
#   2. Rewrites it with git filter-repo so every file lives under packages/<name>/
#      and every tag vX.Y.Z becomes <name>-vX.Y.Z.
#   3. Merges the rewritten <ref> into the current branch with --allow-unrelated-histories
#      (first run) or a normal merge (re-runs), and fetches the renamed tags locally.
#
# Re-running is safe: filter-repo is deterministic, so commits that were already
# imported keep the same ids and a re-run only merges what landed since. That is how
# PRs merged in the source repos after the first import are carried over before cutover.
#
# It refuses, rather than merging a second copy of history, when:
#   - the source branch was rewritten (force-push) so the previously imported tip is
#     no longer an ancestor of it;
#   - packages/<name>/ exists but no earlier "import <name> history" merge is found;
#   - an upstream tag moved, so a renamed tag would have to be overwritten.
#
# Tags are fetched locally but never pushed. Push them yourself after review:
#   git push origin 'refs/tags/squareup-v*' 'refs/tags/stripe-v*' 'refs/tags/clover-v*'
#
# Requires: git, git-filter-repo.
set -euo pipefail

SOURCE_ORG="${SOURCE_ORG:-Bates-Solutions}"
SOURCE_REF="${SOURCE_REF:-main}"
if [ -n "${WORK_DIR:-}" ]; then
  KEEP_WORK_DIR=1
else
  WORK_DIR="$(mktemp -d)"
  KEEP_WORK_DIR=0
fi
PACKAGES=("$@")
if [ ${#PACKAGES[@]} -eq 0 ]; then
  PACKAGES=(squareup stripe clover)
fi

remote=""
cleanup() {
  if [ -n "$remote" ]; then git remote remove "$remote" 2>/dev/null || true; fi
  if [ "$KEEP_WORK_DIR" = 0 ]; then rm -rf "$WORK_DIR"; fi
}
trap cleanup EXIT

die() { echo "error: $*" >&2; exit 1; }

command -v git-filter-repo >/dev/null 2>&1 || die "git-filter-repo is not installed"

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
[ -z "$(git status --porcelain)" ] || die "working tree is not clean; commit or stash first"
BRANCH="$(git symbolic-ref --quiet --short HEAD)" || die "HEAD is detached; check out an import branch first"
[ "$BRANCH" != "main" ] || die "run this on an import branch, not main"

# The source tip merged by the most recent import or re-import of $1, if any.
last_imported_tip() {
  local merge
  merge="$(git log --merges --format=%H -1 -E --grep="^chore: (re-)?import $1 history$" HEAD)"
  [ -n "$merge" ] && git rev-parse "$merge^2"
}

for p in "${PACKAGES[@]}"; do
  src="$WORK_DIR/$p"
  echo "==> $p: cloning $SOURCE_ORG/$p ($SOURCE_REF)"
  rm -rf "$src"
  git clone --quiet --no-local --branch "$SOURCE_REF" "https://github.com/$SOURCE_ORG/$p.git" "$src"

  echo "==> $p: rewriting into packages/$p/ and renaming tags to $p-v*"
  git -C "$src" filter-repo --quiet --force \
    --to-subdirectory-filter "packages/$p" \
    --tag-rename "":"$p-"

  remote="import-$p"
  git remote remove "$remote" 2>/dev/null || true
  git remote add "$remote" "$src"
  git fetch --quiet --no-tags "$remote" "$SOURCE_REF"
  tip="$(git rev-parse "$remote/$SOURCE_REF")"

  if ! tag_out="$(git fetch "$remote" "refs/tags/$p-*:refs/tags/$p-*" 2>&1)"; then
    die "$p: could not fetch the renamed $p-v* tags; an upstream tag probably moved, which would mean overwriting one here. Investigate the source repo's tags before importing. git said:
$(printf '%s\n' "$tag_out" | grep -E 'rejected|error|fatal' | head -5)"
  fi

  prev="$(last_imported_tip "$p" || true)"
  if [ -n "$prev" ]; then
    git merge-base --is-ancestor "$prev" "$tip" \
      || die "$p: $SOURCE_REF was rewritten upstream (the previously imported tip $prev is not an ancestor of the new tip $tip). Refusing to merge a second copy of history."
    if [ "$prev" = "$tip" ] || git merge-base --is-ancestor "$tip" HEAD; then
      echo "==> $p: already up to date"
    else
      echo "==> $p: merging new commits"
      git merge --no-ff --no-edit -m "chore: re-import $p history" "$tip"
    fi
  else
    [ ! -e "packages/$p" ] || die "$p: packages/$p exists but no earlier 'chore: import $p history' merge was found; refusing a second first import"
    echo "==> $p: first import"
    git merge --no-ff --allow-unrelated-histories --no-edit -m "chore: import $p history" "$tip"
  fi

  git remote remove "$remote"
  remote=""
  echo "==> $p: $(git -C "$src" rev-list --count "$SOURCE_REF") commits in the source"
done

echo
echo "Done."
