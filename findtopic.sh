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
#   2. It then picks the best bet:
#        - FIRST preference: a lesson whose *filename* contains the keyword
#          (e.g. "array" -> 13-array-methods.js). The filename is the most
#          reliable signal of what a lesson actually teaches.
#        - Otherwise: the lesson with the most mentions.
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

# --- Step 2: pick the best bet ---
# Prefer a file whose NAME contains the keyword (strongest signal of the topic).
NAME_MATCH="$(echo "$RANKED" | cut -d: -f1 | grep -i -- "$KEYWORD" | head -1 || true)"

if [ -n "$NAME_MATCH" ]; then
  TOP_FILE="$NAME_MATCH"
  REASON="its filename matches '$KEYWORD' — this is almost certainly the topic's lesson"
else
  TOP_FILE="$(echo "$RANKED" | head -1 | cut -d: -f1)"
  REASON="it mentions '$KEYWORD' the most (no lesson is named after it, so this is a best guess — check the list above too)"
fi

echo ""
echo "Best bet: $(basename "$TOP_FILE")"
echo "  (chosen because $REASON)"

# --- Step 3: show the practice exercises in that lesson ---
echo ""
echo "Practice exercises in that lesson:"
if grep -q "PRACTICE" "$TOP_FILE"; then
  awk '/PRACTICE/{f=1} f{print "  "$0} f&&/\*\//{exit}' "$TOP_FILE"
else
  echo "  (No PRACTICE block found — open the file and read through it.)"
fi
