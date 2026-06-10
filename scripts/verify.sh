#!/usr/bin/env bash
# =============================================================================
# verify.sh — full repo health check. Run before every commit; also runs in CI.
#   bash scripts/verify.sh
# Exits non-zero if anything is wrong. See CLAUDE.md for the sync rules.
# =============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."
status=0

# Lessons that legitimately need the network (don't fail CI if the API hiccups).
NETWORK_LESSONS="25"

echo "▶ Running all lessons…"
for f in lessons/[0-9]*.js; do
  num="$(basename "$f" | cut -c1-2)"
  if timeout 30 node "$f" >/dev/null 2>&1; then
    :
  elif echo "$NETWORK_LESSONS" | grep -qw "$num"; then
    echo "  ⚠ $f failed (needs network — not fatal)"
  else
    echo "  ✗ FAIL: $f"; status=1
  fi
done
[ $status -eq 0 ] && echo "  ✓ all $(ls lessons/[0-9]*.js | wc -l | tr -d ' ') lessons exit 0"

echo "▶ Verifying every lesson's \`// =>\` output comments…"
node tools/check-outputs.mjs || status=1

echo "▶ Running the test suites…"
# Single source of truth for the test list: package.json's "test" script.
# (Run it directly with `npm test` to see per-suite detail.)
npm test --silent >/dev/null 2>&1 && echo "  ✓ all tests pass" \
  || { echo "  ✗ tests failed (run: npm test)"; status=1; }

echo "▶ Syntax-checking project & solution JS…"
parse_ok=1
for f in projects/*/app.js projects/*/server.js projects/*/solution.js lessons/solutions/*.js practice/*.mjs; do
  [ -e "$f" ] || continue
  node --check "$f" 2>/dev/null || { echo "  ✗ parse error: $f"; parse_ok=0; status=1; }
done
[ $parse_ok -eq 1 ] && echo "  ✓ all project & solution files parse"

echo "▶ Checking the bundle is in sync…"
node tools/build-bundle.mjs >/dev/null 2>&1
if git diff --quiet -- bundle/JS_Learn_Everything.md; then
  echo "  ✓ bundle .md matches sources"
else
  echo "  ✗ bundle .md is stale — run: node tools/build-bundle.mjs (then regen the PDF)"; status=1
fi

echo "▶ Checking generated browser assets are in sync…"
node tools/build-search-index.mjs >/dev/null 2>&1
if git diff --quiet -- assets/search-index.js assets/lesson-sources.js assets/lessons-manifest.js assets/solution-sources.js; then
  echo "  ✓ search-index / lesson-sources / manifest / solution-sources match sources"
else
  echo "  ✗ generated assets are stale — run: npm run search-index"; status=1
fi

echo "▶ Checking counts line up…"
L=$(ls lessons/[0-9]*.js | wc -l | tr -d ' ')
S=$(ls lessons/solutions/*.js | wc -l | tr -d ' ')
C=$(grep -o 'lessons/[0-9][0-9]-[a-z-]*\.js' curriculum.html | sort -u | wc -l | tr -d ' ')
P=$(ls -d projects/[0-9]* | wc -l | tr -d ' ')
PC=$(grep -c 'class="project"' curriculum.html | tr -d ' ')
echo "  lessons=$L solutions=$S curriculum-links=$C · projects=$P cards=$PC"
{ [ "$L" = "$S" ] && [ "$L" = "$C" ]; } || { echo "  ✗ lesson counts disagree"; status=1; }
[ "$P" = "$PC" ] || { echo "  ✗ project counts disagree"; status=1; }

echo "▶ Scanning for stale project counts…"
if grep -rniIq "5 real project\|these five project\|build all five" README.md projects curriculum.html 2>/dev/null; then
  echo "  ✗ found a stale '5 projects' reference"; status=1
else
  echo "  ✓ none"
fi

echo
if [ $status -eq 0 ]; then echo "✅ ALL CHECKS PASSED"; else echo "❌ CHECKS FAILED"; fi
exit $status
