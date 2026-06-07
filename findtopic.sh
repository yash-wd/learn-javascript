#!/usr/bin/env bash
#
# findtopic.sh — locate which lesson teaches a topic, and its practice exercises.
#
# Usage:
#   ./findtopic.sh reduce
#   ./findtopic.sh "async"
#
# It ranks lesson files by how often the keyword appears (the file with the
# most matches is almost always the one that *teaches* the topic), then prints
# the PRACTICE block from the top file so you know exactly where to practice.

set -euo pipefail

# Resolve the lessons directory relative to THIS script, so it works no matter
# where you run it from.
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

echo "Best lesson files for '$KEYWORD' (ranked by mentions):"
RANKED="$(grep -rc "$KEYWORD" "$LESSONS_DIR" | grep -v ':0$' | sort -t: -k2 -rn || true)"

if [ -z "$RANKED" ]; then
  echo "  No lessons mention '$KEYWORD'. Try a different keyword."
  exit 0
fi

echo "$RANKED" | head -5 | sed 's/^/  /'

TOP_FILE="$(echo "$RANKED" | head -1 | cut -d: -f1)"

echo ""
echo "Top match: $TOP_FILE"
echo ""
echo "Practice exercises in that lesson:"
if grep -q "PRACTICE" "$TOP_FILE"; then
  # Print from the PRACTICE marker to the end of that comment block.
  awk '/PRACTICE/{f=1} f{print "  "$0} f&&/\*\//{exit}' "$TOP_FILE"
else
  echo "  (No PRACTICE block found — open the file and read through it.)"
fi
