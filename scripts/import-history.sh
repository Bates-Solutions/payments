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
#   ON_CONFLICT  what to do when a merge conflicts on a path that is not in
#                scripts/import-removed-paths.txt: "abort" (default) runs
#                `git merge --abort` and stops; "stop" leaves that one merge in
#                progress so you can resolve it by hand (see below).
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
# Paths the monorepo removed (scripts/import-removed-paths.txt):
#   The monorepo deleted some imported files, such as each package's .github/,
#   package-lock.json and codecov.yml, because root files replace them. A source
#   commit that changes one of them would otherwise stop the merge with a
#   modify/delete conflict. For the listed paths only, the script keeps the
#   deletion: it resolves those modify/delete conflicts with `git rm`, and also
#   removes any file the merge newly adds under a listed directory (files the
#   monorepo itself keeps there are left alone). If such an added file has the
#   same content as a file the merge deletes elsewhere (a source move such as
#   `git mv CONTRIBUTING.md .github/`), it is treated as a conflict instead, so
#   the moved file is not silently lost. The merge
#   commit message stays "chore: re-import <name> history".
#   Merges run with rename detection off (-X no-renames). The root lockfile,
#   .gitignore and .prettierrc look like renames of the deleted package files, and
#   rename detection would carry source edits of those package files into the
#   root ones. The cost: a file the source renames while the monorepo also edited
#   it shows up as a delete plus an add, and needs a manual resolve.
#
# Any other conflict needs a person. The monorepo also edited some imported
# files (each package's package.json and tsconfig.json, squareup's typedoc.json,
# the CLAUDE.md files and the vitest.config.ts shims), so a source change to the
# same lines conflicts. By default the script then aborts that merge
# (`git merge --abort`), leaves the branch as it was before that package, and
# exits non-zero. To resolve by hand, re-run for that package with
# ON_CONFLICT=stop: the merge is left in progress with the removed paths already
# handled; fix the listed files, `git add` them, then commit with exactly
#   git commit -m "chore: re-import <name> history"
# (the message is how the next run finds the last imported tip), or give up
# with `git merge --abort`. In a package.json conflict, keep the monorepo's
# devDependencies (shared tools live in the root package.json; move a source bump
# of one there) and take the source's other changes. If dependencies changed,
# run `npm install` at the root afterwards and commit the root package-lock.json.
#
# It refuses, rather than merging a second copy of history, when:
#   - the source branch was rewritten (force-push) so the previously imported tip is
#     no longer an ancestor of it;
#   - packages/<name>/ exists but no earlier "import <name> history" merge is found;
#   - an upstream tag moved, so a renamed tag would have to be overwritten.
#
# If the script stops for any other reason while a merge is in progress, the
# exit trap aborts that merge, so no half-merged state is left behind.
#
# Tags are fetched locally but never pushed. Push them yourself after review:
#   git push origin 'refs/tags/squareup-v*' 'refs/tags/stripe-v*' 'refs/tags/clover-v*'
#
# Requires: git, git-filter-repo.
set -euo pipefail

SOURCE_ORG="${SOURCE_ORG:-Bates-Solutions}"
SOURCE_REF="${SOURCE_REF:-main}"
ON_CONFLICT="${ON_CONFLICT:-abort}"
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
merging=0
cleanup() {
  if [ "$merging" = 1 ] && git rev-parse -q --verify MERGE_HEAD >/dev/null 2>&1; then
    echo "error: stopped in the middle of a merge; running git merge --abort" >&2
    git merge --abort || echo "error: git merge --abort failed; run it yourself" >&2
  fi
  if [ -n "$remote" ]; then git remote remove "$remote" 2>/dev/null || true; fi
  if [ "$KEEP_WORK_DIR" = 0 ]; then rm -rf "$WORK_DIR"; fi
}
trap cleanup EXIT

die() { echo "error: $*" >&2; exit 1; }

case "$ON_CONFLICT" in abort | stop) ;; *) die "ON_CONFLICT must be abort or stop, not '$ON_CONFLICT'" ;; esac
command -v git-filter-repo >/dev/null 2>&1 || die "git-filter-repo is not installed"

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
[ -z "$(git status --porcelain)" ] || die "working tree is not clean; commit or stash first"
BRANCH="$(git symbolic-ref --quiet --short HEAD)" || die "HEAD is detached; check out an import branch first"
[ "$BRANCH" != "main" ] || die "run this on an import branch, not main"

REMOVED_LIST="$ROOT/scripts/import-removed-paths.txt"
REMOVED_PATHS=()
if [ -f "$REMOVED_LIST" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    case "$line" in '' | '#'*) continue ;; esac
    REMOVED_PATHS+=("$line")
  done <"$REMOVED_LIST"
fi

# True when $1 is listed in import-removed-paths.txt, or lies under a listed directory.
is_removed_path() {
  local e
  for e in ${REMOVED_PATHS[@]+"${REMOVED_PATHS[@]}"}; do
    case "$e" in
      */) case "$1" in "$e"*) return 0 ;; esac ;;
      *) [ "$1" = "$e" ] && return 0 ;;
    esac
  done
  return 1
}

# True when unmerged path $1 has an index entry at stage $2 (2 = ours, 3 = theirs).
has_stage() {
  local stages
  stages="$(git ls-files -u -z -- ":(literal)$1" | tr '\0' '\n' | awk '{print $3}')"
  grep -qx "$2" <<<"$stages"
}

# The source tip merged by the most recent import or re-import of $1, if any.
last_imported_tip() {
  local merge
  merge="$(git log --merges --format=%H -1 -E --grep="^chore: (re-)?import $1 history$" HEAD)"
  [ -n "$merge" ] && git rev-parse "$merge^2"
}

# Merge $2 for package $1 with message $3 (extra git merge args follow), keeping
# the removed paths removed. Commits on success; aborts or stops on any other conflict.
merge_tip() {
  local p="$1" tip="$2" msg="$3"
  shift 3
  local log="$WORK_DIR/merge-$p.log"
  merging=1
  # -X no-renames: the root package-lock.json, .gitignore and .prettierrc look
  # to git like renames of the per-package files we deleted, so with rename
  # detection a source change to packages/<name>/.prettierrc would silently land
  # in the root .prettierrc (and a lockfile change would conflict in the root lockfile).
  if ! git merge --no-ff --no-commit -X no-renames "$@" -m "$msg" "$tip" >"$log" 2>&1; then
    git rev-parse -q --verify MERGE_HEAD >/dev/null \
      || die "$p: git merge failed before it started. git said:
$(cat "$log")"
  fi

  local f kept=() other=()
  while IFS= read -r -d '' f; do
    # Keep our deletion only for a listed path that we deleted (no "ours" stage).
    if is_removed_path "$f" && ! has_stage "$f" 2; then
      kept+=("$f")
    else
      other+=("$f")
    fi
  done < <(git diff --name-only --diff-filter=U -z)
  if [ ${#kept[@]} -gt 0 ]; then
    git rm --quiet --force -- "${kept[@]}"
  fi

  # Files the source added under a removed directory merge cleanly; drop them too.
  # Only files this merge adds (relative to HEAD) are dropped: a file the monorepo
  # itself keeps under a listed path is left alone. Unmerged paths show as U, not A.
  # A source move of a kept file into a removed path (git mv CONTRIBUTING.md
  # .github/) shows as a delete plus an add under -X no-renames; dropping the add
  # would silently lose the file, so a dropped add whose blob matches a file this
  # merge deletes elsewhere is sent to a person instead.
  local e b added=() moved=()
  local -A deleted=()
  while IFS= read -r -d '' f; do
    is_removed_path "$f" || deleted["$(git rev-parse "HEAD:$f")"]="$f"
  done < <(git diff --cached --no-renames --name-only --diff-filter=D -z HEAD)
  for e in ${REMOVED_PATHS[@]+"${REMOVED_PATHS[@]}"}; do
    while IFS= read -r -d '' f; do
      b="$(git rev-parse ":$f")"
      if [ -n "${deleted[$b]:-}" ]; then
        moved+=("${deleted[$b]} -> $f")
        other+=("${deleted[$b]}" "$f")
      else
        added+=("$f")
      fi
    done < <(git diff --cached --no-renames --name-only --diff-filter=A -z HEAD -- ":(literal)$e" | sort -zu)
  done
  if [ ${#added[@]} -gt 0 ]; then
    git rm --quiet --force -- "${added[@]}"
  fi
  for f in ${moved[@]+"${moved[@]}"}; do
    echo "    source moved a kept file into a removed path, needs a person: $f" >&2
  done

  for f in ${kept[@]+"${kept[@]}"} ${added[@]+"${added[@]}"}; do
    echo "    kept removed: $f"
  done

  if [ ${#other[@]} -gt 0 ]; then
    local list
    list="$(git status --porcelain -- "${other[@]}" | sed 's/^/    /')"
    if [ "$ON_CONFLICT" = stop ]; then
      merging=0
      echo "==> $p: merge stopped for a manual resolve. Conflicts outside import-removed-paths.txt:" >&2
      echo "$list" >&2
      echo "    Resolve them, git add the files, then run exactly:" >&2
      echo "      git commit -m \"$msg\"" >&2
      echo "    Or give up with: git merge --abort" >&2
      echo "    Packages after $p in this run were not processed." >&2
      exit 2
    fi
    git merge --abort
    merging=0
    die "$p: the merge conflicts outside scripts/import-removed-paths.txt, so it was aborted and the branch is unchanged for $p:
$list
These are usually files the monorepo edited (package.json, tsconfig.json, ...). To resolve by hand, run:
  ON_CONFLICT=stop scripts/import-history.sh $p
Packages after $p in this run were not processed."
  fi

  git commit --quiet -m "$msg"
  merging=0
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
      merge_tip "$p" "$tip" "chore: re-import $p history"
    fi
  else
    [ ! -e "packages/$p" ] || die "$p: packages/$p exists but no earlier 'chore: import $p history' merge was found; refusing a second first import"
    echo "==> $p: first import"
    merge_tip "$p" "$tip" "chore: import $p history" --allow-unrelated-histories
  fi

  git remote remove "$remote"
  remote=""
  echo "==> $p: $(git -C "$src" rev-list --count "$SOURCE_REF") commits in the source"
done

echo
echo "Done."
