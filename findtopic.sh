#!/usr/bin/env bash
#
# findtopic.sh — locate which lesson teaches a topic, and its practice exercises.
#
# Usage:
#   ./findtopic.sh reduce
#   ./findtopic.sh "async"
#
# How it decides which lesson is "the one":
#   It ranks candidates by SIGNAL STRENGTH, not by raw word count — so a file
#   where you happened to write the keyword a lot (e.g. your own practice code)
#   can't beat the lesson that actually teaches the topic. The signals, strongest
#   first:
#     a. [CONFIRMED] filename match — the keyword is in the lesson's *filename*,
#        the canonical slug for the topic (e.g. "array" -> 12-arrays.js).
#     b. [CONFIRMED] title match — the keyword is in the lesson's TITLE header
#        (the "NN · TOPIC ..." block + "WHAT YOU'LL LEARN" at the top). This is
#        curated, so adding practice code to a file never changes it.
#     c. [BEST GUESS] most mentions — only when nothing above matches. This is
#        the one signal your own code *could* skew, so it's clearly labelled.
#
# It also prints:
#   * the full list of every lesson mentioning the keyword (so you can verify),
#   * the best bet's PRACTICE exercises,
#   * OTHER RECOMMENDED lessons that also teach/use the topic (a "see also").

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

# True if the keyword is in the file's NAME.
is_name_match() { basename "$1" | grep -iq -- "$KEYWORD"; }
# True if the keyword is in the file's TITLE header (top comment block, the part
# before the first "*/"). This is the curated description of the lesson.
is_title_match() { awk '/\*\//{exit} {print}' "$1" | grep -iq -- "$KEYWORD"; }

# --- Step 1: list every lesson that mentions the keyword, ranked by count ---
echo "Lessons mentioning '$KEYWORD' (ranked by how often it appears):"
RANKED="$(grep -rc -- "$KEYWORD" "$LESSONS_DIR" | grep -v ':0$' | sort -t: -k2 -rn || true)"

if [ -z "$RANKED" ]; then
  echo "  No lessons mention '$KEYWORD'. Try a different keyword."
  exit 0
fi

echo "$RANKED" | sed 's/^/  /'

CANDIDATES="$(echo "$RANKED" | cut -d: -f1)"

# --- Step 2: classify candidates by signal strength (count order preserved) ---
NAME_MATCHES=""   # keyword in filename
TITLE_MATCHES=""  # keyword in title header (but not filename)
while IFS= read -r f; do
  [ -z "$f" ] && continue
  if is_name_match "$f"; then
    NAME_MATCHES+="$f"$'\n'
  elif is_title_match "$f"; then
    TITLE_MATCHES+="$f"$'\n'
  fi
done <<< "$CANDIDATES"

# Strong matches = lessons that genuinely teach the topic (name or title).
STRONG="$(printf '%s%s' "$NAME_MATCHES" "$TITLE_MATCHES")"

# --- Pick the best bet, strongest signal first ---
if [ -n "$NAME_MATCHES" ]; then
  TOP_FILE="$(echo "$NAME_MATCHES" | head -1)"
  CONFIDENCE="CONFIRMED"
  REASON="'$KEYWORD' is in this lesson's filename — the canonical name for this topic"
elif [ -n "$TITLE_MATCHES" ]; then
  TOP_FILE="$(echo "$TITLE_MATCHES" | head -1)"
  CONFIDENCE="CONFIRMED"
  REASON="'$KEYWORD' is in this lesson's title — this lesson teaches it"
else
  TOP_FILE="$(echo "$RANKED" | head -1 | cut -d: -f1)"
  CONFIDENCE="BEST GUESS"
  REASON="no lesson's title or name matches '$KEYWORD', so this is just the one that mentions it most — your own practice code could skew this, so check the list above"
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

# --- Step 4: other recommended lessons (a "see also") ---
echo ""
echo "Other recommended lessons:"
SHOWN=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ "$f" = "$TOP_FILE" ] && continue
  if is_name_match "$f"; then
    why="name matches"
  else
    why="teaches it (in title)"
  fi
  echo "  - $(basename "$f")  ($why)"
  SHOWN=$((SHOWN + 1))
  [ "$SHOWN" -ge 4 ] && break
done <<< "$STRONG"

if [ "$SHOWN" -eq 0 ]; then
  # No other strong matches — offer the next files by count, clearly hedged.
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    [ "$f" = "$TOP_FILE" ] && continue
    echo "  - $(basename "$f")  (only mentions it — may just use the topic in passing)"
    SHOWN=$((SHOWN + 1))
    [ "$SHOWN" -ge 3 ] && break
  done <<< "$CANDIDATES"
fi

if [ "$SHOWN" -eq 0 ]; then
  echo "  (none — this is the only lesson involving '$KEYWORD')"
fi
