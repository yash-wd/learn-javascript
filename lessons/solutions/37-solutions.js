/* =============================================================================
 * SOLUTIONS · 37 · MODERN JAVASCRIPT (ES2021 → ES2026)
 * =============================================================================
 * Run:  node lessons/solutions/37-solutions.js   (needs Node 22+)
 *
 * Worked answers to the PRACTICE block in lessons/37-modern-js.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Rewrite lesson 13's letter-counting reduce using Object.groupBy. ──────
// Object.groupBy buckets items by a key function → { key: [items…] }.
const letters = [...'banana'];
const grouped = Object.groupBy(letters, (ch) => ch); // { b:['b'], a:['a','a','a'], n:['n','n'] }
const counts = Object.fromEntries(
  Object.entries(grouped).map(([letter, group]) => [letter, group.length])
);
console.log('1.', counts); // => 1. { b: 1, a: 3, n: 2 }

// ── 2. Replace a [...arr].sort() somewhere in your code with arr.toSorted(). ──
// .toSorted() returns a NEW sorted array and leaves the original untouched —
// no more defensive [...spread] copy needed.
const scores = [42, 7, 100, 1];
const sorted = scores.toSorted((a, b) => a - b);
console.log('2.', 'sorted:', sorted, '· original:', scores);
// => 2. sorted: [ 1, 7, 42, 100 ] · original: [ 42, 7, 100, 1 ]

// ── 3. Use Set.intersection to find common items in two arrays of tags. ──────
const postTags = new Set(['js', 'css', 'html', 'node']);
const userTags = new Set(['css', 'js', 'sql']);
console.log('3.', [...postTags.intersection(userTags)]); // => 3. [ 'css', 'js' ]
