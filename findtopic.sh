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

# --- arguments: optional flags, then the keyword ---
WORD=0
VERBOSE=0
KEYWORD=""
for a in "$@"; do
  case "$a" in
    -w|--word) WORD=1 ;;
    -v|--verbose|--all) VERBOSE=1 ;;
    -h|--help)
      # print only the leading doc block (stop at the first non-comment line)
      awk 'NR==1 && /^#!/ {next} /^#/ {sub(/^# ?/,""); print; next} {exit}' "$0"
      exit 0 ;;
    *) [ -z "$KEYWORD" ] && KEYWORD="$a" ;;
  esac
done

if [ -z "$KEYWORD" ]; then
  echo "Usage: $0 [--word] [--verbose] <topic-keyword>"
  echo "Example: $0 reduce   |   $0 --word map   |   $0 -v scope"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LESSONS_DIR="$SCRIPT_DIR/lessons"
[ -d "$LESSONS_DIR" ] || { echo "No lessons dir at: $LESSONS_DIR"; exit 1; }

# grep flags: case-insensitive + fixed-string (so a keyword like "." or "[" is
# matched literally, never as a regex), plus whole-word when --word is set.
if [ "$WORD" = "1" ]; then GFLAGS="-iwF"; MODE="whole-word"; else GFLAGS="-iF"; MODE="substring"; fi

# --- zone extractors (each prints one section of a lesson file) ---
zone_title()    { awk '/·/{print; exit}' "$1"; }                                   # the "NN · TOPIC" line
zone_learn()    { awk "/WHAT YOU'LL LEARN/{f=1;next} f&&/\\*\\//{exit} f{print}" "$1"; }
zone_practice() { awk '/PRACTICE/{f=1} f{print} f&&/\*\//{exit}' "$1"; }

# Practice block with the comment scaffolding stripped, for clean display:
# drops the "/* PRACTICE", the dashed dividers and the closing "*/", and the
# leading " * " on each line — leaving just the numbered exercises.
clean_practice() {
  zone_practice "$1" \
    | grep -vE '(PRACTICE|^[[:space:]]*\*?[[:space:]]*-{5,})' \
    | sed -E 's#^[[:space:]]*\*/?##; s#[[:space:]]*\*/[[:space:]]*$##' \
    | sed -E '/^[[:space:]]*$/d' \
    | sed -E 's/^   //'                # dedent the lesson's own 3-space indent
}

has() { grep -q $GFLAGS -- "$KEYWORD"; }   # reads stdin; 0 if keyword present

# How to actually run a lesson: use its own "Run:" header line, flag browser-only
# lessons, and otherwise fall back to the standard node command.
run_hint() {
  local f="$1" hdr line
  hdr="$(awk '/\*\//{exit}{print}' "$f")"
  if echo "$hdr" | grep -qiE 'browser only|\(browser\)'; then
    echo "open index.html in a browser, then DevTools (F12) → Console"
    return
  fi
  line="$(echo "$hdr" | grep -m1 -iE '[[:space:]]Run:' | sed -E 's#.*[Rr]un:[[:space:]]*##')"
  [ -n "$line" ] && echo "$line" || echo "node lessons/$(basename "$f")"
}

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

# --- best bet (top of the ranked results) ---
IFS='|' read -r BS BC BSIG BF <<< "$(echo "$RESULTS" | head -1)"
if [ "$BSIG" = "body" ]; then CONF="BEST GUESS"; else CONF="CONFIRMED"; fi
TOTAL="$(echo "$RESULTS" | grep -c '|' || true)"

# Count the "strong" lessons (a real signal, not body-only) for the summaries.
STRONG="$(echo "$RESULTS" | awk -F'|' '$3!="body"')"
STRONG_OTHERS="$(echo "$STRONG" | awk -F'|' -v bf="$BF" '$4!=bf')"

# =============================== HEADLINE ===================================
echo ""
echo "  $KEYWORD  →  $(basename "$BF")   [$CONF: ${BSIG//,/, }]"
echo "  run:  $(run_hint "$BF")"

# =============================== PRACTICE ==================================
echo ""
echo "  Practice here:"
if grep -q "PRACTICE" "$BF"; then
  clean_practice "$BF" | sed 's/^/    /'
else
  echo "    (open the file and read through it — no PRACTICE block found)"
fi

# =========================== ALSO TEACHES IT ===============================
if [ -n "$STRONG_OTHERS" ]; then
  echo ""
  echo "  Also teaches \"$KEYWORD\":"
  shown=0; more=0
  while IFS='|' read -r s c sig f; do
    [ -z "$f" ] && continue
    if [ "$shown" -lt 4 ]; then
      echo "    - $(basename "$f")  (${sig//,/, })"
    else
      more=$((more + 1))
    fi
    shown=$((shown + 1))
  done <<< "$STRONG_OTHERS"
  [ "$more" -gt 0 ] && echo "    - ...and $more more"
fi

# =============================== FOOTER ====================================
echo ""
if [ "$VERBOSE" = "1" ]; then
  echo "  ── full breakdown ($TOTAL lessons mention \"$KEYWORD\", $MODE) ──"
  printf "    %-5s  %-24s  %s\n" "score" "matched in" "lesson"
  while IFS='|' read -r s c sig f; do
    [ -z "$f" ] && continue
    printf "    %-5s  %-24s  %s\n" "$s" "${sig//,/, }" "$(basename "$f")"
  done <<< "$RESULTS"

  # (D) every PRACTICE exercise that names the keyword, across all lessons.
  echo ""
  echo "  Matching practice exercises across all lessons:"
  pfound=0
  while IFS='|' read -r s c sig f; do
    [ -z "$f" ] && continue
    case ",$sig," in *,practice,*)
      echo "    $(basename "$f"):"
      zone_practice "$f" | grep $GFLAGS -- "$KEYWORD" | sed -E 's#^[[:space:]]*\*?[[:space:]]*#      • #'
      pfound=1 ;;
    esac
  done <<< "$RESULTS"
  [ "$pfound" = "0" ] && echo "    (none name it directly)"
else
  # Default footer: list WHICH lessons mention the keyword (names + where it
  # matched), not just a bare count. The full scored table + every matching
  # practice line stay behind -v, so this is the "show me which, briefly" tier.
  echo "  All $TOTAL lessons that mention \"$KEYWORD\" ($MODE):"
  while IFS='|' read -r s c sig f; do
    [ -z "$f" ] && continue
    printf "    - %-22s (%s)\n" "$(basename "$f")" "${sig//,/, }"
  done <<< "$RESULTS"
  echo ""
  echo "  run  ./findtopic.sh -v $KEYWORD  for scores + every matching practice line"
fi
