/* =============================================================================
 * 53 · INTERNATIONALIZATION (the full Intl API)
 * =============================================================================
 * Run:  node lessons/53-internationalization.js
 *
 * WHAT YOU'LL LEARN
 *   The built-in `Intl` API formats data the way each LANGUAGE/REGION expects —
 *   no libraries needed. You met NumberFormat (lesson 06) & DateTimeFormat
 *   (lesson 33); here are the rest:
 *   • Intl.Collator — locale-aware sorting & comparison
 *   • Intl.PluralRules — pick the right plural form
 *   • Intl.RelativeTimeFormat — "3 days ago", "in 2 hours"
 *   • Intl.ListFormat — "A, B, and C"
 *   • Intl.Segmenter — split text into words/sentences (any language)
 *
 * BIG IDEA: never hand-build dates, numbers, plurals, or "x ago" strings — the
 * platform already knows the rules for ~hundreds of locales. (See lesson 48 for
 * i18n in the bigger picture: translations, RTL, etc.)
 * ========================================================================== */

// ── Recap: the two you already know ──────────────────────────────────────────
console.log(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(250000));
// => ₹2,50,000.00   (note the Indian digit grouping — Intl handles it)
console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(new Date('2026-06-05')));
// => Friday, 5 June 2026


// ── 1. Intl.Collator — sort/compare the way a language does ───────────────────
// String sort with < or default .sort() is by code-point, which is WRONG for
// accents and non-English alphabets. Collator sorts correctly per locale.
const words = ['zebra', 'apple', 'Ärger', 'apple pie', 'Apfel'];
const collator = new Intl.Collator('de', { sensitivity: 'base' }); // German rules
console.log('collator sort:', [...words].sort(collator.compare));
// 'ä' sorts near 'a' (correct in German) — a naive sort would misplace it.

// `numeric: true` makes "file2" come before "file10" (human/natural order):
const files = ['file10', 'file2', 'file1'];
console.log('natural sort:', [...files].sort(new Intl.Collator(undefined, { numeric: true }).compare));
// => [ 'file1', 'file2', 'file10' ]   (not file1, file10, file2)


// ── 2. Intl.PluralRules — choose the correct plural CATEGORY ──────────────────
// English has 2 forms (1 item / N items). Other languages have up to 6. Don't
// hard-code `n === 1 ? 'item' : 'items'` — ask PluralRules which form to use.
const enPlural = new Intl.PluralRules('en-US');
function items(n) {
  const form = enPlural.select(n);            // 'one' | 'other' (for English)
  const label = { one: 'item', other: 'items' }[form];
  return `${n} ${label}`;
}
console.log(items(1), '/', items(5));         // => 1 item / 5 items
// Ordinals too (1st, 2nd, 3rd, 4th):
const ordinal = new Intl.PluralRules('en-US', { type: 'ordinal' });
const suffix = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
console.log([1, 2, 3, 4, 11, 21].map((n) => `${n}${suffix[ordinal.select(n)]}`).join(' '));
// => 1st 2nd 3rd 4th 11th 21st


// ── 3. Intl.RelativeTimeFormat — "3 days ago" / "in 2 hours" ─────────────────
// Stop writing your own "time ago" helper — this one is locale-correct.
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
console.log(rtf.format(-1, 'day'));           // => yesterday   ('auto' → words)
console.log(rtf.format(3, 'day'));            // => in 3 days
console.log(rtf.format(-2, 'hour'));          // => 2 hours ago

// A tiny helper: turn a past Date into a friendly relative string.
function timeAgo(date) {
  // (Demo uses a FIXED "now" for reproducible output; real code uses Date.now().)
  const seconds = Math.round((date - new Date('2026-06-05T12:00:00')) / 1000);
  const units = [['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  for (const [unit, secs] of units) {
    if (Math.abs(seconds) >= secs || unit === 'second') {
      return rtf.format(Math.round(seconds / secs), unit);
    }
  }
}
console.log(timeAgo(new Date('2026-06-04T12:00:00'))); // => yesterday


// ── 4. Intl.ListFormat — join a list the way humans write it ─────────────────
// "A, B, and C" (note the Oxford comma + "and") — and it localizes.
const fruits = ['apples', 'oranges', 'pears'];
console.log(new Intl.ListFormat('en', { type: 'conjunction' }).format(fruits));
// => apples, oranges, and pears
console.log(new Intl.ListFormat('en', { type: 'disjunction' }).format(fruits));
// => apples, oranges, or pears


// ── 5. Intl.Segmenter — split text into words/sentences/graphemes ────────────
// "Just split on spaces" breaks for many languages (Chinese/Japanese have no
// spaces) and for emoji. Segmenter splits text correctly anywhere.
const seg = new Intl.Segmenter('en', { granularity: 'word' });
const segments = [...seg.segment('Hello, world! 👋')];
const realWords = segments.filter((s) => s.isWordLike).map((s) => s.segment);
console.log('words:', realWords);             // => [ 'Hello', 'world' ]

// Grapheme granularity counts USER-PERCEIVED characters (emoji = 1, not many):
const graphemes = [...new Intl.Segmenter().segment('a👨‍👩‍👧b')];
console.log('grapheme count:', graphemes.length); // => 3  ('.length' would say 8+)


/* WHEN TO REACH FOR EACH ------------------------------------------------------
 *   NumberFormat ...... currency, percent, units, digit grouping (lesson 06)
 *   DateTimeFormat .... locale dates & times (lesson 33)
 *   Collator .......... sorting/searching strings correctly (accents, numeric)
 *   PluralRules ....... "1 item" vs "5 items", ordinals (1st/2nd/3rd)
 *   RelativeTimeFormat  "3 days ago", "in 2 hours"
 *   ListFormat ........ "A, B, and C"
 *   Segmenter ......... counting/splitting words & characters in ANY language
 *
 * All of Intl is built into Node and every modern browser — zero dependencies.
 * --------------------------------------------------------------------------- */

/* PRACTICE -------------------------------------------------------------------
 *   1. Sort ['café','car','cab'] with an Intl.Collator and compare to a plain sort.
 *   2. Write likes(n) → "1 like" / "N likes" using Intl.PluralRules.
 *   3. Format "in 5 minutes" and "2 weeks ago" with Intl.RelativeTimeFormat.
 *   4. Join ['HTML','CSS','JS'] as "HTML, CSS, and JS" with Intl.ListFormat.
 *   5. Use Intl.Segmenter to correctly count the characters in '👍🏽🎉'.
 * ------------------------------------------------------------------------- */
