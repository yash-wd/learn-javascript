/* =============================================================================
 * 27 · REGULAR EXPRESSIONS (Regex)
 * =============================================================================
 * Run:  node lessons/27-regular-expressions.js
 *
 * WHAT YOU'LL LEARN
 *   • Creating patterns and the common flags
 *   • Character classes, quantifiers, anchors, groups
 *   • Lookahead & lookbehind (match based on what's around)
 *   • The modern flags: u (unicode), s (dotAll), y (sticky), v (unicodeSets)
 *   • test / match / matchAll / replace / split with regex
 *
 * A regex is a tiny pattern language for finding/validating/replacing text.
 * Read each pattern's comment slowly — that's how regex "clicks".
 * ========================================================================== */

// ── 1. Creating a regex ──────────────────────────────────────────────────────
const literal = /cat/;                 // literal notation (preferred)
const fromString = new RegExp('cat');  // when the pattern is dynamic/in a variable
console.log(literal.test('a cat'));    // => true   (.test → does it match? boolean)
console.log(fromString.test('dog'));   // => false


// ── 2. Flags (after the closing slash) ───────────────────────────────────────
//   g → global (find ALL matches, not just the first)
//   i → case-insensitive
//   m → multiline (^ and $ match per line)
console.log('Cat cat CAT'.match(/cat/gi)); // => [ 'Cat', 'cat', 'CAT' ]


// ── 3. Character classes — what kind of character ────────────────────────────
//   \d digit      \w word char (a-z A-Z 0-9 _)     \s whitespace
//   \D not-digit  \W not-word                       \S not-space
//   .  any char (except newline)
//   [abc] one of a/b/c     [a-z] a range     [^abc] NOT a/b/c
console.log('Order #42 ok'.match(/\d+/));   // => [ '42', ... ]  (\d+ = one or more digits)
console.log('a1 b2 c3'.match(/[a-c]\d/g));  // => [ 'a1', 'b2', 'c3' ]


// ── 4. Quantifiers — how many ────────────────────────────────────────────────
//   *  zero or more     +  one or more     ?  zero or one (optional)
//   {3}  exactly 3      {2,4} between 2-4   {2,} 2 or more
console.log(/colou?r/.test('color'));  // => true  (the u is optional)
console.log(/colou?r/.test('colour')); // => true
console.log('aaa'.match(/a{2}/));      // => [ 'aa', ... ]


// ── 5. Anchors — position ────────────────────────────────────────────────────
//   ^ start of string      $ end of string      \b word boundary
console.log(/^hello/.test('hello world')); // => true  (starts with hello)
console.log(/world$/.test('hello world')); // => true  (ends with world)
console.log(/\bcat\b/.test('the cat sat')); // => true (whole word "cat")
console.log(/\bcat\b/.test('category'));    // => false (cat is part of a word)


// ── 6. Groups & capturing ────────────────────────────────────────────────────
// ( ) captures part of the match so you can reuse it.
const date = '2026-06-04';
const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(match[0]); // => 2026-06-04  (whole match)
console.log(match[1]); // => 2026        (first group)
console.log(match[2]); // => 06          (second group)

// Named groups are clearer:
const named = date.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log(named.groups.year, named.groups.month); // => 2026 06

// Non-capturing group (?:...) — group for structure WITHOUT creating a $1 slot:
console.log('abcabc'.match(/(?:abc)+/)[0]); // => abcabc  (grouped, not captured)


// ── 6b. Lookahead & lookbehind — match by CONTEXT (not consumed) ──────────────
// These assert what comes BEFORE/AFTER without including it in the match.
//   (?=...)  positive lookahead   — followed by ...
//   (?!...)  negative lookahead   — NOT followed by ...
//   (?<=...) positive lookbehind  — preceded by ...
//   (?<!...) negative lookbehind  — NOT preceded by ...

// Get the number, but only when it's followed by "px" (the px isn't captured):
console.log('width: 42px'.match(/\d+(?=px)/)[0]); // => 42

// Get the amount AFTER a "$" (the $ isn't part of the match):
console.log('Total $59 now'.match(/(?<=\$)\d+/)[0]); // => 59

// Negative lookahead — a word NOT followed by "ing":
console.log('run runs running'.match(/run(?!ning)/g)); // => [ 'run', 'run' ]

// Classic use: add thousands separators by inserting commas at the right spots.
console.log('1234567'.replace(/\B(?=(\d{3})+(?!\d))/g, ',')); // => 1,234,567


// ── 6c. Modern flags: u (unicode), s (dotAll), y (sticky) ────────────────────
//   u → full Unicode mode. Required for \p{...} property escapes & astral chars.
console.log(/\p{Emoji}/u.test('hi 👋'));     // => true  (match by Unicode property)
console.log([...'a😀b'].length);             // => 3  (spread is unicode-aware)
//   s → "dotAll": let . match newlines too (by default it doesn't).
console.log(/a.b/s.test('a\nb'));            // => true  (without /s → false)
//   y → "sticky": match ONLY at regex.lastIndex, then advance it. Great for
//       tokenizers/parsers that scan a string piece by piece.
const sticky = /\d+/y;
sticky.lastIndex = 5;
console.log(sticky.exec('abc  123')[0]);     // => 123  (matches starting at idx 5)
//   v → "unicodeSets" (ES2024): a smarter, stricter superset of u. It adds set
//       operations inside character classes and matches multi-codepoint graphemes.
//   • Intersection [A&&B] — match chars in BOTH sets:
console.log('café'.replace(/[\p{L}&&\p{ASCII}]/gu, '*')); // => "****"  (u: can't AND; && is literal → letters OR ascii)
console.log('café'.replace(/[\p{L}&&\p{ASCII}]/gv, '*')); // => "***é"  (v: letters AND ascii → é kept, it's non-ASCII)
//   • Subtraction [A--B] — match chars in A but NOT B:
console.log('café 123!'.replace(/[\p{L}--[aeiou]]/gv, '*')); // => "*a** 123!"  (letters except vowels)
//   • Match a whole multi-codepoint grapheme via \q{} string literals:
console.log(/[\q{👍🏽}]/v.test('👍🏽'));       // => true  (one class entry = a string)
//   Rule of thumb: prefer /v over /u in new code when you use \p{...} or classes.


// ── 7. The string methods that take a regex ──────────────────────────────────
// match — first match (or with /g, all matches as an array)
console.log('cat bat hat'.match(/[cbh]at/g)); // => [ 'cat', 'bat', 'hat' ]

// matchAll — all matches WITH their groups (returns an iterator)
for (const m of 'a1 b2'.matchAll(/(\w)(\d)/g)) {
  console.log(m[1], m[2]); // => a 1 / b 2
}

// replace — find & replace ($1 refers to a captured group)
console.log('2026-06-04'.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')); // => 04/06/2026
console.log('a b  c   d'.replace(/\s+/g, ' ')); // => "a b c d" (collapse spaces)

// split — split on a pattern
console.log('a, b ,c ,  d'.split(/\s*,\s*/)); // => [ 'a', 'b', 'c', 'd' ]


// ── 8. Practical validators ──────────────────────────────────────────────────
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
console.log(isEmail('sam@example.com')); // => true
console.log(isEmail('not-an-email'));    // => false

// ⚠️ Don't over-trust regex for emails/URLs in production — but it's great for
// quick format checks and pulling data out of text.


/* CHEAT SHEET ----------------------------------------------------------------
 *   \d \w \s   digit / word / space        ^ $ \b   start / end / boundary
 *   *  +  ?    many / 1+ / optional         {n} {n,m} exact / range counts
 *   [abc] [^abc] one-of / none-of          ( ) capture   (?<name> ) named
 *   (?:..) non-capturing group             (?=) (?!) lookahead pos/neg
 *   (?<=) (?<!) lookbehind pos/neg         \p{...} unicode property (needs u)
 *   flags: g (all)  i (ignore case)  m (multiline)  s (dot matches \n)
 *          u (unicode)  y (sticky — match at lastIndex only)  d (match indices)
 *          v (unicodeSets — superset of u: set ops [A&&B]/[A--B] & \q{} strings)
 *   Tip: build & test patterns at regex101.com — it explains every token.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Write a regex that matches a 10-digit phone number.
 *   2. Extract all hashtags from "love #js and #coding" using matchAll.
 *   3. Replace every vowel in "hello world" with "*".
 *   4. Use a lookbehind to grab the number after "id=" in "?id=42&x=1".
 *   5. Use a negative lookahead to match "cat" only when NOT followed by "alog".
 * ------------------------------------------------------------------------- */
