#!/usr/bin/env bash
#
# findtopic.sh — locate which lesson teaches a topic, and its practice exercises.
#
# Usage:
#   ./findtopic.sh reduce
#   ./findtopic.sh "async"
#
# How it decides which lesson is "the one":
#   1. It lists EVERY lesson that mentions the keyword, ranked by how often it
#      appears (so you can see the full picture, not just one guess).
#   2. It then picks the best bet, in order of how trustworthy the signal is:
#        a. CONFIRMED — the keyword is in the lesson's *filename* (the canonical
#           topic slug, e.g. "array" -> 12-arrays.js). Most specific signal.
#        b. CONFIRMED — the keyword is in the lesson's TITLE header (the
#           "NN · TOPIC — ..." block at the top). Used when no filename matches
#           (e.g. "reduce" is in lesson 13's title but no file is named for it).
#        c. BEST GUESS — neither matched, so it falls back to the lesson with
#           the most mentions. Check the full list above too.
#   3. It prints that lesson's PRACTICE exercises.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LESSONS_DIR="$SCRIPT_DIR/lessons"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <topic-keyword>"
  echo "Example: $0 reduce"
  exit 1
fi

KEYWORD="$1"

if [ ! -d "$LESSONS_DIR" ]; then
  echo "Could not find lessons directory at: $LESSONS_DIR"
  exit 1
fi

# --- Step 1: list every lesson that mentions the keyword, ranked by count ---
echo "Lessons mentioning '$KEYWORD' (ranked by how often it appears):"
RANKED="$(grep -rc -- "$KEYWORD" "$LESSONS_DIR" | grep -v ':0$' | sort -t: -k2 -rn || true)"

if [ -z "$RANKED" ]; then
  echo "  No lessons mention '$KEYWORD'. Try a different keyword."
  exit 0
fi

echo "$RANKED" | sed 's/^/  /'

# --- Step 2: pick the best bet, strongest signal first ---
CANDIDATES="$(echo "$RANKED" | cut -d: -f1)"

# (a) keyword in the TITLE header — the top comment block, before the first */.
#     This is what the lesson is literally about, so it's the most trustworthy.
TITLE_MATCH=""
while IFS= read -r f; do
  [ -z "$f" ] && continue
  if awk '/\*\//{exit} {print}' "$f" | grep -iq -- "$KEYWORD"; then
    TITLE_MATCH="$f"
    break
  fi
done <<< "$CANDIDATES"

# (b) keyword in the filename.
NAME_MATCH="$(echo "$CANDIDATES" | grep -i -- "$KEYWORD" | head -1 || true)"

if [ -n "$NAME_MATCH" ]; then
  TOP_FILE="$NAME_MATCH"
  CONFIDENCE="CONFIRMED"
  REASON="'$KEYWORD' is in this lesson's filename — the canonical name for this topic"
elif [ -n "$TITLE_MATCH" ]; then
  TOP_FILE="$TITLE_MATCH"
  CONFIDENCE="CONFIRMED"
  REASON="'$KEYWORD' is in this lesson's title — this lesson teaches it"
else
  TOP_FILE="$(echo "$RANKED" | head -1 | cut -d: -f1)"
  CONFIDENCE="BEST GUESS"
  REASON="no lesson's title or name matches '$KEYWORD', so this is the one that mentions it most — check the list above too"
fi

echo ""
echo "Best bet [$CONFIDENCE]: $(basename "$TOP_FILE")"
echo "  ($REASON)"

# --- Step 3: show the practice exercises in that lesson ---
echo ""
echo "Practice exercises in that lesson:"
if grep -q "PRACTICE" "$TOP_FILE"; then
  awk '/PRACTICE/{f=1} f{print "  "$0} f&&/\*\//{exit}' "$TOP_FILE"
else
  echo "  (No PRACTICE block found — open the file and read through it.)"
fi
