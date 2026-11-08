#!/usr/bin/env bash
# Import (or re-import) the history of the provider repos into packages/<name>/.
#
# Usage, from the root of a payments checkout on the import branch:
#   scripts/import-history.sh [package ...]      # default: squareup stripe clover
#
# Environment:
#   SOURCE_ORG   GitHub org to clone from (default Bates-Solutions)
#   SOURCE_REF   branch to import from each repo (default main)
#   WORK_DIR     scratch dir for the filtered clones (default: a new mktemp dir)
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
# Tags are fetched locally but never pushed. Push them yourself after review:
#   git push origin 'refs/tags/squareup-v*' 'refs/tags/stripe-v*' 'refs/tags/clover-v*'
#
# Requires: git, git-filter-repo.
set -euo pipefail

SOURCE_ORG="${SOURCE_ORG:-Bates-Solutions}"
SOURCE_REF="${SOURCE_REF:-main}"
WORK_DIR="${WORK_DIR:-$(mktemp -d)}"
PACKAGES=("$@")
[ ${#PACKAGES[@]} -eq 0 ] && PACKAGES=(squareup stripe clover)

command -v git-filter-repo >/dev/null 2>&1 || { echo "git-filter-repo is not installed" >&2; exit 1; }

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean; commit or stash first." >&2
  exit 1
fi
BRANCH="$(git symbolic-ref --short HEAD)"
if [ "$BRANCH" = "main" ]; then
  echo "Run this on an import branch, not main." >&2
  exit 1
fi

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
  git fetch --quiet "$remote" "refs/tags/$p-*:refs/tags/$p-*"

  if git merge-base --is-ancestor "$remote/$SOURCE_REF" HEAD 2>/dev/null; then
    echo "==> $p: already up to date"
  elif git merge-base HEAD "$remote/$SOURCE_REF" >/dev/null 2>&1; then
    echo "==> $p: merging new commits"
    git merge --no-ff --no-edit -m "chore: re-import $p history" "$remote/$SOURCE_REF"
  else
    echo "==> $p: first import"
    git merge --no-ff --allow-unrelated-histories --no-edit -m "chore: import $p history" "$remote/$SOURCE_REF"
  fi

  git remote remove "$remote"
  src_count="$(git -C "$src" rev-list --count "$SOURCE_REF")"
  echo "==> $p: $src_count commits in the source"
done

echo
echo "Done. Scratch clones are in $WORK_DIR (safe to delete)."
