/* =============================================================================
 * SOLUTIONS · 13 · ARRAY METHODS — map, filter, reduce & friends
 * =============================================================================
 * Run:  node lessons/solutions/13-solutions.js
 *
 * Worked answers to the PRACTICE block in lessons/13-array-methods.js.
 * Try each problem YOURSELF first — then compare.
 * ========================================================================== */

// ── 1. From [1..10], map to squares, then filter to keep only even squares. ──
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenSquares = nums
  .map((n) => n * n)           // 1, 4, 9, 16, …
  .filter((sq) => sq % 2 === 0); // keep the even ones
console.log('1.', evenSquares); // => 1. [ 4, 16, 36, 64, 100 ]

// ── 2. Use reduce to find the longest word in ['hi','hello','hey','howdy']. ──
const longest = ['hi', 'hello', 'hey', 'howdy'].reduce((best, word) =>
  word.length > best.length ? word : best
);
console.log('2.', longest); // => 2. hello

// ── 3. From a list of {name, age} people, get the names of everyone 18+. ─────
const people = [
  { name: 'Ada', age: 17 },
  { name: 'Linus', age: 21 },
  { name: 'Grace', age: 40 },
  { name: 'Kit', age: 12 },
];
const adults = people.filter((p) => p.age >= 18).map((p) => p.name);
console.log('3.', adults); // => 3. [ 'Linus', 'Grace' ]
