#!/bin/sh
# Fail when the GitHub Pages copy at the repo root drifts from src/.
# src/ is the source of truth. Compared files are top-level .html, .css, and .js.
# src/.codepen/ and root-only files (README, LICENSE, .gitignore, .nojekyll, …) are skipped.
set -eu

cd "$(dirname "$0")/.."

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT INT TERM

list_kit() {
  dir=$1
  for ext in html css js; do
    for f in "$dir"/*."$ext"; do
      [ -f "$f" ] || continue
      basename "$f"
    done
  done | sort -u
}

list_kit . >"$tmpdir/root"
list_kit ./src >"$tmpdir/src"

comm -23 "$tmpdir/root" "$tmpdir/src" >"$tmpdir/only-root"
comm -13 "$tmpdir/root" "$tmpdir/src" >"$tmpdir/only-src"
comm -12 "$tmpdir/root" "$tmpdir/src" >"$tmpdir/shared"

status=0

if [ -s "$tmpdir/only-root" ]; then
  status=1
  echo "kit files only at repo root (missing under src/):"
  while IFS= read -r name; do
    printf '  %s\n' "$name"
  done <"$tmpdir/only-root"
  echo
fi

if [ -s "$tmpdir/only-src" ]; then
  status=1
  echo "kit files only under src/ (missing at repo root):"
  while IFS= read -r name; do
    printf '  %s\n' "$name"
  done <"$tmpdir/only-src"
  echo
fi

while IFS= read -r name; do
  [ -n "$name" ] || continue
  if ! cmp -s "./$name" "./src/$name"; then
    status=1
    echo "differs: $name"
    diff -u "./src/$name" "./$name" || true
    echo
  fi
done <"$tmpdir/shared"

if [ "$status" -ne 0 ]; then
  echo "publish copy is out of sync with src/."
  echo "src/ is the source of truth. Copy the changed kit file to the repo root (or back into src/ if the root edit is the one to keep), then run this check again."
  exit 1
fi

count=$(wc -l <"$tmpdir/shared" | tr -d ' ')
echo "publish copy matches src/ ($count kit files)."
exit 0
