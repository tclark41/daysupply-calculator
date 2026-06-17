#!/usr/bin/env bash
#
# publish.sh — update & publish the day-supply calculator in one step.
#
#   1. runs the tests (aborts if products.js is broken)
#   2. auto-bumps the service-worker cache version IF a cached asset changed
#      (so installed iPhones pick up the new data; skipped for docs-only edits)
#   3. shows what will change, asks to confirm
#   4. commits + pushes -> GitHub Pages rebuilds in ~1 min
#
# Usage:
#   ./publish.sh "Confirmed Lantus + ProAir NDCs"   # commit message
#   ./publish.sh                                     # default message
#   ./publish.sh -y "message"                        # skip the confirm prompt
#
set -euo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---- parse args: optional -y/--yes flag, optional commit message ----
YES=0
MSG=""
for arg in "$@"; do
  case "$arg" in
    -y|--yes) YES=1 ;;
    *) MSG="$arg" ;;
  esac
done

LIVE_URL="https://tclark41.github.io/daysupply-calculator/"
CACHED_RE='^(index\.html|calc\.js|products\.js|manifest\.webmanifest|icon-[0-9]+\.png)$'

# ---- 0. sanity: on main branch ----
branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" != "main" ]; then
  echo "✗ On branch '$branch', not 'main'. Switch to main before publishing." >&2
  exit 1
fi

# ---- 1. tests (guards against a broken products.js) ----
echo "▶ Running tests..."
if ! test_out="$(node test.js)"; then
  echo "$test_out"
  echo "✗ Tests failed — nothing published." >&2
  exit 1
fi
echo "  $(echo "$test_out" | grep -E 'passed|failed')"

# ---- 2. anything to publish? ----
if [ -z "$(git status --porcelain)" ]; then
  echo "✓ Working tree clean — nothing to publish."
  exit 0
fi

# ---- 3. auto cache-bump if a cached asset changed ----
changed="$(git status --porcelain | sed 's/^...//')"
if echo "$changed" | grep -qE "$CACHED_RE"; then
  cur="$(grep -oE 'daysupply-v[0-9]+' sw.js | head -1 | grep -oE '[0-9]+')"
  next=$((cur + 1))
  sed -i "s/daysupply-v${cur}/daysupply-v${next}/" sw.js
  echo "↑ Service-worker cache: daysupply-v${cur} → daysupply-v${next} (phones will refresh)"
  # Stamp today's date into the footer "Data updated" line.
  today="$(date +%F)"
  sed -i "s/updated: \"[0-9-]*\"/updated: \"${today}\"/" products.js
  echo "↑ Footer 'Data updated' date → ${today}"
else
  echo "· No cached assets changed — service-worker cache left as-is."
fi

# ---- 4. stage + show what will be published ----
git add -A
echo
echo "Changes to publish:"
git diff --cached --stat

# ---- 5. confirm ----
if [ "$YES" != 1 ]; then
  if [ ! -t 0 ]; then
    echo "✗ Not a terminal and -y not given — aborting for safety." >&2
    exit 1
  fi
  read -r -p $'\nPublish to GitHub Pages? [Y/n] ' ans
  case "$ans" in
    [nN]*) echo "Aborted (changes are staged; nothing pushed)."; exit 1 ;;
  esac
fi

# ---- 6. commit + push ----
msg="${MSG:-Update product data ($(date +%F))}"
git commit -q -m "$msg"
git push -q origin main

echo
echo "✓ Published: $msg"
echo "  GitHub Pages will rebuild in ~1 min → $LIVE_URL"
echo "  (On an installed iPhone, reopen the app while online once to pick up the update.)"
