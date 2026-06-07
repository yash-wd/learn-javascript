#!/usr/bin/env bash
#
# findtopic.sh — find which lesson teaches a topic, and where to practice it.
#
# Usage:
#   ./findtopic.sh reduce
#   ./findtopic.sh "async"
#   ./findtopic.sh --word map      # whole-word match: "map" but not "weakmap"
#
# HOW IT RANKS (a scoring checklist, NOT "first filename/title wins"):
#   Every lesson has the same shape — a title header, a "WHAT YOU'LL LEARN"
#   list, and a "PRACTICE" block. The script scores each lesson by WHERE the
#   keyword shows up, because location tells you how central the topic is:
#
#       +5  in the TITLE line   (NN · TOPIC ...)   the lesson's subject
#       +3  in WHAT YOU'LL LEARN                   an explicit learning goal
#       +3  in the PRACTICE block                  you can drill it here
#       +2  in the FILENAME                        the canonical topic slug
#       +1  anywhere in the body (presence only)   weakest — and capped, so
#                                                   your own practice code can
#                                                   never out-vote the signals
#                                                   above
#
#   Lessons are ranked by total score. A lesson that only appears in the body
#   (score 1) is a [BEST GUESS]; anything with a real signal is [CONFIRMED].
#
# It then prints: the best bet's PRACTICE, every PRACTICE exercise that mentions
# the keyword (so you know exactly where to drill), and other lessons that
# genuinely teach it — never a random file that just mentions it in passing.

set -euo pipefail

# --- arguments: optional --word/-w flag, then the keyword ---
WORD=0
KEYWORD=""
for a in "$@"; do
  case "$a" in
    -w|--word) WORD=1 ;;
    -h|--help)
      grep '^#' "$0" | grep -v '^#!' | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) [ -z "$KEYWORD" ] && KEYWORD="$a" ;;
  esac
done

if [ -z "$KEYWORD" ]; then
  echo "Usage: $0 [--word] <topic-keyword>"
  echo "Example: $0 reduce        |  $0 --word map"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LESSONS_DIR="$SCRIPT_DIR/lessons"
[ -d "$LESSONS_DIR" ] || { echo "No lessons dir at: $LESSONS_DIR"; exit 1; }

# grep flags: case-insensitive, plus whole-word when --word is set.
if [ "$WORD" = "1" ]; then GFLAGS="-iw"; MODE="whole-word"; else GFLAGS="-i"; MODE="substring"; fi

# --- zone extractors (each prints one section of a lesson file) ---
zone_title()    { awk '/·/{print; exit}' "$1"; }                                   # the "NN · TOPIC" line
zone_learn()    { awk "/WHAT YOU'LL LEARN/{f=1;next} f&&/\\*\\//{exit} f{print}" "$1"; }
zone_practice() { awk '/PRACTICE/{f=1} f{print} f&&/\*\//{exit}' "$1"; }

has() { grep -q $GFLAGS -- "$KEYWORD"; }   # reads stdin; 0 if keyword present

# --- score one lesson: prints "score|count|signals|file" ---
score_file() {
  local f="$1" s=0 sig=""
  if zone_title    "$f" | has; then s=$((s+5)); sig="$sig,title";    fi
  if zone_learn    "$f" | has; then s=$((s+3)); sig="$sig,learn";    fi
  if zone_practice "$f" | has; then s=$((s+3)); sig="$sig,practice"; fi
  if basename "$f" | has;      then s=$((s+2)); sig="$sig,name";     fi
  local c; c=$(grep -c $GFLAGS -- "$KEYWORD" "$f" 2>/dev/null || true); c=${c:-0}
  if [ "$c" -gt 0 ]; then s=$((s+1)); fi
  sig="${sig#,}"; [ -z "$sig" ] && sig="body"
  printf '%s|%s|%s|%s\n' "$s" "$c" "$sig" "$f"
}

# --- find candidate lessons (top-level lesson sheets only) ---
FILES="$(grep -l $GFLAGS -- "$KEYWORD" "$LESSONS_DIR"/*.js 2>/dev/null || true)"
if [ -z "$FILES" ]; then
  echo "No lesson contains '$KEYWORD' ($MODE match). Try another keyword, or drop --word."
  exit 0
fi

RESULTS="$(while IFS= read -r f; do [ -n "$f" ] && score_file "$f"; done <<< "$FILES" \
          | sort -t'|' -k1,1rn -k2,2rn)"

# --- ranked table ---
echo "Lessons for '$KEYWORD' ($MODE), ranked by how central the topic is:"
printf "  %-5s  %-26s  %s\n" "score" "matched in" "lesson"
while IFS='|' read -r s c sig f; do
  [ -z "$f" ] && continue
  printf "  %-5s  %-26s  %s\n" "$s" "${sig//,/, }" "$(basename "$f")"
done <<< "$RESULTS"

# --- best bet ---
IFS='|' read -r BS BC BSIG BF <<< "$(echo "$RESULTS" | head -1)"
if [ "$BSIG" = "body" ]; then
  CONF="BEST GUESS"
  NOTE="only appears in the body — no title/learn/practice/name match, so this is a guess; check the table above"
else
  CONF="CONFIRMED"
  NOTE="matched in: ${BSIG//,/, }"
fi
echo ""
echo "Best bet [$CONF]: $(basename "$BF")"
echo "  ($NOTE)"

# --- best bet's PRACTICE block ---
echo ""
echo "Practice exercises in $(basename "$BF"):"
if grep -q "PRACTICE" "$BF"; then
  zone_practice "$BF" | sed 's/^/  /'
else
  echo "  (No PRACTICE block found — open the file and read through it.)"
fi

# --- (D) every PRACTICE exercise that mentions the keyword, across lessons ---
echo ""
echo "Where you can practice '$KEYWORD' (matching exercises):"
PFOUND=0
while IFS='|' read -r s c sig f; do
  [ -z "$f" ] && continue
  case ",$sig," in *,practice,*)
    line="$(zone_practice "$f" | grep -n $GFLAGS -- "$KEYWORD" | sed 's/^/      /')"
    echo "  $(basename "$f"):"
    echo "$line"
    PFOUND=1 ;;
  esac
done <<< "$RESULTS"
if [ "$PFOUND" = "0" ]; then
  echo "  (no PRACTICE exercise names it directly — use the best bet's practice above)"
fi

# --- (B) other recommended lessons: must genuinely teach it, never random ---
echo ""
echo "Other recommended lessons (also teach '$KEYWORD'):"
RFOUND=0; RMORE=0
while IFS='|' read -r s c sig f; do
  [ -z "$f" ] && continue
  [ "$f" = "$BF" ] && continue
  [ "$sig" = "body" ] && continue          # skip files that only mention it
  if [ "$RFOUND" -lt 6 ]; then
    echo "  - $(basename "$f")  (matched in: ${sig//,/, })"
  else
    RMORE=$((RMORE + 1))
  fi
  RFOUND=$((RFOUND + 1))
done <<< "$RESULTS"
if [ "$RFOUND" = "0" ]; then
  echo "  (none — no other lesson specifically teaches '$KEYWORD')"
elif [ "$RMORE" -gt 0 ]; then
  echo "  ...and $RMORE more (see the full ranked table above)"
fi
