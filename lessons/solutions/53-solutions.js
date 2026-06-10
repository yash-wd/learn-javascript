/* =============================================================================
 * SOLUTIONS · 53 · INTERNATIONALIZATION (the full Intl API)
 * =============================================================================
 * Run:  node lessons/solutions/53-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/53-internationalization.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Sort ['café','car','cab'] with an Intl.Collator and compare to a plain sort. ──
const words = ['café', 'car', 'cab'];
const collator = new Intl.Collator('en'); // locale-aware: treats é like e
console.log('1.', 'collator:', [...words].sort(collator.compare));
console.log('1.', 'plain:   ', [...words].sort());
// Plain sort compares raw UTF-16 code units, so accented letters can land in
// surprising places; Collator follows the language's real alphabetical rules.

// ── 2. Write likes(n) → "1 like" / "N likes" using Intl.PluralRules. ─────────
const plural = new Intl.PluralRules('en');
function likes(n) {
  return `${n} ${plural.select(n) === 'one' ? 'like' : 'likes'}`;
}
console.log('2.', likes(1), '·', likes(5)); // => 2. 1 like · 5 likes

// ── 3. Format "in 5 minutes" and "2 weeks ago" with Intl.RelativeTimeFormat. ──
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
console.log('3.', rtf.format(5, 'minute'));  // => 3. in 5 minutes
console.log('3.', rtf.format(-2, 'week'));    // => 3. 2 weeks ago

// ── 4. Join ['HTML','CSS','JS'] as "HTML, CSS, and JS" with Intl.ListFormat. ──
const list = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
console.log('4.', list.format(['HTML', 'CSS', 'JS'])); // => 4. HTML, CSS, and JS

// ── 5. Use Intl.Segmenter to correctly count the characters in '👍🏽🎉'. ──────
// '👍🏽' is one user-perceived character built from TWO code points (thumb +
// skin-tone modifier). .length counts UTF-16 units, so it over-counts.
const emoji = '👍🏽🎉';
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const graphemes = [...segmenter.segment(emoji)].length;
console.log('5.', `${graphemes} graphemes vs naive .length ${emoji.length}`);
// => 5. 2 graphemes vs naive .length 6
