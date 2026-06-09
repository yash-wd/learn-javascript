/* =============================================================================
 * SOLUTIONS · 12 · ARRAYS — basics
 * =============================================================================
 * Run:  node lessons/solutions/12-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/12-arrays.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. Start with [], push 3 items, then remove the first one. ───────────────
const items = [];
items.push('a', 'b', 'c'); // push appends to the end
const first = items.shift(); // shift removes (and returns) the first item
console.log('1.', 'removed:', first, '→', items); // => 1. removed: a → [ 'b', 'c' ]

// ── 2. Sort [42, 7, 100, 1] numerically ascending and descending. ────────────
// Default sort is alphabetical, so always pass a numeric comparator.
const asc = [42, 7, 100, 1].sort((a, z) => a - z);
const desc = [42, 7, 100, 1].sort((a, z) => z - a);
console.log('2.', 'asc:', asc);   // => 2. asc: [ 1, 7, 42, 100 ]
console.log('2.', 'desc:', desc); // => 2. desc: [ 100, 42, 7, 1 ]

// ── 3. Copy an array, mutate the copy, and prove the original is unchanged. ──
const original = [1, 2, 3];
const copy = [...original]; // spread makes a shallow copy (a new array)
copy.push(4);
console.log('3.', 'original:', original, 'copy:', copy);
// => 3. original: [ 1, 2, 3 ] copy: [ 1, 2, 3, 4 ]
