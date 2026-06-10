/* =============================================================================
 * SOLUTIONS · 27 · REGULAR EXPRESSIONS (Regex)
 * =============================================================================
 * Run:  node lessons/solutions/27-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/27-regular-expressions.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Write a regex that matches a 10-digit phone number. ───────────────────
const phone = /^\d{10}$/; // ^ and $ anchor it to the WHOLE string
console.log('1.', phone.test('5551234567'), phone.test('123')); // => 1. true false

// ── 2. Extract all hashtags from "love #js and #coding" using matchAll. ──────
const tags = [...'love #js and #coding'.matchAll(/#(\w+)/g)].map((m) => m[1]);
console.log('2.', tags); // => 2. [ 'js', 'coding' ]   (group 1 = text after #)

// ── 3. Replace every vowel in "hello world" with "*". ────────────────────────
console.log('3.', 'hello world'.replace(/[aeiou]/g, '*')); // => 3. h*ll* w*rld

// ── 4. Use a lookbehind to grab the number after "id=" in "?id=42&x=1". ──────
// (?<=id=) matches a position PRECEDED by "id=" without including it in the result.
console.log('4.', '?id=42&x=1'.match(/(?<=id=)\d+/)[0]); // => 4. 42

// ── 5. Use a negative lookahead to match "cat" only when NOT followed by "alog". ──
// cat(?!alog) → "cat" but not the "cat" inside "catalog".
const text = 'a cat, a catalog, a category';
const cats = [...text.matchAll(/cat(?!alog)/g)];
console.log('5.', cats.length, 'matches'); // => 5. 2 matches  (cat + category, not catalog)
